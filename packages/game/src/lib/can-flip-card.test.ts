import { assert, describe, expect, it } from 'vitest';
import { canFlipCard } from './can-flip-card';
import { CARDS } from './cards';

describe('canFlipCard', () => {
  const fungar = CARDS.find((card) => card?.name?.toLowerCase() === 'fungar');
  const geezard = CARDS.find((card) => card?.name?.toLowerCase() === 'geezard');
  const biteBug = CARDS.find(
    (card) => card?.name?.toLowerCase() === 'bite bug',
  );

  assert(fungar);
  assert(geezard);
  assert(biteBug);

  it('should throw on bad direction', () => {
    // @ts-expect-error Test purposes
    expect(() => canFlipCard(fungar, geezard, 'bad-direction')).toThrow();
  });

  describe('challenger', () => {
    it('should be able to flip card to the north', () => {
      expect(canFlipCard(fungar, geezard, 'north')).toBe(true);
    });

    it('should not be able to flip a better card to the north', () => {
      expect(canFlipCard(geezard, biteBug, 'north')).toBe(false);
    });

    it('should be able to flip card to the east', () => {
      expect(canFlipCard(geezard, fungar, 'east')).toBe(true);
    });

    it('should not be able to flip a better card to the east', () => {
      expect(canFlipCard(fungar, geezard, 'east')).toBe(false);
    });

    it('should be able to flip card to the south', () => {
      expect(canFlipCard(biteBug, geezard, 'south')).toBe(true);
    });

    it('should not be able to flip a better card to the south', () => {
      expect(canFlipCard(fungar, geezard, 'south')).toBe(false);
    });

    it('should be able to flip card to the west', () => {
      expect(canFlipCard(biteBug, geezard, 'west')).toBe(true);
    });

    it('should not be able to flip a better card to the west', () => {
      expect(canFlipCard(fungar, geezard, 'west')).toBe(false);
    });
  });
});
