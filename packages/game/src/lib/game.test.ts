import assert from 'node:assert';
import { describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import {
  createGame,
  getCardFromPosition,
  playCard,
  whoOwnsPosition,
} from './game';
import { Player } from './player';

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
      expect(playerTwo.hand).toContain(card);
    }
  });

  it('should allow player one to play a card', () => {
    const { board, playerOne } = createGame();

    const whichCard = 0;
    const card = playerOne.hand[whichCard];

    assert(card);

    playCard(board, playerOne, card, [0, 0]);

    expect(board[0][0]).toBeDefined();
    expect(whoOwnsPosition(board, [0, 0])).toBe(Player.One);
    expect(getCardFromPosition(CARDS, board, [0, 0])).toBe(card);
  });

  it('should allow player two to play a card', () => {
    const { board, playerTwo } = createGame();

    const whichCard = 0;
    const card = playerTwo.hand[whichCard];

    assert(card);

    playCard(board, playerTwo, card, [0, 0]);

    expect(board[0][0]).toBeDefined();
    expect(whoOwnsPosition(board, [0, 0])).toBe(Player.Two);
    expect(getCardFromPosition(CARDS, board, [0, 0])).toBe(card);
  });

  it('should throw an error if the position is occupied', () => {
    const { board, playerOne } = createGame();

    const whichCard = 0;
    const card = playerOne.hand[whichCard];

    assert(card);

    playCard(board, playerOne, card, [0, 0]);

    expect(() => playCard(board, playerOne, card, [0, 0])).toThrow();
  });

  it('should throw an error if the position is out of bounds', () => {
    const { board, playerOne } = createGame();

    const whichCard = 0;
    const card = playerOne.hand[whichCard];

    assert(card);

    expect(() => playCard(board, playerOne, card, [0, 3])).toThrow();
  });

  it("should allow a player to flip an opponent's card", () => {
    const { board, playerOne, playerTwo } = createGame({
      cards: structuredClone(firstFiveCards),
    });

    const playerOneLosingCard = playerOne.hand.find(
      (card) => card?.name === 'Geezard',
    );
    assert(playerOneLosingCard);

    const playerTwoWinningCard = playerTwo.hand.find(
      (card) => card?.name === 'Fungar',
    );
    assert(playerTwoWinningCard);

    playCard(board, playerOne, playerOneLosingCard, [0, 0]);
    playCard(board, playerTwo, playerTwoWinningCard, [1, 0]);

    expect(whoOwnsPosition(board, [0, 0])).toBe(Player.Two);
    expect(whoOwnsPosition(board, [1, 0])).toBe(Player.Two);
  });

  it("should allow a player to cause a cascade on flip of an opponent's card", () => {
    /**
     * PlayerOne = x, PlayerTwo = o
     */
    const { board, playerOne, playerTwo } = createGame({
      cards: structuredClone(firstFiveCards),
    });

    // N, E, S, W
    // 1, 4, 1, 5
    const playerOneGeezard = playerOne.hand.find(
      (card) => card?.name === 'Geezard',
    );
    assert(playerOneGeezard);

    // 5, 1, 1, 3
    const playerOneFungar = playerOne.hand.find(
      (card) => card?.name === 'Fungar',
    );
    assert(playerOneFungar);

    // 1, 4, 1, 5
    const playerTwoGeezard = playerTwo.hand.find(
      (card) => card?.name === 'Geezard',
    );
    assert(playerTwoGeezard);

    // 2, 3, 1, 5
    const playerTwoBlobra = playerTwo.hand.find(
      (card) => card?.name === 'Blobra',
    );
    assert(playerTwoBlobra);

    /**
     * x, _, _
     * _, _, _
     * _, _, _
     */
    playCard(board, playerOne, playerOneFungar, [0, 0]);

    /**
     * x, _, _
     * _, _, _
     * _, _, o
     */
    playCard(board, playerTwo, playerTwoGeezard, [2, 2]);

    /**
     * x, x, _
     * _, _, _
     * _, _, o
     */
    playCard(board, playerOne, playerOneGeezard, [0, 1]);

    /**
     * x, x, o
     * _, _, _
     * _, _, o
     */
    playCard(board, playerTwo, playerTwoBlobra, [0, 2]);

    expect(whoOwnsPosition(board, [0, 0])).toBe(Player.Two);
    expect(whoOwnsPosition(board, [0, 1])).toBe(Player.Two);
    expect(whoOwnsPosition(board, [0, 2])).toBe(Player.Two);
    expect(whoOwnsPosition(board, [2, 2])).toBe(Player.Two);
  });
});
