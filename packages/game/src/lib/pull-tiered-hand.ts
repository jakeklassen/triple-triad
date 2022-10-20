import groupBy from 'just-group-by';
import shuffle from 'just-shuffle';
import { CARDS } from './cards';
import { Card, Hand } from './common-types';

type LevelRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type Levels = [LevelRange, LevelRange, LevelRange, LevelRange, LevelRange];

const getAvailableLevels = (cards: Card[]) => {
  const cardsByLevel = Array.from(new Set(CARDS.map((card) => card.level)));
  return cardsByLevel;
};

export const pullTieredHand = (cards: Card[], levels: Levels): Hand => {
  const cardsByLevel = groupBy(cards, (c) => c.level);
  console.log(getAvailableLevels(cards));

  const [one, two, three, four, five] = [
    shuffle(cardsByLevel[levels[0]])[0],
    shuffle(cardsByLevel[levels[1]])[0],
    shuffle(cardsByLevel[levels[2]])[0],
    shuffle(cardsByLevel[levels[3]])[0],
    shuffle(cardsByLevel[levels[4]])[0],
  ];

  return [one, two, three, four, five];
};
