import { GameBoardProps } from "../datatypes/proptypes";
import GameCard from "./GameCard";

function GameBoard({ gridN, cardData, ...rest }: GameBoardProps) {

  console.log(cardData.filter(el => el.isColor))
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
          {...rest}
        />
      ))}
    </div>
  );
}
export default GameBoard;
