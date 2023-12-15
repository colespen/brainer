import { KeyboardEventHandler, MouseEventHandler } from "react";
import { CardData, GameBoardData } from "./gameDatatypes";

export interface GameBoardProps {
  gridN: number;
  cardData: CardData[];
  isLoss: boolean;
  isWin: boolean;
  isNewRound: boolean;
  gameBoard: GameBoardData;
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


export interface DashboardTopProps {
  gameBoard: GameBoardData;
  cardData: CardData[];
  nameInputFocus: (inputElement: HTMLInputElement) => void;
  userName: string;
  listenForEnter: KeyboardEventHandler<HTMLInputElement>;
  setUserNameChange: (userNameChange: string) => void;
  handleNameClick: MouseEventHandler<HTMLButtonElement>;
}