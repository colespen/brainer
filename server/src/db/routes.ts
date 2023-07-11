import express, { Request, Response } from 'express';
import { query } from './db';

const router = express.Router();

router.get('/highscores', async (req: Request, res: Response) => {
  try {
    const highscores = await query('SELECT * FROM highscore ORDER BY score DESC');
    res.json(highscores);
  } catch (error) {
    console.error('Error fetching highscores:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/highscores', async (req: Request, res: Response) => {
  const { name, score } = req.body;
  if (!name || !score) {
    res.status(400).json({ message: 'Name and score are required' });
    return;
  }

  try {
    await query('INSERT INTO highscore (name, score) VALUES ($1, $2)', [name, score]);
    res.status(201).json({ message: 'Highscore created' });
  } catch (error) {
    console.error('Error creating highscore:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
