import TripleTriad from '@tripletriad/game';
import clsx from 'clsx';
import earthImageUrl from '../../../assets/earth.webp';
import fireImageUrl from '../../../assets/fire.webp';
import holyImageUrl from '../../../assets/holy.webp';
import iceImageUrl from '../../../assets/ice.webp';
import lightningImageUrl from '../../../assets/lightning.webp';
import poisonImageUrl from '../../../assets/poison.webp';
import waterImageUrl from '../../../assets/water.webp';
import windImageUrl from '../../../assets/wind.webp';
import styles from './CardStats.module.css';

type CardStatsProps = {
  card: NonNullable<TripleTriad.CommonTypes.Hand[number]>;
};

const convertStat = (stat: number) => `${stat === 10 ? 'A' : stat}`;

const convertElementToAssetUrl = (element: string) => {
  switch (element) {
    case 'earth':
      return earthImageUrl;
    case 'fire':
      return fireImageUrl;
    case 'holy':
      return holyImageUrl;
    case 'ice':
      return iceImageUrl;
    case 'lightning':
      return lightningImageUrl;
    case 'poison':
      return poisonImageUrl;
    case 'water':
      return waterImageUrl;
    case 'wind':
      return windImageUrl;
    default:
      return '';
  }
};

export const CardStats = ({ card }: CardStatsProps) => {
  const cardElement =
    card.element != null ? (
      <div className={styles.element}>
        <img
          src={convertElementToAssetUrl(card.element)}
          alt={`${card.element} element`}
        />
      </div>
    ) : null;

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
        {convertStat(card.stats.west)}
      </span>

      {cardElement}
    </div>
  );
};
