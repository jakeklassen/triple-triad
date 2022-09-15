# @tripletriad/game

Core game logic for headless Triple Triad.

## Responsibilities

This library is responsible for the core game logic of Triple Triad.

- Board state (3x3 2d array)
- History
- Cards
- Is this lib aware of player turns?

```typescript
// Any fancy initialization, for example, card limits would be done here
const { player1, player2, board } = createTripleTriadGame();

[
  {
    player: 'one',
    board: [
      [undefined, undefined, 'one:geezard'],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
    events: [
      {
        type: 'card_played',
        card: 'geezard',
        position: [0, 2],
        player: 'one',
        order: 1,
      },
    ],
  },
  {
    player: 'two',
    board: [
      [undefined, undefined, 'two:geezard'],
      [undefined, undefined, 'two:fungar'],
      [undefined, undefined, undefined],
    ],
    events: [
      {
        type: 'card_played',
        card: 'fungar',
        position: [1, 2],
        player: 'two',
        order: 1,
      },
      {
        type: 'card_flipped',
        position: [0, 2],
        order: 2,
      },
    ],
  },
];

const { events, newBoard } = playCard(board, player1, card, position);
```
