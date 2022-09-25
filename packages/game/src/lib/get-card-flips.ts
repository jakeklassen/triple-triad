import { ReadonlyDeep } from 'type-fest';
import { Board, Card, Position } from './common-types';
import { CardNotFoundError } from './errors';
import { getCardFromPosition } from './get-card-from-position';
import { orThrow } from './or-throw';
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
      const nextCard = orThrow(
        () => getCardFromPosition(board, cards, position),
        new CardNotFoundError(`No card found at position ${position}`),
      );

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
