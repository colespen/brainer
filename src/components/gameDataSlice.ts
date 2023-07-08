import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameData } from "../datatypes.ts/gameDatatypes";

interface GameDataState {
  gameData: GameData[];
}

const initialState: GameDataState = {
  gameData: [],
};

const gameDataSlice = createSlice({
  name: "gameData",
  initialState,
  reducers: {
    addGameData: (state, action: PayloadAction<GameData>) => {
      state.gameData.push(action.payload);
    },
  },
});

export const { addGameData } = gameDataSlice.actions;

export default gameDataSlice.reducer;