import { Player, PlayerLabel } from '@tripletriad/game';
import * as TripleTriad from '@tripletriad/game/src/lib/common-types';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ReadonlyDeep } from 'type-fest';
import { ClientMessage } from '../../backend-socketio/src/schemas/client-message';
import { ServerMessage } from '../../backend-socketio/src/schemas/server-message';
import './App.css';
import { Board } from './components/Board';
import { Lobby } from './components/Lobby';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState<
    { name: 'create' } | { name: 'join'; gameId: string } | null
  >(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerInfo, setPlayerInfo] = useState<{
    whichPlayer: 'one' | 'two';
  } | null>(null);

  const [gameData, setGameData] = useState<{
    board: ReadonlyDeep<TripleTriad.Board>;
    playerOne: Player;
    playerTwo: Player;
    whoGoesFirst: string;
    boardSize: number;
  } | null>(null);

  // Open socket to server, handle incoming server events
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
      if (message.event === 'start-game') {
        setIsGameReady(true);

        const playerOne = new Player({
          label: message.gameData.playerOne.label,
          hand: message.gameData.playerOne.hand as TripleTriad.Hand,
        });

        const playerTwo = new Player({
          label: message.gameData.playerTwo.label,
          hand: message.gameData.playerTwo.hand as TripleTriad.Hand,
        });

        const gameData = {
          ...message.gameData,
          playerOne,
          playerTwo,
        };

        setGameData(gameData);
      }

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

  // Handle outgoing socket events for game mode selection
  useEffect(() => {
    if (selectedGameMode?.name === 'create') {
      const message: ClientMessage = { event: 'create-game' };

      socket?.emit('message', message);

      setPlayerInfo({ whichPlayer: 'one' });
    }

    if (selectedGameMode?.name === 'join') {
      const message: ClientMessage = {
        event: 'join-game',
        gameId: selectedGameMode.gameId,
      };

      socket?.emit('message', message);
      setGameId(selectedGameMode.gameId);
      setPlayerInfo({ whichPlayer: 'two' });
    }
  }, [selectedGameMode]);

  if (isSocketConnected === false) {
    return <div>Loading...</div>;
  }

  const renderScene = () => {
    if (selectedGameMode?.name === 'create' && isGameReady === false) {
      let message = 'Waiting for a player to join...';

      if (gameId != null) {
        message = `Share this game ID with a friend: ${gameId}`;
      }

      return <div className="text-white">{message}</div>;
    }

    if (selectedGameMode?.name === 'join' && isGameReady === false) {
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

    if (
      isGameReady === true &&
      socket != null &&
      gameId != null &&
      playerInfo?.whichPlayer != null &&
      gameData != null
    ) {
      // const { playerOne, playerTwo } = createGame();

      const { board, playerOne, playerTwo } = gameData;

      console.log(playerOne);

      return (
        <Board
          initialBoard={board}
          playerOne={playerOne}
          playerTwo={playerTwo}
          whoGoesFirst={gameData.whoGoesFirst as PlayerLabel}
          size={gameData.boardSize}
          matchData={{ socket, gameId, whichPlayer: playerInfo?.whichPlayer }}
        />

        // <Board
        //   initialBoard={gameData?.board}
        //   playerOne={gameData.playerOne}
        //   playerTwo={gameData.playerTwo}
        //   whoGoesFirst={gameData.whoGoesFirst as PlayerLabel}
        //   size={gameData.boardSize}
        //   matchData={{ socket, gameId, whichPlayer: playerInfo?.whichPlayer }}
        // />
      );
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      {renderScene()}
    </div>
  );
}

export default App;
