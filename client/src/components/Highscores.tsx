import { useFetchHighscores } from "../hooks/useFetchHighscores";
import { formatDate } from "../lib/formatDate";
import { handleNewGame } from "../handlers/handleNewGame";
import { useDispatch, useSelector } from "react-redux";
import { newGameReset, newGameSet, selectedGameState } from "./gameBoardSlice";
import { Link } from "react-router-dom";
import "./Highscores.css";
import { useEffect, useState } from "react";

const Highscores = () => {
  const { highscores } = useFetchHighscores();
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);
  const [opacity, setOpacity] = useState({ opacity: 0 });

  const handleNewGameClick = () => {
    handleNewGame(gameBoard, dispatch, newGameReset, newGameSet);
  };

  useEffect(() => {
    const opacityTimer = setTimeout(() => {
    setOpacity({ opacity: 1 });
    }, 60);
    return () => clearTimeout(opacityTimer);

  }, []);

  return (
    <div className="highscores-main">
      <div className="highscores-container" style={opacity}>
        <h1>Highscores</h1>
        {highscores.length > 0 ? (
          <table className="highscores-table" >
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {highscores.map(
                (score, index) =>
                  index < 10 && (
                    <tr key={index}>
                      <th scope="row" className="standing-col">{index +1}</th>
                      <td className="name-col">
                        {score.user_name}
                      </td>
                      <td className="total-col">{score.total_points}</td>
                      <td className="date-col">{formatDate(score.created_at)}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        ) : (
          <p>NO GAMES RECORDED</p>
        )}
      </div>
      {/* <Link to="../game">
        <button className="btn game-link new-game true" onClick={handleNewGameClick}>
          play again
        </button>
      </Link> */}
    </div>
  );
};

export default Highscores;
