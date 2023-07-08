import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameData } from "../datatypes/gameDatatypes";

// export interface GameData {
//   roundNum: number;
//   points: number;
//   guesses: number;
// }

export interface GameDataState extends GameData {
  win: boolean;
}

const initialState: { gameData: GameDataState[] } = {
  gameData: [],
};

const gameDataSlice = createSlice({
  name: "gameData",
  initialState,
  reducers: {
    winAdded: (state, action: PayloadAction<GameData>) => {
      const { roundNum, points, guesses } = action.payload;
      state.gameData.push({
        roundNum,
        points,
        guesses,
        win: true,
      });
    },
    lossAdded: (state, action: PayloadAction<GameData>) => {
      const { roundNum, points, guesses } = action.payload;
      state.gameData.push({
        roundNum,
        points,
        guesses,
        win: false,
      });
    },
  },
});

export const { winAdded, lossAdded } = gameDataSlice.actions;

export default gameDataSlice.reducer;
