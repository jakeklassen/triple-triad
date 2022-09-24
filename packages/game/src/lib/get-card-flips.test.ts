import { assert, describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { Board } from './common-types';
import { createGame } from './create-game';
import { getCardFlips } from './get-card-flips';

describe('getCardFlips', () => {
  it('should return the correct number of flips in sequence, as layers', () => {
    const { playerTwo } = createGame();

    const laguna = CARDS.find((card) => card?.name?.toLowerCase() === 'laguna');

    assert(laguna);

    const board: Board = [
      ['one:red bat', 'one:fungar', 'one:geezard'],
      Array(3).fill(undefined),
      [undefined, undefined, 'one:blobra'],
    ];

    const flips = getCardFlips(board, CARDS, playerTwo, laguna, 1, 2);

    expect(flips).toEqual([
      [
        [0, 2],
        [2, 2],
      ],
      [[0, 1]],
      [[0, 0]],
    ]);
  });

  it('should flip a card in all four directions', () => {
    const { playerTwo } = createGame();

    const laguna = CARDS.find((card) => card?.name?.toLowerCase() === 'laguna');

    assert(laguna);

    const board: Board = [
      [undefined, 'one:fungar', undefined],
      ['one:red bat', undefined, 'one:geezard'],
      [undefined, 'one:blobra', undefined],
    ];

    const flips = getCardFlips(board, CARDS, playerTwo, laguna, 1, 1);

    expect(flips).toMatchObject({
      0: expect.arrayContaining([
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 1],
      ]),
      length: 1,
    });
  });
});

/**
 * x, x, x
 * _, _, o   [1, 2] -> [[0, 2], [2, 2]]
 * _, _, x
 */

/**
 * x, x, o
 * _, _, o   [0, 2], [2, 2] -> [[0, 1]]
 * _, _, o
 */

/**
 * x, o, o
 * _, _, o   [0, 1] -> [[0, 0]]
 * _, _, o
 */

/**
 * o, o, o
 * _, _, o   [0, 0] -> []
 * _, _, o
 */
