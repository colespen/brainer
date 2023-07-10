import { GameBoardData } from "../datatypes/gameDatatypes";
import { RoundDataState } from "../components/roundDataSlice";

export const alertRoundUpdate = (
  roundData: RoundDataState[],
  gameBoard: GameBoardData
) => {
  if (!roundData.length) {
    return "Here we go!";
  }
  if (gameBoard.roundCount !== gameBoard.roundAmount) {
    return `Round ${gameBoard.roundCount}`;
  } else {
    return "Final Round";
  }
};

export const alertEndUpdate = (gameBoard: GameBoardData) => {
  return gameBoard.winCount === gameBoard.roundAmount ? "Winner!" : "Game Over";
};

export const roundResultAdd = (gameBoard: GameBoardData) => {
  return {
    roundNum: gameBoard.roundCount,
    points: gameBoard.cardsFound,
    guesses: gameBoard.flippedCards.length,
  };
};
