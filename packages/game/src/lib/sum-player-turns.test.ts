import { describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { Board } from './common-types';
import { Player } from './player';
import { sumPlayerTurns } from './sum-player-turns';
import { createBoardFromHand } from './test-utils';

describe('sumPlayerTurns', () => {
  const firstFiveCards = [CARDS[0], CARDS[1], CARDS[2], CARDS[3], CARDS[4]];

  it('should return accurate player one and player two turn counts for non-empty board', () => {
    const board = createBoardFromHand(
      firstFiveCards,
      Player.One,
      Player.Two,
      2,
    );

    const turnSums = sumPlayerTurns(board);

    expect(turnSums).toEqual({
      playerOneMoveCount: 4,
      playerTwoMoveCount: 3,
    });
  });

  it('should return accurate player one and player two turn counts for empty board', () => {
    const board: Board = [
      Array(3).fill(undefined),
      Array(3).fill(undefined),
      Array(3).fill(undefined),
    ];

    const turnSums = sumPlayerTurns(board);

    expect(turnSums).toEqual({
      playerOneMoveCount: 0,
      playerTwoMoveCount: 0,
    });
  });
});
