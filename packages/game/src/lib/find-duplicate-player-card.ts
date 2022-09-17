import { ReadonlyDeep } from 'type-fest';
import { Card } from './cards';
import { Board } from './common-types';
import { PlayerLabel } from './player';

export const findDuplicatePlayerCard = (
  board: ReadonlyDeep<Board>,
  playerLabel: PlayerLabel,
  card: ReadonlyDeep<Card>,
) => {
  const needle = `${playerLabel.toLowerCase()}:${card.name.toLowerCase()}`;
  const cells = board.flatMap((row) => row.filter((card) => card != null));

  return cells.includes(needle);
};
