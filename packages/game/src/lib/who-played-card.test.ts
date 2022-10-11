import { describe, expect, it } from 'vitest';
import { Board, Position } from './common-types';
import { whoPlayedCard } from './who-played-card';

describe('whoPlayedCard', () => {
  const cases = [
    [
      'one',
      [0, 0] as Position,
      [
        ['one:two:geezard', undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ] as Board,
    ],
    [
      'two',
      [2, 2] as Position,
      [
        ['one:one:geezard', undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, 'two:one:fungar'],
      ] as Board,
    ],
    [
      undefined,
      [-1, -1] as Position,
      [
        ['two:one:geezard', undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ] as Board,
    ],
  ] as const;

  it.each(cases)(
    'should return %o as the owner of %s',
    (expected, position, board) => {
      expect(whoPlayedCard(board, position)).toBe(expected);
    },
  );
});
