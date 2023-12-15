import "./Highscores.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useFetchHighscores } from "../hooks/useFetchHighscores";
import { formatDate } from "../lib/formatDate";
import { handleNewGame } from "../handlers/handleNewGame";
import { newGameReset, newGameSet, selectedGameState } from "./gameBoardSlice";

const Highscores = () => {
  const { highscores = [], loading, error } = useFetchHighscores();
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
    <div className="highscores-root" style={opacity}>
      <div className="highscores-container">
        <h1>Highscores</h1>

        <table className="highscores-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Total</th>
              <th id="date-th">Date</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !error ? (
              highscores
                .map((score, index) => (
                  <tr key={index}>
                    <th scope="row" className="standing-col">
                      {index + 1}
                    </th>
                    <td className="name-col">{score.user_name}</td>
                    <td className="total-col">{score.total_points}</td>
                    <td className="date-col">{formatDate(score.created_at)}</td>
                  </tr>
                ))
                .slice(0, 100)
            ) : (
              <>
                <tr>
                  <th scope="row" className="standing-col"></th>
                  <td className="name-col"></td>
                  <td className="total-col"></td>
                  <td className="date-col"></td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        <div className="loading-container">
          {loading ? (
            <Skeleton
              style={{ marginTop: 28 }}
              count={10}
              width={1020}
              height={50}
              baseColor="#1a1d27"
              highlightColor="#5061ff"
            />
          ) : error ? (
            <p className="error">ERROR LOADING RECORDS: {error.message}</p>
          ) : highscores.length === 0 ? (
            <p>NO GAMES RECORDED</p>
          ) : null}
        </div>
      </div>
      <Link to="../game" className="game-link">
        <button className="btn new-game true" onClick={handleNewGameClick}>
          play again
        </button>
      </Link>
    </div>
  );
};

export default Highscores;
