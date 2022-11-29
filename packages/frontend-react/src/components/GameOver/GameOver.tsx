import styles from './GameOver.module.css';

type GameOverProps = {
  onPlayAgainClicked: () => void;
  gameOverMessage: string;
};

export const GameOver = ({
  gameOverMessage,
  onPlayAgainClicked,
}: GameOverProps) => {
  // This should be initialized from the server now
  // const { board, playerOne, playerTwo, whoGoesFirst, boardSize } = createGame();

  const onPlayAgainClick = () => {
    onPlayAgainClicked();
  };

  const render = () => {
    return (
      <>
        <p className="text-white">{gameOverMessage}</p>

        <button className={styles.button} onClick={onPlayAgainClick}>
          Play Again
        </button>
      </>
    );
  };

  return render();
};
