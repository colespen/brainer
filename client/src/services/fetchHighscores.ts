export interface Highscore {
  user_name: string;
  total_points: number;
  created_at: string;
}

export const fetchHighscores = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PROD_SERVER_URL}/api/highscores`,
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
