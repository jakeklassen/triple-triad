import { ReadonlyDeep } from 'type-fest';
import { Board, Card, Cell } from './common-types';
import { PlayerLabel } from './player';

export const findDuplicatePlayerCard = (
  board: ReadonlyDeep<Board>,
  playerLabel: PlayerLabel,
  card: ReadonlyDeep<Card>,
) => {
  const cells = board.flatMap((row) =>
    row.filter((cell): cell is NonNullable<Cell> => cell != null),
  );

  const existingCard = cells.find(
    (cell) =>
      cell.startsWith(playerLabel) && cell.endsWith(card.name.toLowerCase()),
  );

  return existingCard != null;
};
