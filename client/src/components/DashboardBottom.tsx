import { Link } from "react-router-dom";
import { GameBoardData } from "../datatypes/gameDatatypes";
import { handleNewGame } from "../handlers/handleNewGame";
import { useDispatch } from "react-redux";
import { newGameReset, newGameSet } from "./gameBoardSlice";

const DashboardBottom = ({ gameBoard }: { gameBoard: GameBoardData }) => {
  const {
    roundCount,
    roundAmount,
    winCount,
    totalFound,
    cardsFound,
    userName,
  } = gameBoard;
  const dispatch = useDispatch();

  const handleNewGameClick = () => {
    handleNewGame(gameBoard, dispatch, newGameReset, newGameSet);
  };

  return (
    <div className="game-dashboard-bottom">
      <span className="dashboard-item">
        <p>round:</p>
        <h2>
          {roundCount > roundAmount ? roundAmount : roundCount} / {roundAmount}
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
          className="dashboard-item highscores"
          onClick={() => dispatch(newGameReset())}
          disabled={userName !== "" && roundCount <= roundAmount}
        >
          high scores
        </button>
      </Link>
      <button
        className={"new-game " + (roundCount > roundAmount ? "true" : "")}
        onClick={handleNewGameClick}
      >
        new game
      </button>
    </div>
  );
};

export default DashboardBottom;
