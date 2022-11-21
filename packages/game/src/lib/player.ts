import { ReadonlyDeep } from 'type-fest';
import { Card, Hand } from './common-types';

export type PlayerLabel = typeof Player.One | typeof Player.Two;

export type PlayerOptions = {
  label: PlayerLabel;
  hand: ReadonlyDeep<Hand>;
};

export class Player {
  static One = 'one' as const;
  static Two = 'two' as const;

  #hand: Hand;

  public readonly label: PlayerLabel;

  constructor({ label, hand }: PlayerOptions) {
    this.label = label;
    this.#hand = structuredClone(hand) as Hand;
  }

  public get hand(): Readonly<Hand> {
    return this.#hand as Readonly<Hand>;
  }

  public removeCard(card: Card) {
    const idx = this.#hand.findIndex(
      (_card) => _card?.name?.toLowerCase() == card.name.toLowerCase(),
    );

    this.#hand[idx] = undefined;
  }

  toJSON() {
    return {
      label: this.label,
      hand: this.hand,
    };
  }
}
