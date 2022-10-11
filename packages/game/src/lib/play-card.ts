import { ReadonlyDeep } from 'type-fest';
import { CARDS } from './cards';
import { Board, Card, Position } from './common-types';
import { BOARD_SIZE } from './create-game';
import {
  BoardIsFullError,
  DuplicateCardError,
  IllegalMoveError,
  IllegalStartError,
  OutOfBoundsError,
  PositionAlreadyOccupiedError,
} from './errors';
import { findDuplicatePlayerCard } from './find-duplicate-player-card';
import { getCardFlips } from './get-card-flips';
import { isBoardEmpty } from './is-board-empty';
import { isBoardFull } from './is-board-full';
import { Player, PlayerLabel } from './player';
import { sumPlayerTurns } from './sum-player-turns';

type PlayCardResults = {
  flips: Position[][];
  gameOver: boolean;
  newBoard: ReadonlyDeep<Board>;
  scoreChange: number;
};

export const playCard = (
  board: ReadonlyDeep<Board>,
  whoWentFirst: PlayerLabel,
  player: ReadonlyDeep<Player>,
  card: ReadonlyDeep<Card>,
  position: ReadonlyDeep<Position>,
): PlayCardResults => {
  if (isBoardFull(board)) {
    throw new BoardIsFullError();
  }

  const [row, column] = position;

  if (isBoardEmpty(board) && whoWentFirst !== player.label) {
    throw new IllegalStartError();
  }

  // If board is not empty, perform illegal move check
  if (isBoardEmpty(board) === false) {
    const { playerOneMoveCount, playerTwoMoveCount } = sumPlayerTurns(board);

    if (
      whoWentFirst === Player.One &&
      player.label === Player.One &&
      playerOneMoveCount > playerTwoMoveCount
    ) {
      throw new IllegalMoveError();
    }

    if (
      whoWentFirst === Player.Two &&
      player.label === Player.Two &&
      playerTwoMoveCount > playerOneMoveCount
    ) {
      throw new IllegalMoveError();
    }

    if (
      playerOneMoveCount === playerTwoMoveCount &&
      player.label !== whoWentFirst
    ) {
      throw new IllegalMoveError();
    }
  }

  if (row >= BOARD_SIZE || column >= BOARD_SIZE) {
    throw new OutOfBoundsError();
  }

  if (board[row][column] != null) {
    throw new PositionAlreadyOccupiedError();
  }

  const duplicateCard = findDuplicatePlayerCard(
    board,
    player.label,
    player.label,
    card,
  );

  if (duplicateCard === true) {
    throw new DuplicateCardError(`${card.name} is already in play`);
  }

  const playerLabel = player.label.toLowerCase();
  const cardName = card.name.toLowerCase();

  const newBoard = structuredClone(board) as Board;
  newBoard[row][column] = `${playerLabel}:${playerLabel}:${cardName}`;

  const flips = getCardFlips(newBoard, CARDS, player, card, row, column);
  const scoreChange = flips.flat().length;
  const gameOver = isBoardFull(newBoard);

  return { newBoard, flips, scoreChange, gameOver };
};
