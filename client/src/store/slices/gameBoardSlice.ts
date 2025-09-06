import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameBoardState } from "../../datatypes/gameDatatypes";
import { RootState } from "../index";

const initialState: GameBoardState = {
  gameBoard: {
    gridN: 5,
    flippedCards: [],
    cardsFound: 0,
    totalFound: 0,
    isNewGame: true,
    isNewRound: true,
    isRevealed: false,
    isGameEnd: false,
    userName: "",
    alert: null,
    isWin: false,
    isLoss: false,
    roundAmount: 5,
    roundCount: 1,
    winCount: 0,
    showSettings: false,
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
    alertUpdated: (state, action: PayloadAction<string | null>) => {
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
      state.gameBoard.flippedCards = [
        ...state.gameBoard.flippedCards,
        action.payload,
      ];
    },
    cardFound: (state) => {
      state.gameBoard.cardsFound += 1;
    },
    winSet: (state, action: PayloadAction<boolean>) => {
      state.gameBoard.isWin = action.payload;
      state.gameBoard.winCount += 1;
    },
    lossSet: (state, action: PayloadAction<boolean>) => {
      state.gameBoard.isLoss = action.payload;
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
      state.gameBoard.isNewGame = action.payload;
      state.gameBoard.isGameEnd = false;
    },
    userNameSet: (state, action: PayloadAction<string>) => {
      state.gameBoard.userName = action.payload;
      state.gameBoard.roundCount = 1;
    },
    gridNSet: (state, action: PayloadAction<number>) => {
      state.gameBoard.gridN = action.payload;
    },
    roundsSet: (state, action: PayloadAction<number>) => {
      state.gameBoard.roundCount = 1;
      state.gameBoard.roundAmount = action.payload;
    },
    gameEndSet: (state) => {
      state.gameBoard.isGameEnd = true;
    },
    hardReset: (state) => {
      state.gameBoard = {
        ...initialState.gameBoard,
      };
    },
    showSettingsSet: (state, action: PayloadAction<boolean>) => {
      const showSettings = action.payload;
      state.gameBoard.showSettings = showSettings;
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
  newGameSet,
  userNameSet,
  gridNSet,
  roundsSet,
  gameEndSet,
  hardReset,
  showSettingsSet,
} = gameBoardSlice.actions;

export default gameBoardSlice.reducer;
