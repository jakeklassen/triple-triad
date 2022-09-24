import { CARDS } from '@tripletriad/game';
import random from 'just-random';
import { useState } from 'react';
import boardUrl from '../../assets/board.png';
import { Card } from '../Card';

const randomColor = (): 'red' | 'blue' => random(['red', 'blue']);

const BOARD_WIDTH = 384;
const BOARD_HEIGHT = 224;

export const Board = () => {
  const [scaleFactor] = useState(1);

  const leftHandWidth = 97 * scaleFactor;
  const rightHandWidth = 97 * scaleFactor;
  const gridWidth = 190 * scaleFactor;

  // 97px_190px_97px

  return (
    <div
      className="grid grid-cols-[97px_190px_97px] grid-rows-[1fr]"
      style={{
        backgroundImage: `url(${boardUrl})`,
        backgroundSize: `${BOARD_WIDTH * scaleFactor}px`,
        imageRendering: 'pixelated',
        width: `${BOARD_WIDTH * scaleFactor}px`,
        height: `${BOARD_HEIGHT * scaleFactor}px`,
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
        className={`col-span-1 row-span-1 grid grid-cols-3 grid-rows-3 gap-[2px] mt-[18px] mb-[16px] text-black`}
      >
        <div>
          <Card
            card={{ ...random(CARDS), color: randomColor() }}
            style={{ transform: `scale(${scaleFactor})` }}
          />
        </div>
        <div>
          <Card
            card={{ ...random(CARDS), color: randomColor() }}
            style={{ transform: `scale(${scaleFactor})` }}
          />
        </div>
        <div>
          <Card
            card={{ ...random(CARDS), color: randomColor() }}
            style={{ transform: `scale(${scaleFactor})` }}
          />
        </div>

        <div>
          <Card
            card={{ ...random(CARDS), color: randomColor() }}
            style={{ transform: `scale(${scaleFactor})` }}
          />
        </div>
        <div>
          <Card
            card={{ ...random(CARDS), color: randomColor() }}
            style={{ transform: `scale(${scaleFactor})` }}
          />
        </div>
        <div>
          <Card
            card={{ ...random(CARDS), color: randomColor() }}
            style={{ transform: `scale(${scaleFactor})` }}
          />
        </div>

        <div>
          <Card
            card={{ ...random(CARDS), color: randomColor() }}
            style={{ transform: `scale(${scaleFactor})` }}
          />
        </div>
        <div>
          <Card
            card={{ ...random(CARDS), color: randomColor() }}
            style={{ transform: `scale(${scaleFactor})` }}
          />
        </div>
        <div>
          <Card
            card={{ ...random(CARDS), color: randomColor() }}
            style={{ transform: `scale(${scaleFactor})` }}
          />
        </div>
      </div>

      <div className="col-span-1 row-span-1">right</div>
    </div>
  );
};
