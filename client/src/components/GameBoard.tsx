import { useDispatch } from "react-redux";
import { cardFlipped, cardFound, lossSet } from "./gameBoardSlice";
import { GameBoardProps } from "../datatypes/proptypes";
import GameCard from "./GameCard";

function GameBoard({ gridN, cardData, gameBoard, ...rest }: GameBoardProps) {
  const dispatch = useDispatch();

  // turn clicked cards face up
  const handleCardClick = (id: number) => {
    if (!gameBoard.flippedCards.includes(id)) {
      dispatch(cardFlipped(id));
      if (cardData[id].isColor) {
        // if correct card, cardsFound++
        dispatch(cardFound());
      } else {
        // if wrong card, isLoss //   ***LOSS
        dispatch(lossSet(true));
      }
    }
  };

  return (
    <div
      className="game-board"
      style={{
        gridTemplateRows: `repeat(${gridN}, 1fr)`,
        gridTemplateColumns: `repeat(${gridN}, 1fr)`,
      }}
    >
      {cardData.map((card) => (
        <GameCard
          key={card.id}
          id={card.id}
          color={card.color}
          isColor={card.isColor}
          isRevealed={gameBoard.isRevealed}
          flippedCards={gameBoard.flippedCards}
          handleCardClick={handleCardClick}
          {...rest}
        />
      ))}
    </div>
  );
}

export default GameBoard;
