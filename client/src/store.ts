import { configureStore } from "@reduxjs/toolkit";
import roundDataReducer, { RoundDataState } from "./components/roundDataSlice";
import gameBoardReducer from "./components/gameBoardSlice";
import { GameBoardState } from "./datatypes/gameDatatypes";

export interface RootState {
  roundDataSlice: { roundData: RoundDataState[] };
  gameBoardSlice: GameBoardState;
}

const store = configureStore({
  reducer: {
    roundDataSlice: roundDataReducer,
    gameBoardSlice: gameBoardReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store;
