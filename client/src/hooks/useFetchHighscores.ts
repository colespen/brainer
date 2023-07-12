/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useEffect, useState } from "react";

interface Highscore {
  user_name: string;
  total_points: number;
  created_at: string;
}

export const useFetchHighscores = () => {
  const [highscores, setHighscores] = useState<Highscore[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/highscores`)
      .then((response) => response.json())
      .then((data: Highscore[]) => {
        setHighscores(data);
      })
      .catch((error) => {
        console.error("Error fetching highscores:", error);
      });
  }, []);

  return { highscores };
};
