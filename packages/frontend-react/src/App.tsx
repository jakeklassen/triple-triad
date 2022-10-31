import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';
import { Lobby } from './components/Lobby';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState<
    { name: 'create' } | { name: 'join'; gameId: string } | null
  >(null);

  useEffect(() => {
    const socket = io('ws://localhost:3000');

    socket.on('error', (error) => {
      console.error(error);
    });

    socket.on('connect', () => {
      setIsSocketConnected(true);
      console.log('connected');
    });

    socket.on('message', (message) => {
      // Handle game-start event.
      // When the game starts, we should load the Board component with
      // the game state.

      console.log(message);

      if (message.event === 'game-start') {
        setIsGameReady(true);
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
    socket?.emit('message', {});
  }, [selectedGameMode]);

  // const { board, playerOne, playerTwo, whoGoesFirst, boardSize } = createGame();

  if (isSocketConnected === false) {
    return <div>Loading...</div>;
  }

  const renderScene = () => {
    if (selectedGameMode?.name === 'create') {
      return <div className="text-white">Waiting for a player to join...</div>;
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
