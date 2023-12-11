import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameBoardState } from "../datatypes/gameDatatypes";
import { RootState } from "../store";

const initialState: GameBoardState = {
  gameBoard: {
    gridN: 4,
    flippedCards: [],
    cardsFound: 0,
    totalFound: 0,
    isNewGame: true,
    isNewRound: true,
    isRevealed: false,
    userName: "",
    alert: null,
    isWin: false,
    isLoss: false,
    roundAmount: 5,
    roundCount: 1,
    winCount: 0,
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
    userNameSet: (state, action: PayloadAction<string>) => {
      const userName = action.payload;
      state.gameBoard.userName = userName;
      state.gameBoard.roundCount = 1;
    },
    gridNSet: (state, action: PayloadAction<number>) => {
      const gridN = action.payload;
      state.gameBoard.gridN = gridN;
    },
    roundsSet: (state, action: PayloadAction<number>) => {
      const roundAmount = action.payload;
      state.gameBoard.roundCount = Infinity;
      state.gameBoard.roundAmount = roundAmount;
    },
    hardReset: (state) => {
      state.gameBoard = {
        ...initialState.gameBoard,
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
  newGameSet,
  userNameSet,
  gridNSet,
  roundsSet,
  hardReset,
} = gameBoardSlice.actions;

export default gameBoardSlice.reducer;
