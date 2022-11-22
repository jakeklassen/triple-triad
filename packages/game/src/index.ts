import { version } from '../package.json';
export { CARDS } from './lib/cards';
export * as CommonTypes from './lib/common-types';
export { createGame } from './lib/create-game';
export { playCard } from './lib/play-card';
export { Player, PlayerLabel, removeCard } from './lib/player';

export const VERSION = version;
