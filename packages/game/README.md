# @tripletriad/game

Core game logic for headless Triple Triad.

## Responsibilities

This library is responsible for the core game logic of Triple Triad.

- Board state (3x3 2d array)
- History
- Cards
- Is this lib aware of player turns?

```typescript
import { Game } from '@tripletriad/game';

// Service
export class GameRoom {
  private game: Game;
  private players: Player[];
  private spectators: Player[];

  constructor() {
    this.game = new Game();
  }

  public join(socket) {
    const player = new Player(socket);
    this.players.push(player);
  }

  public leave() {}

  public move() {}
}
```

```typescript
import { Game } from '@tripletriad/game';

const game = new Game();

socket.on('join', (client) => {
  // Associate socket to a game
  socket.roomId = game.id;
});

socket.on('disconnect', () => {
  // Remove player from game
  // What are the reprocussions of this?
});

socket.on('message', (event) => {
  const game = getGameFromSocket(socket);

  if (event.type === 'move') {
  } else if (event.type === 'forfeit') {
  }
});

const results = game.takeTurn({ card, position });

// if results are valid
```
