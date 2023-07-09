import { configureStore } from "@reduxjs/toolkit";
import roundDataReducer, { RoundDataState } from "./components/roundDataSlice";
import gameBoardReducer from "./components/gameBoardSlice";
import { GameBoard } from "./datatypes/gameDatatypes";

export interface RootState {
  roundDataSlice:  { roundData: RoundDataState[] };
  gameBoardSlice: GameBoard;
}

const store = configureStore({
  reducer: {
    roundDataSlice: roundDataReducer,
    gameBoardSlice: gameBoardReducer,
  },
});

export default store;
