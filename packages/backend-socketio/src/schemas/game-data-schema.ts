import { Player } from '@tripletriad/game';
import { Board } from '@tripletriad/game/src/lib/common-types';
import { toZod } from 'tozod';
import { z } from 'zod';

export const PlayerLabelSchema = z.enum([Player.One, Player.Two]);

export const PlayerDtoSchema = z.object({
  label: PlayerLabelSchema,
  hand: z.array(z.union([z.undefined(), z.string()])),
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
