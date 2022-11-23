import * as TripleTriad from '@tripletriad/game';
import { Board, Card } from '@tripletriad/game/src/lib/common-types';
import { toZod } from 'tozod';
import { z } from 'zod';

export const PlayerLabelSchema = z.nativeEnum(TripleTriad.PlayerLabel);

export const CardSchema: toZod<Card> = z.object({
  name: z.string(),
  level: z.number(),

  element: z.string().optional(),

  stats: z.object({
    north: z.number(),
    south: z.number(),
    east: z.number(),
    west: z.number(),
  }),

  image: z.object({
    base64: z.string(),
    width: z.number(),
    height: z.number(),
  }),
});

export const PlayerDtoSchema = z.object({
  label: PlayerLabelSchema,
  hand: z.tuple([
    z.union([CardSchema, z.undefined()]),
    z.union([CardSchema, z.undefined()]),
    z.union([CardSchema, z.undefined()]),
    z.union([CardSchema, z.undefined()]),
    z.union([CardSchema, z.undefined()]),
  ]),
});

export const GameIdSchema = z.string();
export const BoardDtoSchema: toZod<Board> = z.array(
  z.array(z.string().optional()),
);
export const WhoGoesFirstSchema = PlayerLabelSchema;
export const BoardSizeSchema = z.number().positive().int();

export const GameDataDtoSchema = z.object({
  playerOne: PlayerDtoSchema,
  playerTwo: PlayerDtoSchema,
  board: BoardDtoSchema,
  whoGoesFirst: WhoGoesFirstSchema,
  boardSize: BoardSizeSchema,
});
