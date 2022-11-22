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

  const temp: Hand = [...hand];
  temp[idx] = undefined;

  return temp;
}
