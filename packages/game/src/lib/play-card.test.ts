import { describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { createGame } from './create-game';
import { playCard } from './play-card';
import { Player } from './player';
import { createBoardFromHand } from './test-utils';

describe('playCard', () => {
  const firstFiveCards = [CARDS[0], CARDS[1], CARDS[2], CARDS[3], CARDS[4]];

  it('should throw when player starts illegally', () => {
    const { board, playerOne, playerTwo } = createGame({
      cards: firstFiveCards,
      whoGoesFirst: Player.One,
    });

    expect(() =>
      playCard(board, playerOne.label, playerTwo, firstFiveCards[0], [0, 0]),
    ).toThrow();
  });

  it.todo('should throw when player plays illegally');

  it('should indicate the game is over', () => {
    const { playerOne, playerTwo } = createGame({
      cards: firstFiveCards,
    });

    const board = createBoardFromHand(
      firstFiveCards,
      playerTwo.label,
      playerOne.label,
      1,
    );

    const results = playCard(
      board,
      playerTwo.label,
      playerTwo,
      firstFiveCards[4],
      [2, 2],
    );

    expect(results.gameOver).toBe(true);
  });

  it('should indicate player one non-zero score change', () => {
    const { playerOne, playerTwo } = createGame({
      cards: firstFiveCards,
    });

    const board = createBoardFromHand(
      firstFiveCards,
      playerOne.label,
      playerTwo.label,
      1,
    );

    const { scoreChange } = playCard(
      board,
      playerOne.label,
      playerOne,
      firstFiveCards[4],
      [2, 2],
    );

    expect(scoreChange).toBeGreaterThan(0);
  });

  it('should indicate player two non-zero score change', () => {
    const { playerOne, playerTwo } = createGame({
      cards: firstFiveCards,
    });

    const board = createBoardFromHand(
      firstFiveCards,
      playerTwo.label,
      playerOne.label,
      1,
    );

    const { scoreChange } = playCard(
      board,
      playerTwo.label,
      playerTwo,
      firstFiveCards[4],
      [2, 2],
    );

    expect(scoreChange).toBeGreaterThan(0);
  });
});
