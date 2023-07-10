import { useState } from "react";
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

  // TODO: FIX BUG FOR NOT FOUND class name missing on some cards

  // console.log("isClicked", isClicked);
  const notFound = !isClicked && isColor;
  const cardColor = isLoss && notFound ? colorMap.notFound : color;

  return (
    <button
      className={
        "board-card" +
        (isFlipped ? " flipped" : "") +
        (notFound ? " not-found" : "")
      }
      style={{ backgroundColor: isFlipped ? cardColor : colorMap.faceDown }}
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
