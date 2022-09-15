import assert from 'node:assert';
import { describe, expect, it } from 'vitest';
import { Cards } from './cards';
import { Game } from './game';
import { Player } from './player';

describe('game', () => {
  const firstFiveCards = [Cards[0], Cards[1], Cards[2], Cards[3], Cards[4]];

  it.only('should initialize an empty board', () => {
    const game = new Game();

    game.publicDoStuff(1, 2);
    console.log(game.events);

    expect(game.board).toEqual([
      Array(3).fill(undefined),
      Array(3).fill(undefined),
      Array(3).fill(undefined),
    ]);
  });

  it('should reflect two distinct players', () => {
    const game = new Game();

    expect(game.players.one).toBeDefined();
    expect(game.players.two).toBeDefined();
  });

  it('should reflect that each player has the same hand', () => {
    const game = new Game();

    expect(game.players.one.hand.length).toBe(5);
    expect(game.players.two.hand.length).toBe(5);

    // TODO: Should we elevate this to a custom predicate and use toSatisfy?
    for (const card of game.players.one.hand) {
      expect(game.players.two.hand).toContain(card);
    }
  });

  it('should allow player one to play a card', () => {
    const game = new Game();

    const whichCard = 0;
    const card = game.players.one.hand[whichCard];

    assert(card);

    game.playCard(Player.One, card, [0, 0]);

    expect(game.board[0][0]).toBeDefined();
    expect(game.whoOwnsPosition([0, 0])).toBe(Player.One);
    expect(game.players.one.hand[whichCard]).toBeUndefined();
  });

  it('should allow player two to play a card', () => {
    const game = new Game();

    const whichCard = 2;
    const card = game.players.two.hand[whichCard];

    assert(card);

    game.playCard(Player.Two, card, [0, 0]);

    expect(game.board[0][0]).toBeDefined();
    expect(game.whoOwnsPosition([0, 0])).toBe(Player.Two);
    expect(game.players.two.hand[whichCard]).toBeUndefined();
  });

  it('should correctly report the card owner', () => {
    const game = new Game();

    const whichCard = 2;
    const playerOneCard = game.players.one.hand[whichCard];
    const playerTwoCard = game.players.two.hand[whichCard];

    assert(playerOneCard);
    assert(playerTwoCard);

    game.playCard(Player.One, playerOneCard, [0, 0]);
    expect(game.whoOwnsPosition([0, 0])).toBe(Player.One);

    game.playCard(Player.Two, playerTwoCard, [2, 2]);
    expect(game.whoOwnsPosition([2, 2])).toBe(Player.Two);
  });

  it('should throw an error if the position is occupied', () => {
    const game = new Game();

    const whichCard = 0;
    const card = game.players.one.hand[whichCard];

    if (card == null) {
      throw new Error('Card was null');
    }

    game.playCard(Player.One, card, [0, 0]);
    expect(() => game.playCard(Player.One, card, [0, 0])).toThrow();
  });

  it('should throw an error if the position is out of bounds', () => {
    const game = new Game();

    const whichCard = 0;
    const card = game.players.one.hand[whichCard];

    if (card == null) {
      throw new Error('Card was null');
    }

    expect(() =>
      game.playCard(Player.One, card, [0, Game.BoardSize]),
    ).toThrow();
  });

  it("should allow a player to flip an opponent's card", () => {
    const game = new Game({
      cards: structuredClone(firstFiveCards),
    });

    const playerOneLosingCard = game.players.one.hand.find(
      (card) => card?.name === 'Geezard',
    );
    assert(playerOneLosingCard);

    const playerTwoWinningCard = game.players.two.hand.find(
      (card) => card?.name === 'Fungar',
    );
    assert(playerTwoWinningCard);

    game.playCard(Player.One, playerOneLosingCard, [0, 0]);
    game.playCard(Player.Two, playerTwoWinningCard, [1, 0]);

    expect(game.whoOwnsPosition([0, 0])).toBe(Player.Two);
    expect(game.whoOwnsPosition([1, 0])).toBe(Player.Two);
  });

  it("should allow a player to cause a cascade on flip of an opponent's card", () => {
    /**
     * PlayerOne = x, PlayerTwo = o
     */
    const game = new Game({
      cards: structuredClone(firstFiveCards),
    });

    // N, E, S, W
    // 1, 4, 1, 5
    const playerOneGeezard = game.players.one.hand.find(
      (card) => card?.name === 'Geezard',
    );
    assert(playerOneGeezard);

    // 5, 1, 1, 3
    const playerOneFungar = game.players.one.hand.find(
      (card) => card?.name === 'Fungar',
    );
    assert(playerOneFungar);

    // 1, 4, 1, 5
    const playerTwoGeezard = game.players.two.hand.find(
      (card) => card?.name === 'Geezard',
    );
    assert(playerTwoGeezard);

    // 2, 3, 1, 5
    const playerTwoBlobra = game.players.two.hand.find(
      (card) => card?.name === 'Blobra',
    );
    assert(playerTwoBlobra);

    /**
     * x, _, _
     * _, _, _
     * _, _, _
     */
    game.playCard(Player.One, playerOneFungar, [0, 0]);

    /**
     * x, _, _
     * _, _, _
     * _, _, o
     */
    game.playCard(Player.Two, playerTwoGeezard, [2, 2]);

    /**
     * x, x, _
     * _, _, _
     * _, _, o
     */
    game.playCard(Player.One, playerOneGeezard, [0, 1]);

    /**
     * x, x, o
     * _, _, _
     * _, _, o
     */
    game.playCard(Player.Two, playerTwoBlobra, [0, 2]);

    expect(game.whoOwnsPosition([0, 0])).toBe(Player.Two);
    expect(game.whoOwnsPosition([0, 1])).toBe(Player.Two);
    expect(game.whoOwnsPosition([0, 2])).toBe(Player.Two);
    expect(game.whoOwnsPosition([2, 2])).toBe(Player.Two);

    console.log(game.events);
  });
});
