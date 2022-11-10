import { z } from 'zod';

const gameId = z.string();

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
]);

export const ServerMessageSchema = z.discriminatedUnion('event', [
  z.object({
    event: z.literal('game-created'),
    gameId,
  }),
  z.object({ event: z.literal('start-game') }),
]);

export type ClientMessage = z.infer<typeof ClientMessageSchema>;
export type ServerMessage = z.infer<typeof ServerMessageSchema>;
