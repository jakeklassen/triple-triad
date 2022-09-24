import { assert, describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { Hand, Player } from './player';

describe('player', () => {
  const firstFiveCards: Hand = [
    CARDS[0],
    CARDS[1],
    CARDS[2],
    CARDS[3],
    CARDS[4],
  ];

  describe('removeCard', () => {
    it('should replace card with undefined', () => {
      const player = new Player({ label: 'one', hand: firstFiveCards });

      assert(firstFiveCards[0]);

      player.removeCard(firstFiveCards[0]);

      expect(player.hand.length).toBe(5);
      expect(player.hand[0]).toBeUndefined();
      expect(player).toMatchObject({
        hand: expect.not.arrayContaining([firstFiveCards[0]]),
      });
    });
  });
});
