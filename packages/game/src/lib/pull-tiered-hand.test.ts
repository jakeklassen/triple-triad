import { assert, describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { pullTieredHand } from './pull-tiered-hand';

describe.only('pullTieredHand', () => {
  // const firstFiveCards = [CARDS[0], CARDS[1], CARDS[2], CARDS[3], CARDS[4]];

  it.only('should create a hand restricted by level limits', () => {
    const hand = pullTieredHand(CARDS, [3, 3, 6, 8, 10]);

    assert(hand[0]);
    assert(hand[1]);
    assert(hand[2]);
    assert(hand[3]);
    assert(hand[4]);

    expect(hand[0].level).toEqual(3);
    expect(hand[1].level).toEqual(3);
    expect(hand[2].level).toEqual(6);
    expect(hand[3].level).toEqual(8);
    expect(hand[4].level).toEqual(10);
  });
});
