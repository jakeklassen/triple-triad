import assert from 'node:assert';
import { describe, expect, it } from 'vitest';
import { CARDS } from './cards';
import { createGame } from './create-game';
import { getCardFromPosition } from './get-card-from-position';
import { playCard } from './play-card';
import { Player } from './player';
import { whoOwnsPosition } from './who-owns-position';

describe('game', () => {
  const firstFiveCards = [CARDS[0], CARDS[1], CARDS[2], CARDS[3], CARDS[4]];

  it('should allow player one to play a card', () => {
    const { board, playerOne } = createGame();

    const whichCard = 0;
    const card = playerOne.hand[whichCard];

    assert(card);

    const { newBoard } = playCard(board, playerOne, card, [0, 0]);

    expect(newBoard[0][0]).toBeDefined();
    expect(whoOwnsPosition(newBoard, [0, 0])).toBe(Player.One);
    expect(getCardFromPosition(newBoard, CARDS, [0, 0])).toBe(card);
  });

  it('should allow player two to play a card', () => {
    const { board, playerTwo } = createGame();

    const whichCard = 0;
    const card = playerTwo.hand[whichCard];

    assert(card);

    const { newBoard } = playCard(board, playerTwo, card, [0, 0]);

    expect(newBoard[0][0]).toBeDefined();
    expect(whoOwnsPosition(newBoard, [0, 0])).toBe(Player.Two);
    expect(getCardFromPosition(newBoard, CARDS, [0, 0])).toBe(card);
  });

  it('should throw an error if the board position is occupied', () => {
    const { board, playerOne } = createGame();

    const whichCard = 0;
    const card = playerOne.hand[whichCard];

    assert(card);

    const { newBoard } = playCard(board, playerOne, card, [0, 0]);

    expect(() => playCard(newBoard, playerOne, card, [0, 0])).toThrow();
  });

  it('should throw an error if the same player has played the same card', () => {
    const { board, playerOne } = createGame();

    const whichCard = 0;
    const card = playerOne.hand[whichCard];

    assert(card);

    const { newBoard } = playCard(board, playerOne, card, [0, 0]);

    expect(() => playCard(newBoard, playerOne, card, [0, 1])).toThrow();
  });

  it('should throw an error if the position is out of bounds', () => {
    const { board, playerOne } = createGame();

    const whichCard = 0;
    const card = playerOne.hand[whichCard];

    assert(card);

    expect(() => playCard(board, playerOne, card, [0, 3])).toThrow();
  });

  it("should allow a player to flip an opponent's northern card", () => {
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

    const { newBoard: turnOneBoard } = playCard(
      board,
      playerOne,
      playerOneLosingCard,
      [0, 0],
    );
    const { newBoard: turnTwoBoard } = playCard(
      turnOneBoard,
      playerTwo,
      playerTwoWinningCard,
      [1, 0],
    );

    expect(whoOwnsPosition(turnTwoBoard, [0, 0])).toBe(Player.Two);
    expect(whoOwnsPosition(turnTwoBoard, [1, 0])).toBe(Player.Two);
  });

  it("should allow a player to flip an opponent's southern card", () => {
    const { board, playerOne, playerTwo } = createGame({
      cards: structuredClone(firstFiveCards),
    });

    const playerOneLosingCard = playerOne.hand.find(
      (card) => card?.name === 'Geezard',
    );
    assert(playerOneLosingCard);

    const playerTwoWinningCard = playerTwo.hand.find(
      (card) => card?.name === 'Bite Bug',
    );
    assert(playerTwoWinningCard);

    const { newBoard: turnOneBoard } = playCard(
      board,
      playerOne,
      playerOneLosingCard,
      [1, 0],
    );

    const { newBoard: turnTwoBoard } = playCard(
      turnOneBoard,
      playerTwo,
      playerTwoWinningCard,
      [0, 0],
    );

    expect(whoOwnsPosition(turnTwoBoard, [0, 0])).toBe(Player.Two);
    expect(whoOwnsPosition(turnTwoBoard, [1, 0])).toBe(Player.Two);
  });

  it("should allow a player to flip an opponent's eastern card", () => {
    const { board, playerOne, playerTwo } = createGame({
      cards: structuredClone(firstFiveCards),
    });

    const playerOneLosingCard = playerOne.hand.find(
      (card) => card?.name === 'Fungar',
    );
    assert(playerOneLosingCard);

    const playerTwoWinningCard = playerTwo.hand.find(
      (card) => card?.name === 'Geezard',
    );
    assert(playerTwoWinningCard);

    const { newBoard: turnOneBoard } = playCard(
      board,
      playerOne,
      playerOneLosingCard,
      [0, 1],
    );

    const { newBoard: turnTwoBoard } = playCard(
      turnOneBoard,
      playerTwo,
      playerTwoWinningCard,
      [0, 0],
    );

    expect(whoOwnsPosition(turnTwoBoard, [0, 0])).toBe(Player.Two);
    expect(whoOwnsPosition(turnTwoBoard, [0, 1])).toBe(Player.Two);
  });

  it("should allow a player to flip an opponent's western card", () => {
    const { board, playerOne, playerTwo } = createGame({
      cards: structuredClone(firstFiveCards),
    });

    const playerOneLosingCard = playerOne.hand.find(
      (card) => card?.name === 'Fungar',
    );
    assert(playerOneLosingCard);

    const playerTwoWinningCard = playerTwo.hand.find(
      (card) => card?.name === 'Geezard',
    );
    assert(playerTwoWinningCard);

    const { newBoard: turnOneBoard } = playCard(
      board,
      playerOne,
      playerOneLosingCard,
      [0, 0],
    );

    const { newBoard: turnTwoBoard } = playCard(
      turnOneBoard,
      playerTwo,
      playerTwoWinningCard,
      [0, 1],
    );

    expect(whoOwnsPosition(turnTwoBoard, [0, 0])).toBe(Player.Two);
    expect(whoOwnsPosition(turnTwoBoard, [0, 1])).toBe(Player.Two);
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
    const { newBoard: turnOneBoard } = playCard(
      board,
      playerOne,
      playerOneFungar,
      [0, 0],
    );

    /**
     * x, _, _
     * _, _, _
     * _, _, o
     */
    const { newBoard: turnTwoBoard } = playCard(
      turnOneBoard,
      playerTwo,
      playerTwoGeezard,
      [2, 2],
    );

    /**
     * x, x, _
     * _, _, _
     * _, _, o
     */
    const { newBoard: turnThreeBoard } = playCard(
      turnTwoBoard,
      playerOne,
      playerOneGeezard,
      [0, 1],
    );

    /**
     * x, x, o
     * _, _, _
     * _, _, o
     */
    const { newBoard: turnFourBoard } = playCard(
      turnThreeBoard,
      playerTwo,
      playerTwoBlobra,
      [0, 2],
    );

    expect(whoOwnsPosition(turnFourBoard, [0, 0])).toBe(Player.Two);
    expect(whoOwnsPosition(turnFourBoard, [0, 1])).toBe(Player.Two);
    expect(whoOwnsPosition(turnFourBoard, [0, 2])).toBe(Player.Two);
    expect(whoOwnsPosition(turnFourBoard, [2, 2])).toBe(Player.Two);
  });
});
