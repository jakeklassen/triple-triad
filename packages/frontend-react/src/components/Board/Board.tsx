import * as TripleTriad from '@tripletriad/game';
import clsx from 'clsx';
import { useState } from 'react';
import { ReadonlyDeep } from 'type-fest';
import boardUrl from '../../assets/board.png';
import { Hand } from '../Hand';
import { Cell } from './Cell';

const BOARD_WIDTH = 384;
const BOARD_HEIGHT = 224;

type BoardProps = {
  initialBoard: ReadonlyDeep<TripleTriad.CommonTypes.Board>;
  playerOne: TripleTriad.Player;
  playerTwo: TripleTriad.Player;
  whoGoesFirst: TripleTriad.PlayerLabel;
  size: number;
};

export const Board = ({
  initialBoard,
  playerOne,
  playerTwo,
  whoGoesFirst,
  size,
}: BoardProps) => {
  const [selectedCard, setSelectedCard] = useState<string>();
  const [currentTurn, setCurrentTurn] =
    useState<TripleTriad.PlayerLabel>(whoGoesFirst);
  const [board, setBoard] = useState<typeof initialBoard>(initialBoard);
  const [playerOneScore, setPlayerOneScore] = useState<number>(5);
  const [playerTwoScore, setPlayerTwoScore] = useState<number>(5);

  // TODO: react to window resize and update scale factor using Jake's pixel art game code
  const [scaleFactor] = useState(3);

  const onCardSelected = (player: TripleTriad.Player, cardName: string) => {
    console.log(`${player.label}:${cardName.toLowerCase()}`);

    setSelectedCard(`${player.label}:${cardName.toLowerCase()}`);
  };

  const onCellSelected = (row: number, column: number) => {
    if (selectedCard == null) {
      return;
    }

    console.log({ row, column, selectedCard });

    const [, cardName] = selectedCard.split(':');

    const player = currentTurn === 'one' ? playerOne : playerTwo;
    const card = player.hand.find(
      (card) => card?.name.toLowerCase() === cardName,
    );

    if (card == null) {
      throw new Error('Card not found');
    }

    const { newBoard, scoreChange } = TripleTriad.playCard(
      board,
      whoGoesFirst,
      player,
      card,
      [row, column],
    );

    setPlayerOneScore(
      playerOneScore + (currentTurn === 'one' ? scoreChange : -scoreChange),
    );
    setPlayerTwoScore(
      playerTwoScore + (currentTurn === 'two' ? scoreChange : -scoreChange),
    );

    setBoard(newBoard);
    player.removeCard(card);
    setSelectedCard(undefined);
    setCurrentTurn(currentTurn === 'one' ? 'two' : 'one');
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
        selectable={selectedCard != null}
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
      />
    </div>
  );
};
