import { configureStore } from "@reduxjs/toolkit";
import gameDataReducer from "./components/gameDataSlice";
import gameBoardReducer, { GameBoard } from "./components/gameBoardSlice";
import { GameData } from "./datatypes.ts/gameDatatypes";

export interface RootState {
  gameDataSlice: {
    gameData: GameData[];
  };
  gameBoardSlice: GameBoard;
}

const store = configureStore({
  reducer: {
    gameDataSlice: gameDataReducer,
    gameBoardSlice: gameBoardReducer,
  },
});

export default store;
