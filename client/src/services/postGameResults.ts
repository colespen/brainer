export const postGameResults = async (
  userName: string,
  totalPoints: number,
) => {
  if (!userName || !totalPoints) return;
  try {
    console.log("totalPoints:", totalPoints);
    const response = await fetch(
      `${import.meta.env.VITE_PROD_SERVER_URL}/api/gameresults`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: userName,
          total_points: totalPoints,
        }),
      },
    );

    if (response.status === 201) {
      console.log("POSTED GAME RESULTS");
      return response.json();
    } else {
      throw new Error("Error creating highscore");
    }
  } catch (error) {
    console.error("Error creating highscore:", error);
    throw new Error("Internal Server Error");
  }
};
