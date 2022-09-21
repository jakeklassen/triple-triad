import { ReadonlyDeep } from 'type-fest';
import { Card, CARDS } from './cards';
import { Board, Position } from './common-types';
import { BOARD_SIZE } from './create-game';
import { findDuplicatePlayerCard } from './find-duplicate-player-card';
import { getCardFlips } from './get-card-flips';
import { isBoardFull } from './is-board-full';
import { Player } from './player';

type PlayCardsResults = {
  flips: Position[][];
  gameOver: boolean;
  newBoard: ReadonlyDeep<Board>;
  scoreChange: number;
};

export const playCard = (
  board: ReadonlyDeep<Board>,
  player: ReadonlyDeep<Player>,
  card: ReadonlyDeep<Card>,
  position: ReadonlyDeep<Position>,
): PlayCardsResults => {
  const [row, column] = position;

  if (row >= BOARD_SIZE || column >= BOARD_SIZE) {
    throw new Error('Position is out of bounds');
  }

  if (board[row][column] != null) {
    throw new Error('Position is already occupied');
  }

  const duplicateCard = findDuplicatePlayerCard(board, player.label, card);

  if (duplicateCard === true) {
    throw new Error('Card is already in play');
  }

  const playerLabel = player.label.toLowerCase();
  const cardName = card.name.toLowerCase();

  const newBoard = structuredClone(board) as Board;
  newBoard[row][column] = `${playerLabel}:${cardName}`;

  const flips = getCardFlips(newBoard, CARDS, player, card, row, column);
  const scoreChange = flips.flat().length;
  const gameOver = isBoardFull(newBoard);

  return { newBoard, flips, scoreChange, gameOver };
};
