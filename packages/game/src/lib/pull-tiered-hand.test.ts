import { assert, describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { InsufficientLevelRangeError } from './errors';
import { generateLevelLoadout, pullTieredHand } from './pull-tiered-hand';

describe('pullTieredHand', () => {
  const firstFiveCards = [CARDS[0], CARDS[1], CARDS[2], CARDS[3], CARDS[4]];

  it('should create a hand restricted by level limits', () => {
    const levels = generateLevelLoadout(firstFiveCards, true);
    const hand = pullTieredHand(firstFiveCards, levels);

    assert(hand[0]);
    assert(hand[1]);
    assert(hand[2]);
    assert(hand[3]);
    assert(hand[4]);

    expect(hand[0].level).toEqual(1);
    expect(hand[1].level).toEqual(1);
    expect(hand[2].level).toEqual(1);
    expect(hand[3].level).toEqual(1);
    expect(hand[4].level).toEqual(1);
  });

  it('should throw InsufficientLevelRangeError when duplicates are disabled and level range is too small', () => {
    expect(() => generateLevelLoadout(firstFiveCards)).toThrowError(
      InsufficientLevelRangeError,
    );
  });
});
