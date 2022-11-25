import { Player, PlayerLabel } from '@tripletriad/game';
import { Board } from '@tripletriad/game/src/lib/common-types';
import { ReadonlyDeep } from 'type-fest';

export type GameCreatedEvent = {
  event: 'game-created';
  gameId: string;
};

export type StartGameEvent = {
  event: 'start-game';
  gameId: string;
  gameData: {
    playerOne: Player;
    playerTwo: Player;
    board: ReadonlyDeep<Board>;
    whoGoesFirst: PlayerLabel;
    boardSize: number;
  };
};

export type CardSelectedEvent = {
  event: 'card-selected';
  gameId: string;
  player: Player;
  cardName: string;
};

export type CardPlayedEvent = {
  event: 'card-played';
  gameId: string;
  board: Board;
  nextTurn: PlayerLabel;
  cardName: string;
  scoreChange: number;
  playerOneScore: number;
  playerTwoScore: number;
};

export type ServerGameEvent =
  | GameCreatedEvent
  | StartGameEvent
  | CardSelectedEvent
  | CardPlayedEvent;
