import shuffle from 'just-shuffle';
import { ReadonlyDeep } from 'type-fest';
import { CARDS } from './cards';
import { Board, Card, Hand } from './common-types';
import { Player, PlayerLabel } from './player';

export type GameOptions = {
  cards: Card[];
  whoGoesFirst?: PlayerLabel;
};

export const BOARD_SIZE = 3;

const PLAYER_LABELS: [one: PlayerLabel, two: PlayerLabel] = [
  Player.One,
  Player.Two,
];

export const createGame = (
  options: GameOptions = {
    cards: CARDS,
  },
) => {
  const { cards } = options;
  const whoGoesFirst = options.whoGoesFirst || shuffle(PLAYER_LABELS)[0];

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
