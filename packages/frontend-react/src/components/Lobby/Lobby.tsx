import { useRef, useState } from 'react';
import styles from './Lobby.module.css';

type LobbyProps = {
  onModeSelected: (
    mode: { name: 'create' } | { name: 'join'; gameId: string },
  ) => void;
};

export const Lobby = ({ onModeSelected }: LobbyProps) => {
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);

  // This should be initialized from the server now
  // const { board, playerOne, playerTwo, whoGoesFirst, boardSize } = createGame();

  const onCreateGameClick = () => {
    onModeSelected({ name: 'create' });
  };

  const onJoinGameClick = () => {
    setShowJoinGameModal(true);
  };

  const render = () => {
    if (showJoinGameModal) {
      return <JoinGameModal onModeSelected={onModeSelected} />;
    }

    return (
      <>
        <button className={styles.button} onClick={onCreateGameClick}>
          Create Game
        </button>

        <button className={styles.button} onClick={onJoinGameClick}>
          Join Game
        </button>
      </>
    );
  };

  return render();
};

type JoinGameModalProps = {
  onModeSelected: LobbyProps['onModeSelected'];
};

const JoinGameModal = ({ onModeSelected }: JoinGameModalProps) => {
  const gameIdRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        type="text"
        name="game-id"
        id="game-id"
        ref={gameIdRef}
        autoFocus
      />
      <button
        className={styles.button}
        onClick={() => {
          if (gameIdRef.current == null) {
            return;
          }

          onModeSelected({ name: 'join', gameId: gameIdRef.current.value });
        }}
      >
        Join Game
      </button>
    </>
  );
};
