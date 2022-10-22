import { createGame } from '@tripletriad/game';
import styles from './Lobby.module.css';

type LobbyProps = {
  onGameReady: (data: ReturnType<typeof createGame>) => void;
};

export const Lobby = ({ onGameReady }: LobbyProps) => {
  // This should be initialized from the server now
  const { board, playerOne, playerTwo, whoGoesFirst, boardSize } = createGame();

  onGameReady({ board, playerOne, playerTwo, whoGoesFirst, boardSize });

  const onCreateGameClick = () => {
    console.log('Create game');
  };

  const onJoinGameClick = () => {
    console.log('Join game');
  };

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
