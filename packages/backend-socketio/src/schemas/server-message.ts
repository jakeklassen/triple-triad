import { z } from 'zod';
import {
  GameDataDtoSchema,
  GameIdSchema,
  PlayerLabelSchema,
} from './game-data-schema';

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
    player: PlayerLabelSchema,
    cardName: z.string(),
  }),
]);

export type ServerMessage = z.infer<typeof ServerMessageSchema>;
