import justSplit from 'just-split';
import { Card } from './cards';
import { Board, Cell } from './common-types';
import { PlayerLabel } from './player';

export const createBoardFromHand = (
  hand: Card[],
  firstMove: PlayerLabel,
  otherPlayer: PlayerLabel,
  movesRemaining = 1,
): Board => {
  const cells: Array<Cell> = [];

  let moveCount = 9;
  let cardIndex = 0;

  while (moveCount > movesRemaining) {
    const card = hand[cardIndex];

    cells.push(`${firstMove}:${card.name.toLowerCase()}`);

    --moveCount;

    if (moveCount <= movesRemaining) {
      break;
    }

    cells.push(`${otherPlayer}:${card.name.toLowerCase()}`);

    --moveCount;

    if (moveCount <= movesRemaining) {
      break;
    }

    ++cardIndex;
  }

  while (cells.length < 9) {
    cells.push(undefined);
  }

  return justSplit(cells, 3);
};
