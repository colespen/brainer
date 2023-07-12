import { GameBoardData } from "../datatypes/gameDatatypes";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

export const handleNewGame = (
  gameBoard: GameBoardData,
  dispatch: Dispatch<AnyAction>,
  resetCB: () => AnyAction,
  newGameCB: (isNewGame: boolean) => AnyAction
) => {
  if (!gameBoard.userName || gameBoard.isRevealed || gameBoard.isLoss || gameBoard.isWin) return;
  console.log("NEW GAME")
  dispatch(resetCB());
  dispatch(newGameCB(true));
};
