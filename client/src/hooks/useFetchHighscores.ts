/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useEffect, useState } from "react";
import { Highscore } from "../services/fetchHighscores";

const fetchHighscores = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PROD_SERVER_URL}/api/highscores`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as Promise<Highscore[]>;
    return data;
  } catch (error) {
    console.error("Error fetching highscores:", error);
    throw error;
  }
};

export const useFetchHighscores = () => {
  const [highscores, setHighscores] = useState<Highscore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchHighscores()
      .then((data) => {
        setHighscores(data);
      })
      .catch((error: Error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { highscores, loading, error };
};
