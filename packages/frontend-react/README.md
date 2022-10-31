# Triple Triad React Frontend

## Gotchas

### CSS Scale

For whatever reason using `scale: number` does not work style using the `style` attribute. You have to use `transform: scale(number)`.

## Flow

When a user visits tripletriad.app:

- They are presented with the lobby view which has the Create Game and Join Game buttons

When a user clicks the Create Game button:

- A socket event is emitted to the server to create a game
- At this point the player waits for another player to join the game

## Awesome Links

https://wavez.github.io/react-hooks-lifecycle/
