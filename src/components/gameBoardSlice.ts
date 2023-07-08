import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameBoard } from "../datatypes/gameDatatypes";

const initialState: GameBoard = {
  gameBoard: {
    flippedCards: [],
    cardsFound: 0,
    totalFound: 0,
    isNewRound: true,
    isRevealed: false,
    alert: null,
    isWin: false,
    isLoss: false,
    roundAmount: 5,
    roundCount: 1,
    winCount: 0,
  },
};

const gameBoardSlice = createSlice({
  name: "gameBoard",
  initialState,
  reducers: {
    lossUpdated: (state, action: PayloadAction<{ totalFound: number }>) => {
      const { totalFound } = action.payload;
      state.gameBoard = {
        ...state.gameBoard,
        totalFound: (state.gameBoard.totalFound += totalFound),
        isLoss: false,
        alert: null,
        cardsFound: 0,
        isNewRound: true,
        winCount: (state.gameBoard.winCount += 1),
      };
    },
    winUpdated: (state, action: PayloadAction<{ totalFound: number }>) => {
      const { totalFound } = action.payload;
      state.gameBoard = {
        ...state.gameBoard,
        totalFound: (state.gameBoard.totalFound += totalFound),
        isWin: false,
        alert: null,
        cardsFound: 0,
        isNewRound: true,
        winCount: (state.gameBoard.winCount += 1),
      };
    },
    newRoundUpdated: (
      state,
      action: PayloadAction<{ flippedCards: number[] }>
    ) => {
      const { flippedCards } = action.payload;
      const notFirstRound = state.gameBoard.flippedCards.length;
      state.gameBoard = {
        ...state.gameBoard,
        alert: null,
        isRevealed: true,
        isNewRound: false,
        flippedCards,
        roundCount: (state.gameBoard.roundCount += notFirstRound ? 1 : 0),
      };
    },
    boardFaceDown: (state) => {
      state.gameBoard = {
        ...state.gameBoard,
        alert: null,
        flippedCards: [],
        isRevealed: false,
      };
    },
    boardStart: (state, action: PayloadAction<{ flippedCards: number[] }>) => {
      const { flippedCards } = action.payload;
      state.gameBoard = {
        ...state.gameBoard,
        isRevealed: true,
        flippedCards,
      };
    },
    alertUpdated: (state, action: PayloadAction<string>) => {
      const alert = action.payload;
      state.gameBoard.alert = alert;
    },
    cardsFaceDown: (state) => {
      state.gameBoard.flippedCards = [];
    },
    cardsFlipped: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.gameBoard.flippedCards = [...state.gameBoard.flippedCards, id];
    },
    cardFound: (state) => {
      state.gameBoard.cardsFound += 1;
    },
    winSet: (state, action: PayloadAction<boolean>) => {
      const isWin = action.payload;
      state.gameBoard.isWin = isWin;
    },
    lossSet: (state, action: PayloadAction<boolean>) => {
      const isLoss = action.payload;
      state.gameBoard.isLoss = isLoss;
    },
    newRoundSet: (state, action: PayloadAction<boolean>) => {
      const isNewRound = action.payload;
      state.gameBoard.isNewRound = isNewRound;
    },
  },
});

export const {
  lossUpdated,
  winUpdated,
  newRoundUpdated,
  boardFaceDown,
  boardStart,
  alertUpdated,
  cardsFaceDown,
  cardsFlipped,
  cardFound,
  winSet,
  lossSet,
  newRoundSet,
} = gameBoardSlice.actions;

export default gameBoardSlice.reducer;
