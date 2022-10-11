import { assert, describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { Board } from './common-types';
import { getCardFromPosition } from './get-card-from-position';

describe('getCardFromPosition', () => {
  const fungar = CARDS.find((card) => card?.name?.toLowerCase() === 'fungar');

  assert(fungar);

  it('should return card if found', () => {
    const board: Board = [
      ['one:one:fungar', undefined, undefined],
      Array(3).fill(undefined),
      Array(3).fill(undefined),
    ];

    expect(getCardFromPosition(board, CARDS, [0, 0])).toEqual(fungar);
  });

  it('should return undefined if no card is found', () => {
    const board: Board = [
      Array(3).fill(undefined),
      Array(3).fill(undefined),
      Array(3).fill(undefined),
    ];

    expect(getCardFromPosition(board, CARDS, [0, 0])).toBe(undefined);
  });
});
