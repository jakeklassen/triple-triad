import * as TripleTriad from '@tripletriad/game';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ReadonlyDeep } from 'type-fest';
import { ClientMessage } from '../../../../backend-socketio/src/schemas/client-message';
import { ServerMessage } from '../../../../backend-socketio/src/schemas/server-message';
import boardUrl from '../../assets/board.png';
import { Hand } from '../Hand';
import { Cell } from './Cell';

const BOARD_WIDTH = 384;
const BOARD_HEIGHT = 224;

export type MatchData = {
  socket: Socket;
  gameId: string;
  whichPlayer: TripleTriad.PlayerLabel;
};

type BoardProps = {
  initialBoard: ReadonlyDeep<TripleTriad.CommonTypes.Board>;
  playerOne: TripleTriad.Player;
  playerTwo: TripleTriad.Player;
  whoGoesFirst: TripleTriad.PlayerLabel;
  size: number;
  matchData: MatchData;
  onGameOver: (gameOverMessage: string) => void;
};

export const Board = ({
  initialBoard,
  playerOne,
  playerTwo,
  whoGoesFirst,
  size,
  matchData,
  onGameOver,
}: BoardProps) => {
  const [selectedCard, setSelectedCard] = useState<string>();
  const [currentTurn, setCurrentTurn] =
    useState<TripleTriad.PlayerLabel>(whoGoesFirst);
  const [board, setBoard] = useState<typeof initialBoard>(initialBoard);
  const [playerOneScore, setPlayerOneScore] = useState<number>(5);
  const [playerTwoScore, setPlayerTwoScore] = useState<number>(5);

  // TODO: react to window resize and update scale factor using Jake's pixel art game code
  const [scaleFactor] = useState(3);

  useEffect(() => {
    matchData.socket.on('message', (message: ServerMessage) => {
      if (message.event === 'card-played') {
        setBoard(message.board);
        setCurrentTurn(message.nextTurn);

        const player =
          message.nextTurn === TripleTriad.PlayerLabel.One
            ? playerTwo
            : playerOne;

        const card = TripleTriad.CARDS.find(
          (card) => card.name.toLowerCase() === message.cardName.toLowerCase(),
        );

        if (card != null) {
          player.hand = TripleTriad.removeCard(player.hand, card);
        }

        setPlayerOneScore(message.playerOneScore);
        setPlayerTwoScore(message.playerTwoScore);

        if (message.gameOver === true) {
          const winner =
            message.playerOneScore > message.playerTwoScore
              ? playerOne.label
              : playerTwo.label;

          let gameOverMessage = `You ${
            winner === matchData.whichPlayer ? 'win' : 'lose'
          }!`;

          if (message.playerOneScore === message.playerTwoScore) {
            gameOverMessage = `It's a draw!`;
          }

          onGameOver(gameOverMessage);
        }
      }
    });
  }, [playerOneScore, playerTwoScore]);

  const onCardSelected = (player: TripleTriad.Player, cardName: string) => {
    if (matchData.whichPlayer != currentTurn) {
      return;
    }

    const message: ClientMessage = {
      event: 'select-card',
      gameId: matchData.gameId,
      player,
      cardName,
    };
    matchData.socket.emit('message', message);

    setSelectedCard(`${player.label}:${cardName.toLowerCase()}`);
  };

  const onCellSelected = (row: number, column: number) => {
    if (selectedCard == null) {
      return;
    }

    const [, cardName] = selectedCard.split(':');

    const player = currentTurn === 'one' ? playerOne : playerTwo;
    const card = player.hand.find(
      (card) => card?.name.toLowerCase() === cardName,
    );

    if (card == null) {
      throw new Error('Card not found');
    }

    const { newBoard } = TripleTriad.playCard(
      board,
      whoGoesFirst,
      player,
      card,
      [row, column],
    );

    setBoard(newBoard);
    player.hand = TripleTriad.removeCard(player.hand, card);
    setSelectedCard(undefined);
    setCurrentTurn(
      currentTurn === TripleTriad.PlayerLabel.One
        ? TripleTriad.PlayerLabel.Two
        : TripleTriad.PlayerLabel.One,
    );

    const message: ClientMessage = {
      event: 'play-card',
      gameId: matchData.gameId,
      playerLabel: matchData.whichPlayer,
      cardName: selectedCard.split(':')[1],
      row,
      column,
    };
    matchData.socket.emit('message', message);
  };

  const cells = board.flat().map((cell, idx) => {
    const [row, column] = [Math.trunc(idx / size), idx % size];
    const [playerLabel, ownerLabel, cardName] = cell?.split(':') ?? [];

    const card = TripleTriad.CARDS.find(
      (card) => card.name.toLowerCase() === cardName?.toLowerCase(),
    );

    return (
      <Cell
        key={`${row}:${column}`}
        row={row}
        column={column}
        card={card}
        playerLabel={playerLabel as TripleTriad.PlayerLabel}
        ownerLabel={ownerLabel as TripleTriad.PlayerLabel}
        selectable={
          selectedCard != null && matchData.whichPlayer === currentTurn
        }
        onClick={onCellSelected}
      />
    );
  });

  return (
    <div
      className={clsx('grid', `grid-cols-[97px_190px_97px]`, 'grid-rows-[1fr]')}
      style={{
        backgroundImage: `url(${boardUrl})`,
        backgroundSize: `${BOARD_WIDTH}px`,
        imageRendering: 'pixelated',
        width: `${BOARD_WIDTH}px`,
        height: `${BOARD_HEIGHT}px`,
        transform: `scale(${scaleFactor})`,
      }}
    >
      <Hand
        player={playerOne}
        active={currentTurn === playerOne.label}
        score={playerOneScore}
        onCardSelected={onCardSelected}
        matchData={matchData}
        currentTurn={currentTurn}
      />

      {/* Grid */}
      <div
        className={clsx(
          'col-span-1',
          'row-span-1',
          'grid',
          'grid-cols-3',
          'grid-rows-3',
          `gap-[2px]`,
          `mt-[18px]`,
          `mb-[16px]`,
          'text-black',
        )}
      >
        {cells}
      </div>

      <Hand
        player={playerTwo}
        active={currentTurn === playerTwo.label}
        score={playerTwoScore}
        onCardSelected={onCardSelected}
        matchData={matchData}
        currentTurn={currentTurn}
      />
    </div>
  );
};
