import { Link } from "react-router-dom";
import { GameBoardData } from "../datatypes/gameDatatypes";
import { handleNewGame } from "../handlers/handleNewGame";
import { useDispatch } from "react-redux";
import { newGameReset, newGameSet } from "./gameBoardSlice";

const DashboardSide = ({ gameBoard }: { gameBoard: GameBoardData }) => {
  const {
    roundCount,
    roundAmount,
    winCount,
    totalFound,
    cardsFound,
    userName,
    isLoss,
    isWin,
  } = gameBoard;
  const dispatch = useDispatch();

  const handleNewGameClick = () => {
    handleNewGame(gameBoard, dispatch, newGameReset, newGameSet);
  };

  const endOfGame = roundCount > roundAmount;
  const disabledHighscore = userName !== "" && roundCount <= roundAmount;

  return (
    <div
      className={
        "game-dashboard-side" +
        (!userName || endOfGame || isLoss || isWin ? " solid" : "")
      }
    >
      <span className="dashboard-item">
        <p>round:</p>
        <h2>
          {endOfGame ? roundAmount : roundCount} / {roundAmount}
        </h2>
      </span>
      <span className="dashboard-item won">
        <p>won:</p>
        <h2>
          {winCount} / {roundAmount}
        </h2>
      </span>
      <span className="dashboard-item score">
        <p>points:</p>
        <h2>{(totalFound + cardsFound) * 10}</h2>
      </span>
      <Link to="../highscores">
        <button
          className={
            "btn dashboard-item highscores" +
            (endOfGame ? " end" : disabledHighscore ? " disabled" : "")
          }
          onClick={() => dispatch(newGameReset())}
          disabled={disabledHighscore}
        >
          high scores
        </button>
      </Link>
      <button
        className={"btn new-game" + (endOfGame ? " true" : "")}
        onClick={handleNewGameClick}
      >
        new game
      </button>
    </div>
  );
};

export default DashboardSide;
