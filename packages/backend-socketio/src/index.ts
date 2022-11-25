import {
  CARDS,
  createGame,
  playCard,
  Player,
  PlayerLabel,
} from '@tripletriad/game';
import { Board } from '@tripletriad/game/src/lib/common-types';
import express from 'express';
import { nanoid } from 'nanoid';
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
  activePlayer: Player;
  board: ReadonlyDeep<Board>;
  boardSize: number;
  playerOne: Player;
  playerTwo: Player;
  playerOneScore: number;
  playerTwoScore: number;
  playerOneSocket: Socket;
  playerTwoSocket?: Socket;
  whoGoesFirst: PlayerLabel;
};

const games = new Map<string, GameData>();

const handleMessage = async (message: ClientMessage, socket: Socket) => {
  switch (message.event) {
    case 'create-game': {
      const gameId = nanoid(8);
      socket.join(gameId);

      const { playerOne, playerTwo, board, whoGoesFirst, boardSize } =
        createGame();

      games.set(gameId, {
        activePlayer: whoGoesFirst === PlayerLabel.One ? playerOne : playerTwo,
        board,
        boardSize,
        playerOne,
        playerTwo,
        playerOneScore: 5,
        playerTwoScore: 5,
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

        io.to(gameId).emit('message', message);
      }

      break;
    }

    case 'play-card': {
      const { gameId, cardName } = message;
      const game = games.get(gameId);

      if (game == null) {
        console.log("Couldn't find game");
        break;
      }

      const card = CARDS.find(
        (card) => card.name.toLowerCase() === cardName.toLowerCase(),
      );

      if (card == null) {
        console.log("Couldn't find card");
        break;
      }

      if (game.activePlayer.label !== message.playerLabel) {
        console.log('Not your turn');
        break;
      }

      const { newBoard, scoreChange } = playCard(
        game.board,
        game.whoGoesFirst,
        game.activePlayer,
        card,
        [message.row, message.column],
      );

      const nextPlayer =
        game.activePlayer.label === PlayerLabel.One
          ? game.playerTwo
          : game.playerOne;

      const playerOneScore =
        game.activePlayer.label === PlayerLabel.One
          ? game.playerOneScore + scoreChange
          : game.playerOneScore - scoreChange;

      const playerTwoScore =
        game.activePlayer.label === PlayerLabel.Two
          ? game.playerTwoScore + scoreChange
          : game.playerTwoScore - scoreChange;

      const serverMessage: ServerGameEvent = {
        event: 'card-played',
        gameId,
        board: newBoard as Board,
        nextTurn: nextPlayer.label,
        cardName,
        scoreChange,
        playerOneScore,
        playerTwoScore,
      };

      io.to(gameId).emit('message', serverMessage);

      game.board = newBoard;
      game.activePlayer = nextPlayer;
      game.playerOneScore = playerOneScore;
      game.playerTwoScore = playerTwoScore;
      games.set(gameId, game);

      break;
    }

    case 'select-card': {
      const { gameId, player, cardName } = message;

      const serverMessage: ServerGameEvent = {
        event: 'card-selected',
        gameId,
        player: player,
        cardName,
      };

      io.to(gameId).emit('message', serverMessage);

      break;
    }
  }
};
