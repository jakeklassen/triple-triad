import * as TripleTriad from '@tripletriad/game';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { ServerMessage } from '../../../../backend-socketio/src/schemas/server-message';
import { MatchData } from '../Board/Board';
import { Card } from '../Card';
import { ActiveHandIndicator } from './ActiveHandIndicator';
import { Score } from './Score';

type HandProps = {
  player: TripleTriad.Player;
  active?: boolean;
  score: number;
  onCardSelected: (player: TripleTriad.Player, cardName: string) => void;
  matchData: MatchData;
  currentTurn: TripleTriad.PlayerLabel;
};

const nonNullCard = (
  card: TripleTriad.CommonTypes.Hand[number],
): card is NonNullable<typeof card> => card != null;

export const Hand = ({
  player,
  active = false,
  score,
  onCardSelected,
  matchData,
  currentTurn,
}: HandProps) => {
  const [selectedCard, setSelectedCard] = React.useState<string>();

  const onCardClicked = (cardName: string) => {
    if (active === false) {
      return;
    }

    // Ignore selection if it isn't my turn
    if (matchData.whichPlayer === currentTurn) {
      setSelectedCard(cardName);
      onCardSelected(player, cardName);
    }
  };

  useEffect(() => {
    matchData.socket.on('message', (message: ServerMessage) => {
      // If both players have the same card, only select it in the hand of the active player
      if (message.event === 'card-selected' && player.label === currentTurn) {
        setSelectedCard(message.cardName);
      }
    });
  }, []);

  const cards = player.hand.filter(nonNullCard).map((card, cardIndex) => {
    return (
      <Card
        key={`${cardIndex}`}
        card={{
          ...card,
          color: player.label == TripleTriad.PlayerLabel.One ? 'red' : 'blue',
        }}
        direction={
          player.label == TripleTriad.PlayerLabel.One ? 'left' : 'right'
        }
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
