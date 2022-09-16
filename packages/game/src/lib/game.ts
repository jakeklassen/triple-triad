import shuffle from 'just-shuffle';
import { Card, CARDS } from './cards';
import { Hand, Player, PlayerLabel } from './player';

type Position = [row: number, column: number];

export type GameOptions = {
  cards: Card[];
};

type Cell = string;

type Board = Cell[][];

type Direction = 'north' | 'south' | 'east' | 'west';

export const BOARD_SIZE = 3;

export const createGame = ({ cards }: GameOptions = { cards: CARDS }) => {
  const [cardOne, cardTwo, cardThree, cardFour, cardFive] = shuffle(cards);
  const hand: Hand = [cardOne, cardTwo, cardThree, cardFour, cardFive];

  const playerOne = new Player({ label: Player.One, hand });
  const playerTwo = new Player({ label: Player.Two, hand });
  const board: Board = [
    Array(3).fill(undefined),
    Array(3).fill(undefined),
    Array(3).fill(undefined),
  ];

  return { playerOne, playerTwo, board };
};

export const playCard = (
  board: Board,
  player: Player,
  card: Card,
  position: Position,
) => {
  const [row, column] = position;

  if (row >= BOARD_SIZE || column >= BOARD_SIZE) {
    throw new Error('Position is out of bounds');
  }

  if (board[row][column] != null) {
    throw new Error('Position is already occupied');
  }

  const duplicateCard = findDuplicatePlayerCard(board, player.label, card);

  if (duplicateCard === true) {
    throw new Error('Card is already in play');
  }

  const playerLabel = player.label.toLowerCase();
  const cardName = card.name.toLowerCase();

  board[row][column] = `${playerLabel}:${cardName}`;

  // changing ownership of cards
  determineCardCascade(CARDS, board, player, card, row, column);

  // check if game is over and who won
};

export const determineCardCascade = (
  cards: Card[],
  board: Board,
  player: Player,
  card: Card,
  row: number,
  column: number,
) => {
  const northCard = getCardFromPosition(cards, board, [row - 1, column]);
  const northCardOwner = whoOwnsPosition(board, [row - 1, column]);

  const southCard = getCardFromPosition(cards, board, [row + 1, column]);
  const southCardOwner = whoOwnsPosition(board, [row + 1, column]);

  const eastCard = getCardFromPosition(cards, board, [row, column + 1]);
  const eastCardOwner = whoOwnsPosition(board, [row, column + 1]);

  const westCard = getCardFromPosition(cards, board, [row, column - 1]);
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

    determineCardCascade(CARDS, board, player, card, row - 1, column);
  }

  if (
    southCard &&
    southCardOwner !== player.label &&
    canFlipCard(card, southCard, 'south') === true
  ) {
    board[row + 1][
      column
    ] = `${player.label.toLowerCase()}:${southCard.name.toLowerCase()}`;

    determineCardCascade(CARDS, board, player, card, row + 1, column);
  }

  if (
    eastCard &&
    eastCardOwner !== player.label &&
    canFlipCard(card, eastCard, 'east') === true
  ) {
    board[row][
      column + 1
    ] = `${player.label.toLowerCase()}:${eastCard.name.toLowerCase()}`;

    determineCardCascade(CARDS, board, player, card, row, column + 1);
  }

  if (
    westCard &&
    westCardOwner !== player.label &&
    canFlipCard(card, westCard, 'west') === true
  ) {
    board[row][
      column - 1
    ] = `${player.label.toLowerCase()}:${westCard.name.toLowerCase()}`;

    determineCardCascade(CARDS, board, player, card, row, column - 1);
  }
};

export const getCardFromPosition = (
  cards: Card[],
  board: Board,
  position: Position,
) => {
  const [row, column] = position;
  const cell = board[row]?.[column];

  if (cell == null) {
    return;
  }

  const cardName = cell.split(':').pop();

  return cards.find((card) => card.name.toLowerCase() === cardName);
};

export const findDuplicatePlayerCard = (
  board: Board,
  playerLabel: PlayerLabel,
  card: Card,
) => {
  const needle = `${playerLabel.toLowerCase()}:${card.name.toLowerCase()}`;
  const cells = board.flatMap((row) => row.filter((card) => card != null));

  return cells.includes(needle);
};

export const whoOwnsPosition = (board: Board, position: Position) => {
  const [row, column] = position;

  return board.at(row)?.at(column)?.split(':')?.[0];
};

export const canFlipCard = (
  challenger: Card,
  defender: Card,
  direction: Direction,
) => {
  switch (direction) {
    case 'north':
      return challenger.stats.north > defender.stats.south;
    case 'south':
      return challenger.stats.south > defender.stats.north;
    case 'east':
      return challenger.stats.east > defender.stats.west;
    case 'west':
      return challenger.stats.west > defender.stats.east;
  }
};
