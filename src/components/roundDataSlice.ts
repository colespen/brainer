import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RoundData } from "../datatypes/gameDatatypes";

export interface RoundDataState extends RoundData {
  win: boolean;
}

const initialState: { roundData: RoundDataState[] } = {
  roundData: [],
};

const roundDataState = (state: RootState) => state.roundDataSlice;
export const selectedRoundState = createSelector([roundDataState], (state) => {
  return {
    roundData: state.roundData,
  };
});

const roundDataSlice = createSlice({
  name: "roundData",
  initialState,
  reducers: {
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
