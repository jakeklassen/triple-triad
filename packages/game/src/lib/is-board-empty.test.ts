import { describe, expect, it } from 'vitest';
import { Board } from './common-types';
import { isBoardEmpty } from './is-board-empty';

describe('isBoardEmpty', () => {
  it('should return true if every cell is null or undefined', () => {
    const board: Board = [
      Array(3).fill(undefined),
      Array(3).fill(undefined),
      Array(3).fill(undefined),
    ];

    expect(isBoardEmpty(board)).toBe(true);
  });

  it('should return false if any cell is not null or undefined', () => {
    const board: Board = [
      ['one:red bat', 'one:fungar', 'one:geezard'],
      ['one:red bat', 'one:fungar', 'one:geezard'],
      ['one:red bat', 'one:fungar', undefined],
    ];

    expect(isBoardEmpty(board)).toBe(false);
  });
});
