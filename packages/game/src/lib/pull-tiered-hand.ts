import groupBy from 'just-group-by';
import randomInteger from 'just-random-integer';
import shuffle from 'just-shuffle';
import { Card, Hand } from './common-types';
import { HAND_SIZE } from './constants';
import { InsufficientLevelRangeError } from './errors';

const getAvailableLevels = (cards: Card[]) => {
  const availableLevels = Array.from(new Set(cards.map((card) => card.level)));

  return availableLevels;
};

/**
 * This function will return an array of `HAND_SIZE = 5` card levels that
 * are available, and optionally support returning duplicates.
 * @param cards
 * @param allowDuplicates
 * @returns
 */
export const generateLevelLoadout = (
  cards: Card[],
  allowDuplicates = false,
) => {
  const availableLevels = getAvailableLevels(cards);

  if (allowDuplicates === false && availableLevels.length < HAND_SIZE) {
    throw new InsufficientLevelRangeError();
  }

  const minimumLevel = availableLevels[0];
  const maximumLevel = availableLevels[availableLevels.length - 1];
  const levels: number[] = [];

  while (levels.length < HAND_SIZE) {
    const num = randomInteger(minimumLevel, maximumLevel);

    if (allowDuplicates === false && levels.includes(num)) {
      continue;
    }

    levels.push(num);
  }

  return levels.sort((a, b) => a - b);
};

/**
 * Return a hand based on the provided cards and level loadout.
 * @param cards
 * @param levelLoadout
 * @param allowDuplicates
 * @returns
 */
export const pullTieredHand = (
  cards: Card[],
  levelLoadout: number[],
  allowDuplicates = false,
): Hand => {
  const cardsByLevel = groupBy(cards, (c) => c.level);
  const hand: Card[] = [];

  while (hand.length < HAND_SIZE) {
    const card = shuffle(cardsByLevel[levelLoadout[hand.length]])[0];

    if (allowDuplicates === false && hand.includes(card)) {
      continue;
    }

    hand.push(card);
  }

  return hand as Hand;
};
