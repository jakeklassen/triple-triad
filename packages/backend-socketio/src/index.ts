import { createGame } from '@tripletriad/game';
import express from 'express';
import crypto from 'node:crypto';
import http from 'node:http';
import { Server, Socket } from 'socket.io';
import { ClientMessage, ClientMessageSchema, ServerMessage } from './events';

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

const handleMessage = (message: ClientMessage, socket: Socket) => {
  switch (message.event) {
    case 'create-game': {
      const gameId = crypto.randomUUID();
      socket.join(gameId);

      const message: ServerMessage = { event: 'game-created', gameId };
      socket.emit('message', message);

      break;
    }

    case 'join-game': {
      const { gameId } = message;

      if (socket.rooms.has(gameId) === false) {
        socket.join(gameId);

        // create game state,
        // map sockets to play one, player two
        // store the game state
        // send start game message to both players
        //   - player, board, whoGoesFirst
        const { playerOne, playerTwo, board, boardSize, whoGoesFirst } =
          createGame();

        const message: ServerMessage = { event: 'start-game' };
        io.to(gameId).emit('message', message);
      }

      break;
    }
  }
};
