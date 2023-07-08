export interface Card {
  id: number;
  color: string;
  isColor?: boolean;
}

export interface GameData {
  roundNum: number;
  win: boolean;
  points: number;
  guesses: number;
}
