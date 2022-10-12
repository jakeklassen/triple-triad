import tripleTriad from '@tripletriad/game';
import { Card } from '../../Card';
import { CardPropsCard } from '../../Card/Card';
import styles from './Cell.module.css';

type CellProps = {
  card?: tripleTriad.CommonTypes.Card;
  playerLabel?: tripleTriad.PlayerLabel;
  ownerLabel?: tripleTriad.PlayerLabel;
  selectable?: boolean;
  row: number;
  column: number;
  onClick: (row: number, column: number) => void;
};

export const Cell = ({
  card,
  playerLabel,
  ownerLabel,
  selectable,
  row,
  column,
  onClick,
}: CellProps) => {
  if (card == null || playerLabel == null || ownerLabel == null) {
    return (
      <div
        className={selectable === true ? styles.cellSelectable : undefined}
        onClick={() => onClick(row, column)}
      >
        <Card />
      </div>
    );
  }

  const newCard: CardPropsCard = {
    ...structuredClone(card),
    color: ownerLabel === 'one' ? 'red' : 'blue',
  };

  const direction = ownerLabel === 'one' ? 'left' : 'right';

  return (
    <div>
      <Card card={newCard} direction={direction} />
    </div>
  );
};
