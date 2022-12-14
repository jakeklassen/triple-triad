import { ReadonlyDeep } from 'type-fest';
import { Card, Direction } from './common-types';
import { InvalidDirectionError } from './errors';

export const canFlipCard = (
  challenger: ReadonlyDeep<Card>,
  defender: ReadonlyDeep<Card>,
  direction: Direction,
) => {
  switch (direction) {
    case 'north':
      return challenger.stats.north > defender.stats.south;
    case 'south':
      return challenger.stats.south > defender.stats.north;
    case 'east':
      return challenger.stats.east > defender.stats.west;
    case 'west':
      return challenger.stats.west > defender.stats.east;
    default:
      throw new InvalidDirectionError();
  }
};
