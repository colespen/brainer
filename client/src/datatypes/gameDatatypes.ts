export interface CardData {
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
  userName: string;
}

export interface GameBoardState {
  gameBoard: GameBoardData;
}
