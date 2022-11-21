import { z } from 'zod';
import {
  GameDataDtoSchema,
  GameIdSchema,
  PlayerDtoSchema,
} from './schemas/game-data-schema';

export const ClientMessageSchema = z.discriminatedUnion('event', [
  z.object({
    event: z.literal('create-game'),
  }),
  z.object({
    event: z.literal('join-game'),
    gameId: GameIdSchema,
  }),
  z.object({
    event: z.literal('play-card'),
    gameId: GameIdSchema,
  }),
  z.object({
    event: z.literal('select-card'),
    gameId: GameIdSchema,
    player: PlayerDtoSchema,
    cardName: z.string(),
  }),
]);

export const ServerMessageSchema = z.discriminatedUnion('event', [
  z.object({
    event: z.literal('game-created'),
    gameId: GameIdSchema,
  }),
  z.object({
    event: z.literal('start-game'),
    gameId: GameIdSchema,
    gameData: GameDataDtoSchema,
  }),
  z.object({
    event: z.literal('card-selected'),
    gameId: GameIdSchema,
    player: PlayerDtoSchema,
    cardName: z.string(),
  }),
]);

export type ClientMessage = z.infer<typeof ClientMessageSchema>;
export type ServerMessage = z.infer<typeof ServerMessageSchema>;
