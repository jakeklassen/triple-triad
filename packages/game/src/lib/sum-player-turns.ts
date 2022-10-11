import { ReadonlyDeep } from 'type-fest';
import { Board } from './common-types';
import { Player } from './player';

export const sumPlayerTurns = (board: ReadonlyDeep<Board>) => {
  const flat = board.flat();

  const playerOneMoveCount = flat.filter(
    (cell) => cell?.split(':')[0] === Player.One,
  ).length;

  const playerTwoMoveCount = flat.filter(
    (cell) => cell?.split(':')[0] === Player.Two,
  ).length;

  return {
    playerOneMoveCount,
    playerTwoMoveCount,
  };
};
