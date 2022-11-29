import { z } from 'zod';
import {
  GameIdSchema,
  PlayerDtoSchema,
  PlayerLabelSchema,
} from './game-data-schema';

export const ClientMessageSchema = z.discriminatedUnion('event', [
  z.object({
    event: z.literal('create-game'),
  }),
  z.object({
    event: z.literal('join-game'),
    gameId: GameIdSchema,
  }),
  z.object({
    event: z.literal('select-card'),
    gameId: GameIdSchema,
    player: PlayerDtoSchema,
    cardName: z.string(),
  }),
  z.object({
    event: z.literal('play-card'),
    gameId: GameIdSchema,
    playerLabel: PlayerLabelSchema,
    cardName: z.string(),
    row: z.number(),
    column: z.number(),
  }),
]);

/**
 * This message schema is used to describe the message that is sent from the client to the server.
 */
export type ClientMessage = z.infer<typeof ClientMessageSchema>;
