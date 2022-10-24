import { createGame } from '@tripletriad/game';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';
import { Lobby } from './components/Lobby';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    const socket = io('ws://localhost:3000');

    socket.on('error', (error) => {
      console.error(error);
    });

    socket.on('connect', () => {
      setIsSocketConnected(true);
      console.log('connected');
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

  const { board, playerOne, playerTwo, whoGoesFirst, boardSize } = createGame();

  if (isSocketConnected === false) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      {/* <Board
        initialBoard={board}
        playerOne={playerOne}
        playerTwo={playerTwo}
        whoGoesFirst={whoGoesFirst}
        size={boardSize}
        channel={channel}
      /> */}

      <Lobby onGameReady={() => {}} />
    </div>
  );
}

export default App;
