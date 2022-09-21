import { ReadonlyDeep } from 'type-fest';
import { Card } from './cards';
import { Board, Position } from './common-types';
import { getCardFromPosition } from './get-card-from-position';
import { performCardCascade } from './perform-card-cascade';
import { Player } from './player';

export const getCardFlips = (
  board: Board,
  cards: ReadonlyDeep<Card[]>,
  player: ReadonlyDeep<Player>,
  card: ReadonlyDeep<Card>,
  row: number,
  column: number,
) => {
  const cardFlips: Position[][] = [];
  let flips: Position[] = [];

  flips = performCardCascade(board, cards, player, card, row, column);

  if (flips.length === 0) {
    return cardFlips;
  }

  cardFlips.push(flips);

  while (flips.length > 0) {
    const layer: Position[] = [];

    for (const position of flips) {
      const nextCard = getCardFromPosition(board, cards, position);

      if (nextCard == null) {
        throw new Error('Card not found');
      }

      layer.push(
        ...performCardCascade(board, cards, player, nextCard, ...position),
      );
    }

    if (layer.length > 0) {
      cardFlips.push(layer);
    }

    flips = layer;
  }

  return cardFlips;
};
