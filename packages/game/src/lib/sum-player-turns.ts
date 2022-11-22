import { ReadonlyDeep } from 'type-fest';
import { Board } from './common-types';
import { PlayerLabel } from './player';

export const sumPlayerTurns = (board: ReadonlyDeep<Board>) => {
  const flat = board.flat();

  const playerOneMoveCount = flat.filter((cell) =>
    cell?.startsWith(PlayerLabel.One),
  ).length;

  const playerTwoMoveCount = flat.filter((cell) =>
    cell?.startsWith(PlayerLabel.Two),
  ).length;

  return {
    playerOneMoveCount,
    playerTwoMoveCount,
  };
};
