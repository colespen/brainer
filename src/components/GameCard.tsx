import { colorMap } from "../datatypes.ts/colortypes";

export interface GameCardProps {
  id: number;
  flippedCards: number[];
  color: string;
  handleCardClick: (id: number) => void;
}

const GameCard = ({
  id,
  flippedCards,
  color,
  handleCardClick,
}: GameCardProps) => {
  const isFlipped = flippedCards.includes(id);

  return (
    <div
      className={`board-card ${isFlipped ? "flipped" : ""}`}
      style={{ backgroundColor: isFlipped ? color : colorMap.faceDown }}
      // style={{ backgroundColor: color }}
      onClick={() => handleCardClick(id)}
    ></div>
  );
};

export default GameCard;
