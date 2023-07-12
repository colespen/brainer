import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Highscores.css";

interface Highscore {
  user_name: string;
  total_points: number;
}

const Highscores = () => {
  const [highscores, setHighscores] = useState<Highscore[]>([]);

  useEffect(() => {
    fetch("http://localhost:8001/api/highscores")
      .then((response) => response.json())
      .then((data: Highscore[]) => {
        setHighscores(data);
      })
      .catch((error) => {
        console.error("Error fetching highscores:", error);
      });
  }, []);

  console.log("highscores:", highscores);

  return (
    <div className="highscores-main">
      <div className="highscores-container">
        <h1>Highscores</h1>
        {highscores.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {highscores.map((score, index) => (
                <tr key={index}>
                  <td>{score.user_name}</td>
                  <td>{score.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p></p>
        )}
      </div>
      <Link to="../game">
        <button className="game-link">play again</button>
      </Link>
    </div>
  );
};

export default Highscores;
