import { ReadonlyDeep } from 'type-fest';
import { Card } from './cards';
import { Board, Position } from './common-types';

export const getCardFromPosition = (
  board: ReadonlyDeep<Board>,
  cards: ReadonlyDeep<Card[]>,
  position: ReadonlyDeep<Position>,
) => {
  const [row, column] = position;
  const cell = board[row]?.[column];

  if (cell == null) {
    return;
  }

  const cardName = cell.split(':').pop();

  return cards.find((card) => card.name.toLowerCase() === cardName);
};
