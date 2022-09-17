import { ReadonlyDeep } from 'type-fest';
import { canFlipCard } from './can-flip-card';
import { Card, CARDS } from './cards';
import { Board } from './common-types';
import { getCardFromPosition } from './get-card-from-position';
import { Player } from './player';
import { whoOwnsPosition } from './who-owns-position';

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

    performCardCascade(board, CARDS, player, card, row - 1, column);
  }

  if (
    southCard &&
    southCardOwner !== player.label &&
    canFlipCard(card, southCard, 'south') === true
  ) {
    board[row + 1][
      column
    ] = `${player.label.toLowerCase()}:${southCard.name.toLowerCase()}`;

    performCardCascade(board, CARDS, player, card, row + 1, column);
  }

  if (
    eastCard &&
    eastCardOwner !== player.label &&
    canFlipCard(card, eastCard, 'east') === true
  ) {
    board[row][
      column + 1
    ] = `${player.label.toLowerCase()}:${eastCard.name.toLowerCase()}`;

    performCardCascade(board, CARDS, player, card, row, column + 1);
  }

  if (
    westCard &&
    westCardOwner !== player.label &&
    canFlipCard(card, westCard, 'west') === true
  ) {
    board[row][
      column - 1
    ] = `${player.label.toLowerCase()}:${westCard.name.toLowerCase()}`;

    performCardCascade(board, CARDS, player, card, row, column - 1);
  }
};
