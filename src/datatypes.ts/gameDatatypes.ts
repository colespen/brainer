export interface Card {
  id: number;
  color: string;
  isColor?: boolean;
}

export interface GameData {
  roundNum: number;
  points: number;
  guesses: number;
}
