import tripleTriad from '@tripletriad/game';
import { Card } from '../../Card';
import { CardPropsCard } from '../../Card/Card';
import styles from './Cell.module.css';

type CellProps = {
  card?: tripleTriad.CommonTypes.Card;
  playerLabel?: tripleTriad.PlayerLabel;
  selectable?: boolean;
};

export const Cell = ({ card, playerLabel, selectable }: CellProps = {}) => {
  if (card == null || playerLabel == null) {
    return (
      <div className={selectable === true ? styles.cellHover : undefined}>
        <Card />
      </div>
    );
  }

  const newCard: CardPropsCard = {
    ...structuredClone(card),
    color: playerLabel === 'one' ? 'red' : 'blue',
  };

  const direction = playerLabel === 'one' ? 'left' : 'right';

  return (
    <div>
      <Card card={newCard} direction={direction} />
    </div>
  );
};
