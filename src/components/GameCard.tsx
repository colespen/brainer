import { colorMap } from "../datatypes.ts/colortypes";

export interface GameCardProps {
  id: number;
  flippedCards: number[];
  color: string;
  handleCardClick: (id: number) => void;
  isLoss: boolean,
  isWin: boolean,
  isNewRound: boolean,
  isRevealed: boolean
}

const GameCard = ({
  id,
  flippedCards,
  color,
  handleCardClick,
  isLoss,
  isWin,
  isNewRound,
  isRevealed
}: GameCardProps) => {
  const isFlipped = flippedCards.includes(id);

  return (
    <button
      className={`board-card ${isFlipped ? "flipped" : ""}`}
      style={{ backgroundColor: isFlipped ? color : colorMap.faceDown }}
      // style={{ backgroundColor: color }}
      onClick={() => handleCardClick(id)}
      disabled={isRevealed || isLoss || isWin || isNewRound}
    ></button>
  );
};

export default GameCard;
