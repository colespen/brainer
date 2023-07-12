import { Dispatch } from "react";
import { GameBoardData } from "../datatypes/gameDatatypes";
import { AnyAction } from "@reduxjs/toolkit";

export const handleNewGame = (
  gameBoard: GameBoardData,
  dispatch: Dispatch<AnyAction>,
  resetCB: () => AnyAction,
  newGameCB: (isNewGame: boolean) => AnyAction
) => {
  if (gameBoard.isRevealed || gameBoard.isLoss || gameBoard.isWin) return;
  dispatch(resetCB());
  dispatch(newGameCB(true));
};
