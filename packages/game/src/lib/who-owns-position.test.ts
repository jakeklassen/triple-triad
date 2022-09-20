import { describe, expect, it } from 'vitest';
import { Board, Position } from './common-types';
import { whoOwnsPosition } from './who-owns-position';

describe('whoOwnsPosition', () => {
  const cases = [
    [
      'one',
      [0, 0] as Position,
      [
        ['one:geezard', undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ] as Board,
    ],
    [
      'two',
      [2, 2] as Position,
      [
        ['one:geezard', undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, 'two:fungar'],
      ] as Board,
    ],
    [
      undefined,
      [-1, -1] as Position,
      [
        ['one:geezard', undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ] as Board,
    ],
  ] as const;

  it.each(cases)(
    'should return %o as the owner of %s',
    (expected, position, board) => {
      expect(whoOwnsPosition(board, position)).toBe(expected);
    },
  );
});
