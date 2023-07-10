import { Card, GameBoardData } from "./gameDatatypes";

export interface GameBoardProps {
  gridN: number;
  cardData: Card[];
  isLoss: boolean;
  isWin: boolean;
  isNewRound: boolean;
  gameBoard: GameBoardData;
  // flippedCards: number[];
  // handleCardClick: (id: number) => void;
  // isRevealed: boolean;
}

export interface GameCardProps
  extends Omit<GameBoardProps, "gridN" | "cardData" | "gameBoard"> {
  id: number;
  color: string;
  isColor: boolean;
  isRevealed: boolean;
  flippedCards: number[];
  handleCardClick: (id: number) => void;
}
