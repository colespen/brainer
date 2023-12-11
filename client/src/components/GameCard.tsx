import { useEffect, useState } from "react";
import { colorMap } from "../datatypes/colortypes";
import { GameCardProps } from "../datatypes/proptypes";

const GameCard = ({
  id,
  flippedCards,
  color,
  handleCardClick,
  isLoss,
  isWin,
  isNewRound,
  isRevealed,
  isColor,
}: GameCardProps) => {
  const isFlipped = flippedCards.includes(id);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    setIsClicked(false);
  }, [isNewRound]);

  const notFound = !isClicked && isColor;
  const winColor = isWin && isColor ? colorMap.win : color;
  const cardColor = isLoss && notFound ? colorMap.notFound : winColor;

  return (
    <button
      className={
        "btn board-card" +
        (isFlipped ? " flipped" : "") +
        (notFound ? " not-found" : "")
      }
      style={{
        backgroundColor: isFlipped ? cardColor : colorMap.faceDown,
      }}
      // style={{ backgroundColor: color }}
      onClick={() => {
        handleCardClick(id);
        setIsClicked(true);
      }}
      disabled={isRevealed || isLoss || isWin || isNewRound}
    ></button>
  );
};

export default GameCard;
