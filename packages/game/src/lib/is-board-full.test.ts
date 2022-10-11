import { describe, expect, it } from 'vitest';
import { Board } from './common-types';
import { isBoardFull } from './is-board-full';

describe('isBoardFull', () => {
  it('should return true if every cell is not null or undefined', () => {
    const board: Board = [
      ['one:one:red bat', 'one:one:fungar', 'one:one:geezard'],
      ['one:one:red bat', 'one:one:fungar', 'one:one:geezard'],
      ['one:one:red bat', 'one:one:fungar', 'one:one:geezard'],
    ];

    expect(isBoardFull(board)).toBe(true);
  });

  it('should return false if any cell is null or undefined', () => {
    const board: Board = [
      ['one:one:red bat', 'one:one:fungar', 'one:one:geezard'],
      ['one:one:red bat', 'one:one:fungar', 'one:one:geezard'],
      ['one:one:red bat', 'one:one:fungar', undefined],
    ];

    expect(isBoardFull(board)).toBe(false);
  });
});
