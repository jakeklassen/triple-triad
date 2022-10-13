import * as TripleTriad from '@tripletriad/game';
import clsx from 'clsx';
import styles from './Score.module.css';

type ScoreProps = {
  score: number;
  player: TripleTriad.Player;
};

export const Score = ({ score, player }: ScoreProps) => {
  return (
    <span
      className={clsx('m-auto', styles.score)}
      data-direction={player.label == TripleTriad.Player.One ? 'left' : 'right'}
    >
      {score}
    </span>
  );
};
