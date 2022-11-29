import { z } from 'zod';
import {
  BoardDtoSchema,
  GameDataDtoSchema,
  GameIdSchema,
  PlayerDtoSchema,
  PlayerLabelSchema,
} from './game-data-schema';

// TODO: cardName should be validated against possible card names from the game lib
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
  z.object({
    event: z.literal('card-played'),
    gameOver: z.boolean(),
    gameId: GameIdSchema,
    board: BoardDtoSchema,
    nextTurn: PlayerLabelSchema,
    cardName: z.string(),
    scoreChange: z.number(),
    playerOneScore: z.number(),
    playerTwoScore: z.number(),
  }),
]);

/**
 * This message schema is used to describe the message that is sent from the server to the client.
 */
export type ServerMessage = z.infer<typeof ServerMessageSchema>;
