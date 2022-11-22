import { createGame, Player, PlayerLabel } from '@tripletriad/game';
import { Board } from '@tripletriad/game/src/lib/common-types';
import express from 'express';
import crypto from 'node:crypto';
import http from 'node:http';
import { Server, Socket } from 'socket.io';
import { ReadonlyDeep } from 'type-fest';
import { ServerGameEvent } from './events';
import { ClientMessage, ClientMessageSchema } from './schemas/client-message';

const port = parseInt(process.env.PORT ?? '3000', 10);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.get('/', (req, res) => {
  res.json({
    message: 'Are you supposed to be here?',
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (unknownMessage: unknown) => {
    console.log(unknownMessage);

    const message = ClientMessageSchema.safeParse(unknownMessage);

    if (message.success === true) {
      handleMessage(message.data, socket);
    } else {
      console.log(message.error);
      // send error to client
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`[GameServer] Listening on Port: ${port}`);
});

type GameData = {
  playerOne: Player;
  playerTwo: Player;
  playerOneSocket: Socket;
  playerTwoSocket?: Socket;
  board: ReadonlyDeep<Board>;
  whoGoesFirst: PlayerLabel;
  boardSize: number;
};

const games = new Map<string, GameData>();

const handleMessage = async (message: ClientMessage, socket: Socket) => {
  switch (message.event) {
    case 'create-game': {
      const gameId = crypto.randomUUID();
      socket.join(gameId);

      const { playerOne, playerTwo, board, whoGoesFirst, boardSize } =
        createGame();

      games.set(gameId, {
        board,
        boardSize,
        playerOne,
        playerTwo,
        playerOneSocket: socket,
        whoGoesFirst,
      });

      const message: ServerGameEvent = { event: 'game-created', gameId };
      socket.emit('message', message);

      break;
    }

    case 'join-game': {
      const { gameId } = message;

      if (socket.rooms.has(gameId) === false) {
        socket.join(gameId);

        const game = games.get(gameId);

        if (game == null) {
          console.log("Couldn't find game");
          break;
        }

        game.playerTwoSocket = socket;

        const message: ServerGameEvent = {
          event: 'start-game',
          gameId,
          gameData: {
            playerOne: game.playerOne,
            playerTwo: game.playerTwo,
            board: game.board,
            whoGoesFirst: game.whoGoesFirst,
            boardSize: game.boardSize,
          },
        };

        console.log('p1 hand', game.playerOne.hand);

        /**
         * 1. Need to track which socket belongs to which player
         * 2. On the front-end, need to know which player I am, and restrict input when it isn't my turn
         * 3. Use start-game gameData.whoGoesFirst to control first turn, server play-card should emit a
         *    response that includes data indicating whose turn it is
         */

        io.to(gameId).emit('message', message);
      }

      break;
    }

    case 'play-card': {
      break;
    }

    case 'select-card': {
      const { gameId, player, cardName } = message;

      const serverMessage: ServerGameEvent = {
        event: 'card-selected',
        gameId,
        player: player.label,
        cardName,
      };
      io.to(gameId).emit('message', serverMessage);
    }
  }
};
