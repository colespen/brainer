import { configureStore } from "@reduxjs/toolkit";
import gameDataReducer from "./components/gameDataSlice";
import { GameData } from "./datatypes.ts/gameDatatypes";

export interface RootState {
  gameData: {
    gameData: GameData[];
  };
}

const store = configureStore({
  reducer: {
    gameDataSlice: gameDataReducer,
  },
});

export default store;
