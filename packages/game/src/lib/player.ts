import { ReadonlyDeep } from 'type-fest';
import { Card, Hand } from './common-types';

export enum PlayerLabel {
  One = 'one',
  Two = 'two',
}

export type Player = {
  label: PlayerLabel;
  hand: Hand;
};

export function removeCard(hand: ReadonlyDeep<Hand>, card: Card): Hand {
  const idx = hand.findIndex(
    (_card) => _card?.name?.toLowerCase() == card.name.toLowerCase(),
  );

  const newHand: Hand = [...hand];
  newHand[idx] = undefined;

  return newHand;
}
