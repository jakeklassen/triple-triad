import { ReadonlyDeep } from 'type-fest';
import { Board, Position } from './common-types';

export const whoPlayedCard = (
  board: ReadonlyDeep<Board>,
  position: ReadonlyDeep<Position>,
) => {
  const [row, column] = position;

  return board[row]?.[column]?.split(':')?.[0];
};
