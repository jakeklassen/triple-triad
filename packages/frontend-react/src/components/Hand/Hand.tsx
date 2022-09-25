import * as TripleTriad from '@tripletriad/game';
import { Card } from '../Card';

type HandProps = {
  player: TripleTriad.Player;
};

const nonNullCard = (
  card: TripleTriad.CommonTypes.Hand[number],
): card is NonNullable<typeof card> => card != null;

export const Hand = ({ player }: HandProps) => {
  const cards = player.hand.filter(nonNullCard).map((card, cardIndex) => {
    return (
      <Card
        key={`${cardIndex}`}
        card={{
          ...card,
          color: player.label == TripleTriad.Player.One ? 'red' : 'blue',
        }}
      />
    );
  });

  return (
    <div className="flex flex-col col-span-1 row-span-1 m-auto mt-[18px] mb-[16px] space-y-[-30px]">
      {cards}
    </div>
  );
};
