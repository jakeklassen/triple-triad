import * as TripleTriad from '@tripletriad/game';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ReadonlyDeep } from 'type-fest';
import { ClientMessage } from '../../backend-socketio/src/schemas/client-message';
import { ServerMessage } from '../../backend-socketio/src/schemas/server-message';
import './App.css';
import { Board } from './components/Board';
import { Lobby } from './components/Lobby';
import styles from './components/Lobby/Lobby.module.css';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState<
    { name: 'create' } | { name: 'join'; gameId: string } | null
  >(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerInfo, setPlayerInfo] = useState<{
    whichPlayer: TripleTriad.PlayerLabel.One | TripleTriad.PlayerLabel.Two;
  } | null>(null);

  const [gameData, setGameData] = useState<{
    board: ReadonlyDeep<TripleTriad.CommonTypes.Board>;
    playerOne: TripleTriad.Player;
    playerTwo: TripleTriad.Player;
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

        const playerOne: TripleTriad.Player = {
          label: message.gameData.playerOne.label,
          hand: message.gameData.playerOne.hand as TripleTriad.CommonTypes.Hand,
        };

        const playerTwo: TripleTriad.Player = {
          label: message.gameData.playerTwo.label,
          hand: message.gameData.playerTwo.hand as TripleTriad.CommonTypes.Hand,
        };

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

      setPlayerInfo({ whichPlayer: TripleTriad.PlayerLabel.One });
    }

    if (selectedGameMode?.name === 'join') {
      const message: ClientMessage = {
        event: 'join-game',
        gameId: selectedGameMode.gameId,
      };

      socket?.emit('message', message);
      setGameId(selectedGameMode.gameId);
      setPlayerInfo({ whichPlayer: TripleTriad.PlayerLabel.Two });
    }
  }, [selectedGameMode]);

  if (isSocketConnected === false) {
    return <div>Loading...</div>;
  }

  const renderScene = () => {
    if (selectedGameMode?.name === 'create' && isGameReady === false) {
      const message = {
        value: 'Waiting for a player to join...',
        gameId: '',
      };

      if (gameId != null) {
        message.value = `Share this game ID with a friend`;
        message.gameId = gameId;
      }

      return (
        <div className="text-white">
          {message.value}: <p style={{ color: 'yellow' }}>{message.gameId}</p>
          <button
            className={styles.button}
            onClick={() => {
              navigator.clipboard.writeText(message.gameId);
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      );
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
      const { board, boardSize, playerOne, playerTwo, whoGoesFirst } = gameData;

      return (
        <Board
          initialBoard={board}
          playerOne={playerOne}
          playerTwo={playerTwo}
          whoGoesFirst={whoGoesFirst as TripleTriad.PlayerLabel}
          size={boardSize}
          matchData={{ socket, gameId, whichPlayer: playerInfo?.whichPlayer }}
        />
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
