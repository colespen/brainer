import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameBoardState } from "../datatypes/gameDatatypes";
import { RootState } from "../store";

const initialState: GameBoardState = {
  gameBoard: {
    flippedCards: [],
    cardsFound: 0,
    totalFound: 0,
    isNewRound: true,
    isRevealed: false,
    alert: null,
    isWin: false,
    isLoss: false,
    roundAmount: 1, // TODO: don't hardcode, shouwld be in settings
    roundCount: 1,
    winCount: 0,
    isNewGame: false,
  },
};

const gameBoardState = (state: RootState) => state.gameBoardSlice;
export const selectedGameState = createSelector([gameBoardState], (state) => {
  return {
    gameBoard: state.gameBoard,
  };
});

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
    newRoundUpdated: (state) => {
      state.gameBoard = {
        ...state.gameBoard,
        alert: null,
        isRevealed: true,
        isNewRound: false,
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
        totalFound: 0,
      };
    },
    newGameSet: (state, action: PayloadAction<boolean>) => {
      const isNewGame = action.payload;
      state.gameBoard.isNewGame = isNewGame;
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
  newGameSet
} = gameBoardSlice.actions;

export default gameBoardSlice.reducer;
