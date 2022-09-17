import { describe, expect, it } from 'vitest';
import { Board, Position } from './common-types';
import { whoOwnsPosition } from './who-owns-position';

describe('whoOwnsPosition', () => {
  const cases = [
    [
      [
        ['one:geezard', undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ] as Board,
      [0, 0] as Position,
      'one',
    ],
  ] as const;

  it.each(cases)(
    'should return %s as the owner of %s',
    (board, position, expected) => {
      expect(whoOwnsPosition(board, position)).toBe(expected);
    },
  );

  it('should return "one" for a player one owned cell', () => {
    const board: Board = [
      Array(3).fill(undefined),
      Array(3).fill(undefined),
      Array(3).fill(undefined),
    ];

    board[0][0] = 'one:geezard';

    expect(whoOwnsPosition(board, [0, 0])).toBe('one');
  });

  it('should return "undefined" for an unoccupied cell', () => {
    const board: Board = [
      Array(3).fill(undefined),
      Array(3).fill(undefined),
      Array(3).fill(undefined),
    ];

    expect(whoOwnsPosition(board, [0, 0])).toBe(undefined);
  });
});
