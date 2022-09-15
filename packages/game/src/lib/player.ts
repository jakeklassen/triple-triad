import { Card } from './cards';

export type PlayerLabel = typeof Player.One | typeof Player.Two;

export type Hand = [
  Card | undefined,
  Card | undefined,
  Card | undefined,
  Card | undefined,
  Card | undefined,
];

export type PlayerOptions = {
  label: PlayerLabel;
  hand: Hand;
};

export class Player {
  static One = 'one' as const;
  static Two = 'two' as const;

  #hand: Hand;

  public readonly label: PlayerLabel;

  constructor({ label, hand }: PlayerOptions) {
    this.label = label;
    this.#hand = hand;
  }

  public get hand(): Readonly<Hand> {
    return this.#hand as Readonly<Hand>;
  }

  public removeCard(card: Card) {
    const idx = this.#hand.findIndex((ele) => ele?.name == card.name);
    this.#hand[idx] = undefined;
  }
}
