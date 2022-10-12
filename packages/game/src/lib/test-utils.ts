import justSplit from 'just-split';
import { Board, Cell, Hand } from './common-types';
import { PlayerLabel } from './player';

export const createBoardFromHand = (
  hand: Hand,
  firstMove: PlayerLabel,
  otherPlayer: PlayerLabel,
  movesRemaining = 1,
): Board => {
  const cells: Array<Cell> = [];

  let moveCount = 9;
  let cardIndex = 0;

  while (moveCount > movesRemaining) {
    const card = hand[cardIndex];

    cells.push(`${firstMove}:${firstMove}:${card?.name.toLowerCase()}`);

    --moveCount;

    if (moveCount <= movesRemaining) {
      break;
    }

    cells.push(`${otherPlayer}:${otherPlayer}:${card?.name.toLowerCase()}`);

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
