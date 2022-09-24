type CardProps = {
  card: {
    name: string;
    element?: string;
    stats: {
      north: number;
      east: number;
      south: number;
      west: number;
    };
    image: { base64: string; width: number; height: number };
    color: 'red' | 'blue';
  };
  style?: React.CSSProperties;
};

const blueGradient = `linear-gradient(to bottom, #b4c4f3, #343a81)`;
const redGradient = `linear-gradient(to bottom, #f3b4d2, #813442)`;

export const Card = ({ card, style }: CardProps) => {
  return (
    <div>
      <img
        src={card.image.base64}
        alt={card.name}
        style={{
          background: card.color === 'blue' ? blueGradient : redGradient,
          imageRendering: 'pixelated',
          width: card.image.width,
          height: card.image.height,
          minWidth: card.image.width,
          minHeight: card.image.height,
          transformOrigin: 'top left',
          ...style,
        }}
      />
    </div>
  );
};
