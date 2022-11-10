import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  ClientMessage,
  ServerMessage,
} from '../../backend-socketio/src/events';
import './App.css';
import { Lobby } from './components/Lobby';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState<
    { name: 'create' } | { name: 'join'; gameId: string } | null
  >(null);
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    const socket = io('ws://localhost:3000');

    socket.on('error', (error) => {
      console.error(error);
    });

    socket.on('connect', () => {
      setIsSocketConnected(true);
      console.log('connected');
    });

    socket.on('message', (message: ServerMessage) => {
      // Handle game-start event.
      // When the game starts, we should load the Board component with
      // the game state.

      console.log(message);

      if (message.event === 'game-created') {
        setGameId(message.gameId);
      }
    });

    socket.on('disconnect', () => {
      setIsSocketConnected(false);
      console.log('disconnected');
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Sent the proper `create` or `join` game event to the server
    if (selectedGameMode?.name === 'create') {
      const message: ClientMessage = { event: 'create-game' };

      socket?.emit('message', message);
    }

    if (selectedGameMode?.name === 'join') {
      const message: ClientMessage = {
        event: 'join-game',
        gameId: selectedGameMode.gameId,
      };

      socket?.emit('message', message);
    }
  }, [selectedGameMode]);

  // const { board, playerOne, playerTwo, whoGoesFirst, boardSize } = createGame();

  if (isSocketConnected === false) {
    return <div>Loading...</div>;
  }

  const renderScene = () => {
    if (selectedGameMode?.name === 'create') {
      let message = 'Waiting for a player to join...';

      if (gameId != null) {
        message = `Share this game ID with a friend: ${gameId}`;
      }

      return <div className="text-white">{message}</div>;
    }

    if (selectedGameMode?.name === 'join') {
      return (
        <div className="text-white">
          Attempting to join game {selectedGameMode.gameId}...
        </div>
      );
    }

    if (selectedGameMode === null) {
      return (
        <Lobby
          onModeSelected={(mode) => {
            console.log(mode);

            setSelectedGameMode(mode);
          }}
        />
      );
    }

    if (isGameReady === true) {
      // return (
      //   <Board
      //     initialBoard={board}
      //     playerOne={playerOne}
      //     playerTwo={playerTwo}
      //     whoGoesFirst={whoGoesFirst}
      //     size={boardSize}
      //     socket={socket}
      //   />
      // );
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      {renderScene()}
    </div>
  );
}

export default App;
