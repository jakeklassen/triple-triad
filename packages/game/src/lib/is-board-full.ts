import { ReadonlyDeep } from 'type-fest';
import { Board } from './common-types';

export const isBoardFull = (board: ReadonlyDeep<Board>) => {
  return board.every((row) => row.every((cell) => cell != null));
};
