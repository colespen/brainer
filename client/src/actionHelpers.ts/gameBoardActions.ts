import { GameBoardData } from "../datatypes/gameDatatypes";
import { RoundDataState } from "../store/slices/roundDataSlice";

const alertRoundUpdate = (
  roundData: RoundDataState[],
  gameBoard: GameBoardData,
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

const alertWinMessage = (
  isLoss: boolean,
  winCount: number,
  roundAmount: number,
) => {
  let message = "";
  if (isLoss) {
    message = "you got brained";
  } else {
    if (winCount === 1) message = "No Brainer";
    else if (winCount === 2) message = "Wow";
    else if (winCount === roundAmount - 1) message = "Yup :)))";
    else if (winCount === roundAmount) message = "Perfecto!";
    else if (winCount % 2 === 0) {
      message = "Solid.";
    } else {
      message = "Correct";
    }
  }
  return message;
};

const alertEndUpdate = (gameBoard: GameBoardData) => {
  return gameBoard.winCount === gameBoard.roundAmount ? "Winner!" : "Game Over";
};

const roundResultAdd = (gameBoard: GameBoardData) => {
  return {
    roundNum: gameBoard.roundCount,
    points: gameBoard.cardsFound * 10,
    guesses: gameBoard.flippedCards.length,
  };
};

export { alertRoundUpdate, alertEndUpdate, roundResultAdd, alertWinMessage };
