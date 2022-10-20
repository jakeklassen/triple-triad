import groupBy from 'just-group-by';
import randomInteger from 'just-random-integer';
import shuffle from 'just-shuffle';
import { Card, Hand } from './common-types';
import { InsufficientLevelRangeError } from './errors';

const getAvailableLevels = (cards: Card[]) => {
  const availableLevels = Array.from(new Set(cards.map((card) => card.level)));
  return availableLevels;
};

export const generateLevelLoadout = (
  cards: Card[],
  allowDuplicates = false,
) => {
  const availableLevels = getAvailableLevels(cards);

  if (allowDuplicates === false && availableLevels.length < 5) {
    throw new InsufficientLevelRangeError();
  }

  const minimumLevel = availableLevels[0];
  const maximumLevel = availableLevels[availableLevels.length - 1];
  const levels: number[] = [];

  while (levels.length < 5) {
    const num = randomInteger(minimumLevel, maximumLevel);

    if (allowDuplicates === false && levels.includes(num) === false) {
      levels.push(num);
      continue;
    }

    levels.push(num);
  }

  return levels.sort((a, b) => a - b);
};

export const pullTieredHand = (
  cards: Card[],
  levelLoadout: number[],
  allowDuplicates = false,
): Hand => {
  const cardsByLevel = groupBy(cards, (c) => c.level);
  const hand: Card[] = [];

  while (hand.length < 5) {
    const card = shuffle(cardsByLevel[levelLoadout[hand.length]])[0];

    if (allowDuplicates === false && hand.includes(card) === false) {
      hand.push(card);
      continue;
    }

    hand.push(card);
  }

  return hand as Hand;
};
