export interface GameCardProps {
    id: number;
    flippedCards: number[];
    color: string;
    handleCardClick: (id: number) => void;
    isLoss: boolean,
    isWin: boolean,
    isNewRound: boolean,
    isRevealed: boolean
  }