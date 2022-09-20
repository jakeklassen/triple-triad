import { ReadonlyDeep } from 'type-fest';
import { canFlipCard } from './can-flip-card';
import { Card } from './cards';
import { Board, Position } from './common-types';
import { getCardFromPosition } from './get-card-from-position';
import { Player } from './player';
import { whoOwnsPosition } from './who-owns-position';

/**
 * x, x, x
 * _, _, o   [1, 2]
 * _, _, x
 */

/**
 * x, x, o
 * _, _, o   [0, 2], [2, 2]
 * _, _, o
 */

/**
 * x, o, o
 * _, _, o   [0, 1]
 * _, _, o
 */

/**
 * o, o, o
 * _, _, o   [0, 0]
 * _, _, o
 */

/*
getCardFlips = [
  [ [0, 2], [2, 2] ],
  [ [0, 1] ],
  [ [0, 0] ]
]
*/

const getCardFlips = (
  board: Board,
  cards: ReadonlyDeep<Card[]>,
  player: ReadonlyDeep<Player>,
  card: ReadonlyDeep<Card>,
  row: number,
  column: number,
) => {
  const cardFlips: Position[][] = [];
  let flips: Position[] = [];

  flips = performCardCascade(board, cards, player, card, row, column);

  if (flips.length === 0) {
    return cardFlips;
  }

  // [[0, 2], [2, 2]]
  cardFlips.push(flips);

  let goAgain = true;

  do {
    /**
     * x, x, x
     * _, _, o
     * _, _, x
     */

    for (const position of flips) {
      const nextCard = getCardFromPosition(board, cards, position);

      if (nextCard == null) {
        throw new Error('Card not found');
      }

      flips.push(
        ...performCardCascade(board, cards, player, nextCard, ...position),
      );
    }

    if (flips.length > 0) {
      cardFlips.push(flips);
    } else {
      goAgain = false;
    }
  } while (goAgain);

  return cardFlips;
};

export const performCardCascade = (
  board: Board,
  cards: ReadonlyDeep<Card[]>,
  player: ReadonlyDeep<Player>,
  card: ReadonlyDeep<Card>,
  row: number,
  column: number,
) => {
  const northCard = getCardFromPosition(board, cards, [row - 1, column]);
  const northCardOwner = whoOwnsPosition(board, [row - 1, column]);

  const southCard = getCardFromPosition(board, cards, [row + 1, column]);
  const southCardOwner = whoOwnsPosition(board, [row + 1, column]);

  const eastCard = getCardFromPosition(board, cards, [row, column + 1]);
  const eastCardOwner = whoOwnsPosition(board, [row, column + 1]);

  const westCard = getCardFromPosition(board, cards, [row, column - 1]);
  const westCardOwner = whoOwnsPosition(board, [row, column - 1]);

  const flips: Position[] = [];

  /**
   * _, x, x
   * _, _, o
   * _, _, x
   */

  // For every card that is not null, determine if it should be flipped
  // If flip occurs, call this function again
  if (
    northCard &&
    northCardOwner !== player.label &&
    canFlipCard(card, northCard, 'north') === true
  ) {
    board[row - 1][
      column
    ] = `${player.label.toLowerCase()}:${northCard.name.toLowerCase()}`;

    flips.push([row - 1, column]);
    // performCardCascade(board, CARDS, player, card, row - 1, column);
  }

  if (
    southCard &&
    southCardOwner !== player.label &&
    canFlipCard(card, southCard, 'south') === true
  ) {
    board[row + 1][
      column
    ] = `${player.label.toLowerCase()}:${southCard.name.toLowerCase()}`;

    flips.push([row + 1, column]);
    // performCardCascade(board, CARDS, player, card, row + 1, column);
  }

  if (
    eastCard &&
    eastCardOwner !== player.label &&
    canFlipCard(card, eastCard, 'east') === true
  ) {
    board[row][
      column + 1
    ] = `${player.label.toLowerCase()}:${eastCard.name.toLowerCase()}`;

    flips.push([row, column + 1]);
    // performCardCascade(board, CARDS, player, card, row, column + 1);
  }

  if (
    westCard &&
    westCardOwner !== player.label &&
    canFlipCard(card, westCard, 'west') === true
  ) {
    board[row][
      column - 1
    ] = `${player.label.toLowerCase()}:${westCard.name.toLowerCase()}`;

    flips.push([row, column - 1]);
    // performCardCascade(board, CARDS, player, card, row, column - 1);
  }

  return flips;
};
