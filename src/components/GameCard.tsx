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

  console.log(isNewRound);
  useEffect(() => {
    setIsClicked(false);
  }, [isNewRound]);

  const notFound = !isClicked && isColor;
  const winColor = isWin && isColor ? "#00b0ff": color
  const cardColor = isLoss && notFound ? colorMap.notFound : winColor;

  return (
    <button
      className={
        "board-card" +
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
