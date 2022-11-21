import { Player, PlayerLabel } from '@tripletriad/game';
import { Board } from '@tripletriad/game/src/lib/common-types';
import { ReadonlyDeep } from 'type-fest';
import { z } from 'zod';

const gameId = z.string();
const playerOne = z.custom<Player>();
const playerTwo = z.custom<Player>();
const board = z.custom<ReadonlyDeep<Board>>();
const whoGoesFirst = z.custom<PlayerLabel>();
const boardSize = z.number();

const gameData = z.object({
  playerOne,
  playerTwo,
  board,
  whoGoesFirst,
  boardSize,
});

export const ClientMessageSchema = z.discriminatedUnion('event', [
  z.object({
    event: z.literal('create-game'),
  }),
  z.object({
    event: z.literal('join-game'),
    gameId,
  }),
  z.object({
    event: z.literal('play-card'),
    gameId,
  }),
  z.object({
    event: z.literal('select-card'),
    gameId,
    player: z.custom<Player>(),
    cardName: z.string(),
  }),
]);

export const ServerMessageSchema = z.discriminatedUnion('event', [
  z.object({
    event: z.literal('game-created'),
    gameId,
  }),
  z.object({ event: z.literal('start-game'), gameId, gameData }),
  z.object({
    event: z.literal('card-selected'),
    gameId,
    player: z.custom<Player>(),
    cardName: z.string(),
  }),
]);

export type ClientMessage = z.infer<typeof ClientMessageSchema>;
export type ServerMessage = z.infer<typeof ServerMessageSchema>;
