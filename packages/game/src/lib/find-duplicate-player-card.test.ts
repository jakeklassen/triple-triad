import { assert, describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { Board } from './common-types';
import { findDuplicatePlayerCard } from './find-duplicate-player-card';
import { Player } from './player';

describe('findDuplicatePlayerCard', () => {
  const fungar = CARDS.find((card) => card?.name?.toLowerCase() === 'fungar');

  assert(fungar);

  it('should return true when duplicate cards exist', () => {
    const board: Board = [
      ['one:one:fungar', undefined, undefined],
      Array(3).fill(undefined),
      Array(3).fill(undefined),
    ];

    expect(findDuplicatePlayerCard(board, Player.One, fungar)).toBe(true);
  });

  it('should return false when no duplicate cards exist', () => {
    const board: Board = [
      Array(3).fill(undefined),
      Array(3).fill(undefined),
      Array(3).fill(undefined),
    ];

    expect(findDuplicatePlayerCard(board, Player.One, fungar)).toBe(false);
  });
});
