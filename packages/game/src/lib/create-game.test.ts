import { describe, expect, it } from 'vitest';
import { createGame } from './create-game';

describe('game', () => {
  it('should initialize an empty board', () => {
    const { board } = createGame();

    expect(board).toEqual([
      Array(3).fill(undefined),
      Array(3).fill(undefined),
      Array(3).fill(undefined),
    ]);
  });

  it('should reflect two distinct players', () => {
    const { playerOne, playerTwo } = createGame();

    expect(playerOne.label).toBe('one');
    expect(playerTwo.label).toBe('two');
  });
});
