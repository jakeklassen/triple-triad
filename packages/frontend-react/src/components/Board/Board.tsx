import { CARDS } from '@tripletriad/game';
import clsx from 'clsx';
import random from 'just-random';
import { useState } from 'react';
import boardUrl from '../../assets/board.png';
import { Card } from '../Card';

const randomColor = (): 'red' | 'blue' => random(['red', 'blue']);

const BOARD_WIDTH = 384;
const BOARD_HEIGHT = 224;

export const Board = () => {
  // TODO: react to window resize and update scale factor using Jake's pixel art game code
  const [scaleFactor] = useState(3);

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
      <div className="flex-row col-span-1 row-span-1 justify-center">
        {/* <Card card={{ ...random(CARDS), color: 'red' }} />
        <Card card={{ ...random(CARDS), color: 'red' }} />
        <Card card={{ ...random(CARDS), color: 'red' }} />
        <Card card={{ ...random(CARDS), color: 'red' }} />
        <Card card={{ ...random(CARDS), color: 'red' }} /> */}
      </div>

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
        <Card card={{ ...random(CARDS), color: randomColor() }} />

        <Card card={{ ...random(CARDS), color: randomColor() }} />

        <Card card={{ ...random(CARDS), color: randomColor() }} />

        <Card card={{ ...random(CARDS), color: randomColor() }} />

        <Card card={{ ...random(CARDS), color: randomColor() }} />

        <Card card={{ ...random(CARDS), color: randomColor() }} />

        <Card card={{ ...random(CARDS), color: randomColor() }} />

        <Card card={{ ...random(CARDS), color: randomColor() }} />

        <Card card={{ ...random(CARDS), color: randomColor() }} />
      </div>

      <div className="col-span-1 row-span-1">right</div>
    </div>
  );
};
