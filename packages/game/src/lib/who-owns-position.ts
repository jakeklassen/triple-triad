import { ReadonlyDeep } from 'type-fest';
import { Board, Position } from './common-types';

export const whoOwnsPosition = (
  board: ReadonlyDeep<Board>,
  position: ReadonlyDeep<Position>,
) => {
  const [row, column] = position;

  return board[row]?.[column]?.split(':')?.[0];
};
