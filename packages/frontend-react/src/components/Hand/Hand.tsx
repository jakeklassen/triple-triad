import * as TripleTriad from '@tripletriad/game';
import clsx from 'clsx';
import React from 'react';
import { Card } from '../Card';
import styles from './Hand.module.css';

type ActiveHandIndicatorProps = {
  active: boolean;
  player: TripleTriad.Player;
};

const ActiveHandIndicator = ({ active, player }: ActiveHandIndicatorProps) => {
  return (
    <span
      className={clsx('m-auto', active ? styles.active : null)}
      hidden={active ? false : true}
      data-direction={player.label == TripleTriad.Player.One ? 'left' : 'right'}
    />
  );
};

type ScoreProps = {
  score: number;
  player: TripleTriad.Player;
};

const Score = ({ score, player }: ScoreProps) => {
  return (
    <span
      className={clsx('m-auto', styles.score)}
      data-direction={player.label == TripleTriad.Player.One ? 'left' : 'right'}
    >
      {score}
    </span>
  );
};

type HandProps = {
  player: TripleTriad.Player;
  active?: boolean;
  score: number;
  onCardSelected: (player: TripleTriad.Player, cardName: string) => void;
};

const nonNullCard = (
  card: TripleTriad.CommonTypes.Hand[number],
): card is NonNullable<typeof card> => card != null;

export const Hand = ({
  player,
  active = false,
  score,
  onCardSelected,
}: HandProps) => {
  const [selectedCard, setSelectedCard] = React.useState<string>();

  const onCardClicked = (cardName: string) => {
    if (active === false) {
      return;
    }

    setSelectedCard(cardName);
    onCardSelected(player, cardName);
  };

  const cards = player.hand.filter(nonNullCard).map((card, cardIndex) => {
    return (
      <Card
        key={`${cardIndex}`}
        card={{
          ...card,
          color: player.label == TripleTriad.Player.One ? 'red' : 'blue',
        }}
        direction={player.label == TripleTriad.Player.One ? 'left' : 'right'}
        onClick={onCardClicked}
        selected={selectedCard === card.name}
      />
    );
  });

  return (
    <div
      className={clsx('flex', 'flex-col', 'm-auto', 'col-span-1', 'row-span-1')}
    >
      <ActiveHandIndicator active={active} player={player} />

      <div className={clsx('mt-[18px]', 'mb-[18px]', 'space-y-[-30px]')}>
        {cards}
      </div>

      <Score score={score} player={player} />
    </div>
  );
};
