import { Card } from "./gameDatatypes";

export interface GameBoardProps {
  gridN: number;
  cardData: Card[];
  flippedCards: number[];
  handleCardClick: (id: number) => void;
  isLoss: boolean;
  isWin: boolean;
  isNewRound: boolean;
  isRevealed: boolean;
}

export interface GameCardProps extends Omit<GameBoardProps, "gridN" | "cardData"> {
  id: number;
  color: string;
}
