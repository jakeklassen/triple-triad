import shuffle from 'just-shuffle';
import { ReadonlyDeep } from 'type-fest';
import { CARDS } from './cards';
import { Board, Card } from './common-types';
import { BOARD_SIZE } from './constants';
import { Player, PlayerLabel } from './player';
import { generateLevelLoadout, pullTieredHand } from './pull-tiered-hand';

export type GameOptions = {
  cards: Card[];
  whoGoesFirst?: PlayerLabel;
  allowDuplicateCards?: boolean;
};

const PLAYER_LABELS: [one: PlayerLabel, two: PlayerLabel] = [
  PlayerLabel.One,
  PlayerLabel.Two,
];

export const createGame = (
  options: GameOptions = {
    cards: CARDS,
    allowDuplicateCards: false,
  },
) => {
  const { cards } = options;
  const whoGoesFirst = options.whoGoesFirst || shuffle(PLAYER_LABELS)[0];

  const levelLoadout = generateLevelLoadout(cards, options.allowDuplicateCards);
  const playerOneHand = pullTieredHand(
    cards,
    levelLoadout,
    options.allowDuplicateCards,
  );
  const playerTwoHand = pullTieredHand(
    cards,
    levelLoadout,
    options.allowDuplicateCards,
  );

  const playerOne: Player = { label: PlayerLabel.One, hand: playerOneHand };
  const playerTwo: Player = { label: PlayerLabel.Two, hand: playerTwoHand };

  const board: ReadonlyDeep<Board> = [
    Array(3).fill(undefined),
    Array(3).fill(undefined),
    Array(3).fill(undefined),
  ];

  return {
    playerOne,
    playerTwo,
    board,
    whoGoesFirst,
    /**
     * This is the width of the board.
     */
    boardSize: BOARD_SIZE,
  };
};
