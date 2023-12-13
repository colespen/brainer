import express, { Request, Response } from "express";
import { createHighscore, getHighscores } from "../db/queries";

const router = express.Router();

router.get("/highscores", async (req: Request, res: Response) => {
  try {
    const highscores = await getHighscores();
    console.log("HIGHSCORES:", highscores)
    res.send("GET HIGHSCORES ENDPOINT")
    res.json(highscores);
  } catch (error) {
    console.error("Error fetching highscores:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/gameresults", async (req: Request, res: Response) => {
  const { user_name, total_points } = req.body;
  console.log("req.body:", req.body);

  if (!user_name || !total_points) {
    res
      .status(400)
      .json({ message: "user_name and total points are required" });
    return;
  }

  try {
    await createHighscore(user_name, total_points);
    res.status(201).json({ message: "Highscore created" });
  } catch (error) {
    console.error("Error creating highscore:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
