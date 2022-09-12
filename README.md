# Triple Triad

Monorepo for Triple Triad.

## Backend

### Persistence

Be sure to store and sync the game to the database. The Game model could look something like this:

```typescript
export class Move {
  public card: Card;
  public position: Position;
  public player: Player;
}

export class Game {
  // Would be a good room ID for sockets
  // @uuid
  public id: string;

  // Used for players to join the game - spectators don't require this
  // Exclude from API responses
  // @unique
  public joinToken: string;

  // Full history of the game
  public moves: Move[];

  // Maybe we should store events instead of moves?
  // Like spectator joined, player moved, player joined, etc.
  // This would allow for some cool replay options like moves only.

  // Maybe if a game doesn't receive a move for a certain amount of time,
  // it should be abandoned or forfeited
  public status: 'abandoned' | 'forfeited' | 'in-progress' | 'complete';
}
```
