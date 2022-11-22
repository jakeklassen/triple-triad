import * as TripleTriad from '@tripletriad/game';
import clsx from 'clsx';
import { ReadonlyDeep } from 'type-fest';
import styles from './Score.module.css';

type ScoreProps = {
  score: number;
  player: ReadonlyDeep<TripleTriad.Player>;
};

export const Score = ({ score, player }: ScoreProps) => {
  return (
    <span
      className={clsx('m-auto', styles.score)}
      data-direction={
        player.label == TripleTriad.PlayerLabel.One ? 'left' : 'right'
      }
    >
      {score}
    </span>
  );
};
