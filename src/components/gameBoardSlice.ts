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
    roundAmount: 2,
    roundCount: 1,
    winCount: 0,
  },
};

const gameBoardSlice = createSlice({
  name: "gameBoard",
  initialState,
  reducers: {
    resultsUpdated: (state, action: PayloadAction<{ totalFound: number }>) => {
      const { totalFound } = action.payload;
      state.gameBoard = {
        ...state.gameBoard,
        totalFound: (state.gameBoard.totalFound += totalFound),
        isLoss: false,
        isWin: false,
        alert: null,
        cardsFound: 0,
        isNewRound: true,
      };
    },
    newRoundUpdated: (
      state,
      action: PayloadAction<{ flippedCards: number[] }>
    ) => {
      const { flippedCards } = action.payload;
      // const notFirstRound = state.gameBoard.flippedCards.length;
      // let currRound = state.gameBoard.roundCount;
      // let roundAmount = state.gameBoard.roundAmount;
      state.gameBoard = {
        ...state.gameBoard,
        alert: null,
        isRevealed: true,
        isNewRound: false,
        flippedCards,
      };
    },

    gameStartFaceDown: (state) => {
      state.gameBoard = {
        ...state.gameBoard,
        alert: null,
        flippedCards: [],
        isRevealed: false,
      };
    },
    boardStart: (state, action: PayloadAction<{ flippedCards: number[] }>) => {
      const { flippedCards } = action.payload;
      state.gameBoard.isRevealed = true;
      state.gameBoard.flippedCards = flippedCards;
    },
    alertUpdated: (state, action: PayloadAction<string>) => {
      const alert = action.payload;
      state.gameBoard.alert = alert;
    },
    cardsFaceUp: (state, action: PayloadAction<{ flippedCards: number[] }>) => {
      const { flippedCards } = action.payload;
      state.gameBoard.flippedCards = flippedCards;
    },
    cardsFaceDown: (state) => {
      state.gameBoard.flippedCards = [];
    },
    cardFlipped: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.gameBoard.flippedCards = [...state.gameBoard.flippedCards, id];
    },
    cardFound: (state) => {
      state.gameBoard.cardsFound += 1;
    },
    winSet: (state, action: PayloadAction<boolean>) => {
      const isWin = action.payload;
      state.gameBoard.isWin = isWin;
      state.gameBoard.winCount += 1;
    },
    lossSet: (state, action: PayloadAction<boolean>) => {
      const isLoss = action.payload;
      state.gameBoard.isLoss = isLoss;
    },
    incrementRound: (state) => {
      state.gameBoard.roundCount += 1;
    },
    newGameReset: (state) => {
      state.gameBoard = {
        ...state.gameBoard,
        flippedCards: [],
        isNewRound: true,
        roundCount: 1,
        winCount: 0,
      };
    },
  },
});

export const {
  resultsUpdated,
  newRoundUpdated,
  gameStartFaceDown,
  boardStart,
  alertUpdated,
  cardsFaceUp,
  cardsFaceDown,
  cardFlipped,
  cardFound,
  winSet,
  lossSet,
  newGameReset,
  incrementRound,
} = gameBoardSlice.actions;

export default gameBoardSlice.reducer;
