import { describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { createGame } from './create-game';

describe('game', () => {
  const firstFiveCards = [CARDS[0], CARDS[1], CARDS[2], CARDS[3], CARDS[4]];

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

  it('should reflect that each player has the same hand', () => {
    const { playerOne, playerTwo } = createGame();

    expect(playerOne.hand.length).toBe(5);
    expect(playerTwo.hand.length).toBe(5);

    // TODO: Should we elevate this to a custom predicate and use toSatisfy?
    for (const card of playerOne.hand) {
      expect(playerTwo.hand).toContainEqual(card);
    }
  });

  it('returns players with hands limited to custom cards', () => {
    const { playerOne, playerTwo } = createGame({
      cards: firstFiveCards,
    });

    // TODO: Should we elevate this to a custom predicate and use toSatisfy?
    for (const card of playerOne.hand) {
      expect(playerTwo.hand).toContainEqual(card);
    }
  });
});
