import * as TripleTriad from '@tripletriad/game';
import clsx from 'clsx';
import { useState } from 'react';
import { ReadonlyDeep } from 'type-fest';
import boardUrl from '../../assets/board.png';
import { Hand } from '../Hand/Hand';

const BOARD_WIDTH = 384;
const BOARD_HEIGHT = 224;

type BoardProps = {
  board: ReadonlyDeep<TripleTriad.CommonTypes.Board>;
  playerOne: TripleTriad.Player;
  playerTwo: TripleTriad.Player;
  whoGoesFirst: TripleTriad.PlayerLabel;
};

export const Board = ({
  board,
  playerOne,
  playerTwo,
  whoGoesFirst,
}: BoardProps) => {
  const [currentTurn] = useState<TripleTriad.PlayerLabel>(whoGoesFirst);

  // TODO: react to window resize and update scale factor using Jake's pixel art game code
  const [scaleFactor] = useState(3);

  const cards = board.flat();

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
      <Hand player={playerOne} active={currentTurn === playerOne.label} />

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
        {cards}
      </div>

      <Hand player={playerTwo} active={currentTurn === playerTwo.label} />
    </div>
  );
};
