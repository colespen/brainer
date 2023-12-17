import "./Highscores.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useFetchHighscores } from "../hooks/useFetchHighscores";
import { formatDate } from "../lib/formatDate";
import useCheckViewport from "../hooks/useCheckViewport";
import { Highscore } from "../services/fetchHighscores";

const Highscores = () => {
  const { highscores = [], loading, error } = useFetchHighscores();
  const [opacity, setOpacity] = useState({ opacity: 0 });
  const [latestUserId, setLatestUserId] = useState<string | null>(null);

  const { isLarge, isSmall } = useCheckViewport(1070, 480);

  const isMostRecent = (score: Highscore) => {
    const identifier = `${score.user_name}-${score.created_at}`;
    return (
      identifier === latestUserId &&
      sessionStorage.getItem("highscoreAdded") === "true"
    );
  };

  useEffect(() => {
    const opacityTimer = setTimeout(() => {
      setOpacity({ opacity: 1 });
    }, 60);
    return () => clearTimeout(opacityTimer);
  }, []);

  useEffect(() => {
    if (highscores.length > 0) {
      const latestScore = highscores.reduce((latest, current) => {
        return new Date(current.created_at) > new Date(latest.created_at)
          ? current
          : latest;
      }, highscores[0]);

      const identifier = `${latestScore.user_name}-${latestScore.created_at}`;

      setLatestUserId(identifier);

      if (sessionStorage.getItem("highscoreAdded") === "true") {
        // if highscore is viewed, remove from session storage
        const removeFlagDelay = setTimeout(() => {
          sessionStorage.removeItem("highscoreAdded");
        }, 1000);
        return () => clearTimeout(removeFlagDelay);
      }
    }
  }, [highscores]);

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
                  <tr
                    key={index}
                    className={isMostRecent(score) ? "highscore-highlight" : ""}
                  >
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
              style={{
                margin: isLarge ? "14px 0" : isSmall ? "12px 0" : "8px 0",
              }}
              count={10}
              width={isLarge ? 1020 : isSmall ? 450 : 350}
              height={isLarge ? 45 : isSmall ? 25 : 20}
              baseColor="#1a1d27"
              highlightColor="#3549ff"
            />
          ) : error ? (
            <p className="error">ERROR LOADING RECORDS: {error.message}</p>
          ) : highscores.length === 0 ? (
            <p>NO GAMES RECORDED</p>
          ) : null}
        </div>
      </div>
      <Link to="../game" className="game-link">
        <button className="btn new-game true" id="new-game-highscore">
          play again
        </button>
      </Link>
    </div>
  );
};

export default Highscores;
