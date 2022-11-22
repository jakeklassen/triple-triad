import { z } from 'zod';
import { GameIdSchema, PlayerDtoSchema } from './game-data-schema';

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

export type ClientMessage = z.infer<typeof ClientMessageSchema>;
