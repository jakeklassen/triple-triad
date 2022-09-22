import shuffle from 'just-shuffle';
import { ReadonlyDeep } from 'type-fest';
import { Card, CARDS } from './cards';
import { Board } from './common-types';
import { Hand, Player, PlayerLabel } from './player';

export type GameOptions = {
  cards: Card[];
  whoGoesFirst?: PlayerLabel;
};

export const BOARD_SIZE = 3;

export const createGame = (
  { cards, whoGoesFirst }: GameOptions = {
    cards: CARDS,
    whoGoesFirst: shuffle([Player.One, Player.Two]).pop(),
  },
) => {
  const [cardOne, cardTwo, cardThree, cardFour, cardFive] = shuffle(cards);
  const hand: Hand = [cardOne, cardTwo, cardThree, cardFour, cardFive];

  const playerOne = new Player({ label: Player.One, hand });
  const playerTwo = new Player({ label: Player.Two, hand });

  const board: ReadonlyDeep<Board> = [
    Array(3).fill(undefined),
    Array(3).fill(undefined),
    Array(3).fill(undefined),
  ];

  return { playerOne, playerTwo, board, whoGoesFirst };
};
