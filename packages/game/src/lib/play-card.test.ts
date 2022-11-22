import { describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { Hand } from './common-types';
import { createGame } from './create-game';
import {
  BoardIsFullError,
  DuplicateCardError,
  IllegalMoveError,
  IllegalStartError,
  OutOfBoundsError,
  PositionAlreadyOccupiedError,
} from './errors';
import { playCard } from './play-card';
import { PlayerLabel } from './player';
import { createBoardFromHand } from './test-utils';

describe('playCard', () => {
  const firstFiveCards = [CARDS[0], CARDS[1], CARDS[2], CARDS[3], CARDS[4]];
  const hand = firstFiveCards as Hand;

  describe('when player one starts', () => {
    it('should throw when player two starts illegally', () => {
      const { board, playerOne, playerTwo } = createGame({
        cards: firstFiveCards,
        whoGoesFirst: PlayerLabel.One,
        allowDuplicateCards: true,
      });

      expect(() =>
        playCard(board, playerOne.label, playerTwo, firstFiveCards[0], [0, 0]),
      ).toThrowError(IllegalStartError);
    });

    it('should indicate player one non-zero score change', () => {
      const { playerOne, playerTwo } = createGame({
        cards: firstFiveCards,
        whoGoesFirst: PlayerLabel.One,
        allowDuplicateCards: true,
      });

      const board = createBoardFromHand(
        hand,
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

    it('should throw when player one tries to go twice in a row', () => {
      const { board, playerOne } = createGame({
        cards: firstFiveCards,
        whoGoesFirst: PlayerLabel.One,
        allowDuplicateCards: true,
      });

      const { newBoard: turnOneBoard } = playCard(
        board,
        playerOne.label,
        playerOne,
        firstFiveCards[0],
        [0, 0],
      );

      expect(() =>
        playCard(
          turnOneBoard,
          playerOne.label,
          playerOne,
          firstFiveCards[1],
          [0, 1],
        ),
      ).toThrowError(IllegalMoveError);
    });

    it('should throw when moves are tied and player two attempts to play', () => {
      const { playerTwo, whoGoesFirst } = createGame({
        cards: firstFiveCards,
        whoGoesFirst: PlayerLabel.One,
        allowDuplicateCards: true,
      });

      const board = createBoardFromHand(hand, whoGoesFirst, PlayerLabel.Two, 7);

      expect(() =>
        playCard(board, whoGoesFirst, playerTwo, firstFiveCards[1], [0, 2]),
      ).toThrowError(IllegalMoveError);
    });
  });

  describe('when player two starts', () => {
    it('should throw when player one starts illegally', () => {
      const { board, playerOne, playerTwo } = createGame({
        cards: firstFiveCards,
        whoGoesFirst: PlayerLabel.Two,
        allowDuplicateCards: true,
      });

      expect(() =>
        playCard(board, playerTwo.label, playerOne, firstFiveCards[0], [0, 0]),
      ).toThrowError(IllegalStartError);
    });

    it('should indicate player two non-zero score change', () => {
      const { playerOne, playerTwo } = createGame({
        cards: firstFiveCards,
        whoGoesFirst: PlayerLabel.Two,
        allowDuplicateCards: true,
      });

      const board = createBoardFromHand(
        hand,
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

    it('should throw when player two tries to go twice in a row', () => {
      const { board, playerTwo } = createGame({
        cards: firstFiveCards,
        whoGoesFirst: PlayerLabel.Two,
        allowDuplicateCards: true,
      });

      const { newBoard: turnOneBoard } = playCard(
        board,
        playerTwo.label,
        playerTwo,
        firstFiveCards[0],
        [0, 0],
      );

      expect(() =>
        playCard(
          turnOneBoard,
          playerTwo.label,
          playerTwo,
          firstFiveCards[1],
          [0, 1],
        ),
      ).toThrowError(IllegalMoveError);
    });

    it('should throw when moves are tied and player one attempts to play', () => {
      const { playerOne, whoGoesFirst } = createGame({
        cards: firstFiveCards,
        whoGoesFirst: PlayerLabel.Two,
        allowDuplicateCards: true,
      });

      const board = createBoardFromHand(hand, whoGoesFirst, PlayerLabel.One, 7);

      expect(() =>
        playCard(board, whoGoesFirst, playerOne, firstFiveCards[1], [0, 2]),
      ).toThrowError(IllegalMoveError);
    });
  });

  it('should indicate the game is over', () => {
    const { playerOne, playerTwo } = createGame({
      cards: firstFiveCards,
      allowDuplicateCards: true,
    });

    const board = createBoardFromHand(
      hand,
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

  it('should throw when the board is already full', () => {
    const { playerOne } = createGame({
      cards: firstFiveCards,
      allowDuplicateCards: true,
    });

    const board = createBoardFromHand(
      hand,
      PlayerLabel.One,
      PlayerLabel.Two,
      0,
    );

    expect(() =>
      playCard(board, PlayerLabel.One, playerOne, firstFiveCards[0], [0, 0]),
    ).toThrowError(BoardIsFullError);
  });

  it('should throw error when playing card out of bounds', () => {
    const { board, playerOne } = createGame({
      cards: firstFiveCards,
      allowDuplicateCards: true,
    });

    expect(() =>
      playCard(board, PlayerLabel.One, playerOne, firstFiveCards[0], [0, 3]),
    ).toThrowError(OutOfBoundsError);
  });

  it('should throw error when trying to play card on occupied cell', () => {
    const { board, playerOne, playerTwo } = createGame({
      cards: firstFiveCards,
      allowDuplicateCards: true,
    });

    const { newBoard: turnOneBoard } = playCard(
      board,
      PlayerLabel.One,
      playerOne,
      firstFiveCards[0],
      [0, 0],
    );

    expect(() =>
      playCard(
        turnOneBoard,
        PlayerLabel.One,
        playerTwo,
        firstFiveCards[1],
        [0, 0],
      ),
    ).toThrowError(PositionAlreadyOccupiedError);
  });

  it('should throw error when player attempts to play a duplicate card', () => {
    const { playerTwo } = createGame({
      cards: firstFiveCards,
      whoGoesFirst: PlayerLabel.Two,
      allowDuplicateCards: true,
    });

    const board = createBoardFromHand(
      hand,
      PlayerLabel.Two,
      PlayerLabel.One,
      7,
    );

    expect(() =>
      playCard(board, PlayerLabel.Two, playerTwo, firstFiveCards[0], [0, 2]),
    ).toThrowError(DuplicateCardError);
  });
});
