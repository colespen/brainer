import { useFetchHighscores } from "../hooks/useFetchHighscores";
import { formatDate } from "../lib/formatDate";
import { handleNewGame } from "../handlers/handleNewGame";
import { useDispatch, useSelector } from "react-redux";
import { newGameReset, newGameSet, selectedGameState } from "./gameBoardSlice";
import { Link } from "react-router-dom";
import "./Highscores.css";

const Highscores = () => {
  const { highscores } = useFetchHighscores();
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);

  const handleNewGameClick = () => {
    handleNewGame(gameBoard, dispatch, newGameReset, newGameSet);
  };

  return (
    <div className="highscores-main">
      <div className="highscores-container">
        <h1>Highscores</h1>
        {highscores.length > 0 ? (
          <table className="highscores-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {highscores.map((score, index) => (
                <tr key={index}>
                  <td>
                    {index + 1} {score.user_name}
                  </td>
                  <td>{score.total_points}</td>
                  <td>{formatDate(score.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p></p>
        )}
      </div>
      <Link to="../game">
        <button className="game-link" onClick={handleNewGameClick}>
          play again
        </button>
      </Link>
    </div>
  );
};

export default Highscores;
