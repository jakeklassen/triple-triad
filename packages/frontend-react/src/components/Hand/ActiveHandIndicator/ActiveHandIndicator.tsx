import * as TripleTriad from '@tripletriad/game';
import clsx from 'clsx';
import styles from './ActiveHandIndicator.module.css';

type ActiveHandIndicatorProps = {
  active: boolean;
  player: TripleTriad.Player;
};

export const ActiveHandIndicator = ({
  active,
  player,
}: ActiveHandIndicatorProps) => {
  return (
    <div
      className={clsx('m-auto', active ? styles.pyramidContainer : null)}
      hidden={active ? false : true}
      data-direction={player.label == TripleTriad.Player.One ? 'left' : 'right'}
    >
      <div className={styles.pyramid}>
        <span className={clsx(styles.pyramidFace, styles.pyramidFaceFront)} />
        <span className={clsx(styles.pyramidFace, styles.pyramidFaceRight)} />
        <span className={clsx(styles.pyramidFace, styles.pyramidFaceBack)} />
        <span className={clsx(styles.pyramidFace, styles.pyramidFaceLeft)} />
        <span className={clsx(styles.pyramidFace, styles.pyramidFaceTop)} />
      </div>
    </div>
  );
};
