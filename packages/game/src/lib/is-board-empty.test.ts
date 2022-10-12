import { describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { Hand } from './common-types';
import { isBoardEmpty } from './is-board-empty';
import { Player } from './player';
import { createBoardFromHand } from './test-utils';

describe('isBoardEmpty', () => {
  const firstFiveCards: Hand = [
    CARDS[0],
    CARDS[1],
    CARDS[2],
    CARDS[3],
    CARDS[4],
  ];

  it('should return true if every cell is null or undefined', () => {
    const board = createBoardFromHand(
      firstFiveCards,
      Player.One,
      Player.Two,
      9,
    );

    expect(isBoardEmpty(board)).toBe(true);
  });

  it('should return false if any cell is not null or undefined', () => {
    const board = createBoardFromHand(
      firstFiveCards,
      Player.One,
      Player.Two,
      1,
    );

    expect(isBoardEmpty(board)).toBe(false);
  });
});
