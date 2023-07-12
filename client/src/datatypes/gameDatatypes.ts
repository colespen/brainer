export interface Card {
  id: number;
  color: string;
  isColor: boolean;
}

export interface RoundData {
  roundNum: number;
  points: number;
  guesses: number;
}

export interface GameBoardData {
  isNewRound: boolean;
  isRevealed: boolean;
  isWin: boolean;
  isLoss: boolean;
  flippedCards: number[];
  cardsFound: number;
  totalFound: number;
  alert: string | null;
  roundAmount: number;
  roundCount: number;
  winCount: number;
  isNewGame: boolean;
}

export interface GameBoardState {
  gameBoard: GameBoardData;
}
