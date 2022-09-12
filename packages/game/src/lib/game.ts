import shuffle from 'just-shuffle';
import { Card, Cards } from './cards';
import { Hand, Player, PlayerLabel } from './player';

type Position = [row: number, column: number];

export type GameOptions = {
  cards: Card[];
};

export class Game {
  static readonly BoardSize = 3;

  // TODO: Change this to be an object array instead of a tuple array
  #board: Array<
    [{ originalOwner: PlayerLabel; currentOwner: PlayerLabel }, Card][]
  > = [
    Array(3).fill(undefined),
    Array(3).fill(undefined),
    Array(3).fill(undefined),
  ];

  #players: {
    one: Player;
    two: Player;
  };

  constructor({ cards }: GameOptions = { cards: Cards }) {
    const [cardOne, cardTwo, cardThree, cardFour, cardFive] = shuffle(cards);
    const hand: Hand = [cardOne, cardTwo, cardThree, cardFour, cardFive];

    this.#players = {
      one: new Player({ label: Player.One, hand }),
      two: new Player({ label: Player.Two, hand }),
    };
  }

  public get board() {
    return this.#board;
  }

  public get players() {
    return this.#players;
  }

  public playCard(player: PlayerLabel, card: Card, position: Position) {
    const [row, column] = position;

    if (row >= Game.BoardSize || column >= Game.BoardSize) {
      throw new Error('Position is out of bounds');
    }

    // If the position is already occupied, throw an error
    if (this.#board[row][column] != null) {
      throw new Error('Position is already occupied');
    }

    this.#board[row][column] = [
      { originalOwner: player, currentOwner: player },
      card,
    ];

    this.#players[player].removeCard(card);
  }

  public whoOwnsPosition(position: [row: number, column: number]) {
    const [row, column] = position;

    return this.#board.at(row)?.at(column)?.[0]?.currentOwner;
  }

  private determineCardCascade() {}
}
