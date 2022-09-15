import shuffle from 'just-shuffle';
import { Card, Cards } from './cards';
import { Hand, Player, PlayerLabel } from './player';

type Position = [row: number, column: number];

export type GameOptions = {
  cards: Card[];
};

type Cell = {
  originalOwner: PlayerLabel;
  currentOwner: PlayerLabel;
  card: Card;
};

type Direction = 'north' | 'south' | 'east' | 'west';

function trackEvent(event: string) {
  console.log('trackEvent', event);

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    console.log('decorator', {
      target: target.constructor.name,
      propertyKey,
      descriptor,
      originalMethod,
    });

    descriptor.value = function (...args: any[]) {
      console.log('decorator', { event, args });
      const results = originalMethod.apply(this, args);
      console.log();

      console.log(results * 2);

      return results;
    };
  };
}

class _Game {
  static readonly BoardSize = 3;

  #board: Cell[][] = [
    Array(3).fill(undefined),
    Array(3).fill(undefined),
    Array(3).fill(undefined),
  ];

  #players: {
    one: Player;
    two: Player;
  };

  events: any[] = [];

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

  public publicDoStuff(a: number, b: number) {
    return this.#doStuff(a, b);
  }

  #doStuff(a: number, b: number) {
    return a + b;
  }

  public playCard(player: PlayerLabel, card: Card, position: Position) {
    const [row, column] = position;

    if (row >= Game.BoardSize || column >= Game.BoardSize) {
      throw new Error('Position is out of bounds');
    }

    if (this.#board[row][column] != null) {
      throw new Error('Position is already occupied');
    }

    // event
    this.#board[row][column] = {
      originalOwner: player,
      currentOwner: player,
      card,
    };

    // event
    this.#players[player].removeCard(card);

    // changing ownership of cards
    this.determineCardCascade(row, column);

    // check if game is over and who won
  }

  public whoOwnsPosition(position: [row: number, column: number]) {
    const [row, column] = position;

    return this.#board.at(row)?.at(column)?.currentOwner;
  }

  private determineCardCascade(row: number, column: number) {
    const cell = this.#board[row][column];

    const northCell = this.#board[row - 1]?.[column];
    const southCell = this.#board[row + 1]?.[column];
    const eastCell = this.#board[row]?.[column + 1];
    const westCell = this.#board[row]?.[column - 1];

    // For every card that is not null, determine if it should be flipped
    // If flip occurs, call this function again
    if (this.tryFlipCard(cell, northCell, 'north') === true) {
      this.determineCardCascade(row - 1, column);
    }

    if (this.tryFlipCard(cell, southCell, 'south') === true) {
      this.determineCardCascade(row + 1, column);
    }

    if (this.tryFlipCard(cell, eastCell, 'east') === true) {
      this.determineCardCascade(row, column + 1);
    }

    if (this.tryFlipCard(cell, westCell, 'west') === true) {
      this.determineCardCascade(row, column - 1);
    }
  }

  private canFlipCard(challenger: Card, defender: Card, direction: Direction) {
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
  }

  private tryFlipCard(
    challenger: Cell,
    defender: Cell,
    direction: Direction,
  ): boolean {
    if (defender == null) return false;

    if (this.canFlipCard(challenger.card, defender.card, direction)) {
      defender.currentOwner = challenger.currentOwner;

      return true;
    }

    return false;
  }
}

const GameProxyHandler: ProxyHandler<_Game> = {
  get(target, prop, receiver) {
    console.log('get', { target, prop, receiver });

    const value = Reflect.get(target, prop);

    if (prop === 'doStuff') {
      if (value instanceof Function) {
        return function (this: _Game, ...args: any[]) {
          this.events.push('doStuff');

          return Reflect.apply(value, this === receiver ? target : this, args);
        };
      }
    }

    if (value instanceof Function) {
      return function (this: _Game, ...args: any[]) {
        return Reflect.apply(value, this === receiver ? target : this, args);
      };
    }

    return value;
  },
};

export const Game = new Proxy(_Game, {
  construct(target, args) {
    return new Proxy(new target(...args), GameProxyHandler);
  },
});
