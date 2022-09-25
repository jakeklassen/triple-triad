import TripleTriad from '@tripletriad/game';
import clsx from 'clsx';
import styles from './CardStats.module.css';

type CardStatsProps = {
  card: NonNullable<TripleTriad.CommonTypes.Hand[number]>;
};

const convertStat = (stat: number) => `${stat === 10 ? 'A' : stat}`;

export const CardStats = ({ card }: CardStatsProps) => {
  return (
    <div className={styles.statContainer}>
      <span className={clsx(styles.stat, styles.statNorth)}>
        {convertStat(card.stats.north)}
      </span>

      <span className={clsx(styles.stat, styles.statEast)}>
        {convertStat(card.stats.east)}
      </span>

      <span className={clsx(styles.stat, styles.statSouth)}>
        {convertStat(card.stats.south)}
      </span>

      <span className={clsx(styles.stat, styles.statWest)}>
        {convertStat(card.stats.south)}
      </span>
    </div>
  );
};
