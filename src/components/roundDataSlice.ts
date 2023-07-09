import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoundData } from "../datatypes/gameDatatypes";

export interface RoundDataState extends RoundData {
  win: boolean;
}

const initialState: { roundData: RoundDataState[] } = {
  roundData: [],
};

const roundDataSlice = createSlice({
  name: "roundData",
  initialState,
  reducers: {
    // roundRecorded: (state, action: PayloadAction<RoundData>) => {
    //   const { roundNum, points, guesses } = action.payload;
    //   const win = action.type === "winAdded"
    //   state.roundData.push({
    //     roundNum,
    //     points,
    //     guesses,
    //     win,
    //   });
    // },
    winAdded: (state, action: PayloadAction<RoundData>) => {
      const { roundNum, points, guesses } = action.payload;
      state.roundData.push({
        roundNum,
        points,
        guesses,
        win: true,
      });
    },
    lossAdded: (state, action: PayloadAction<RoundData>) => {
      const { roundNum, points, guesses } = action.payload;
      state.roundData.push({
        roundNum,
        points,
        guesses,
        win: false,
      });
    },
  },
});

export const { winAdded, lossAdded } = roundDataSlice.actions;

export default roundDataSlice.reducer;
