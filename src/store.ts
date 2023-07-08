import { configureStore } from "@reduxjs/toolkit";
import gameDataReducer, { GameDataState } from "./components/gameDataSlice";
import gameBoardReducer from "./components/gameBoardSlice";
import { GameBoard } from "./datatypes/gameDatatypes";

export interface RootState {
  gameDataSlice:  { gameData: GameDataState[] };
  gameBoardSlice: GameBoard;
}

const store = configureStore({
  reducer: {
    gameDataSlice: gameDataReducer,
    gameBoardSlice: gameBoardReducer,
  },
});

export default store;
