import { useEffect } from "react";
import {
  alertUpdated,
  cardsFaceDown,
  cardsFaceUp,
  gameStartFaceDown,
  incrementRound,
  newRoundUpdated,
  resultsUpdated,
} from "../components/gameBoardSlice";
import {
  alertWinMessage,
  alertRoundUpdate,
  alertEndUpdate,
} from "../actionHelpers.ts/gameBoardActions";
import { useDispatch } from "react-redux";
import { GameBoardData } from "../datatypes/gameDatatypes";
import { useGenerateCardData } from "./useGenerateCardData";
import { RoundDataState } from "../components/roundDataSlice";

const useBoardUpdate = (
  gameBoard: GameBoardData,
  roundData: RoundDataState[]
) => {
  const dispatch = useDispatch();
  const {
    gridN,
    userName,
    isLoss,
    isWin,
    isNewRound,
    isNewGame,
    roundCount,
    roundAmount,
    winCount,
  } = gameBoard;
  const { cardData, revealDelay } = useGenerateCardData(
    gridN,
    isNewRound,
    isNewGame
  );

    // handle board reset on win/loss and new rounds
    useEffect(() => {
      if (!userName) return;
      const cardIdList: number[] = cardData.map((card) => card.id);

      if (isLoss || isWin) {
        dispatch(alertUpdated(alertWinMessage(isLoss, winCount, roundAmount)));
        dispatch(cardsFaceUp({ flippedCards: cardIdList }));
        dispatch(incrementRound());
        const lossTimeout = setTimeout(() => {
          dispatch(resultsUpdated({ totalFound: gameBoard.cardsFound }));
        }, 2000);
        return () => clearTimeout(lossTimeout);
      }

      if (isNewGame || (isNewRound && roundCount <= roundAmount)) {
        !isNewGame &&
          dispatch(alertUpdated(alertRoundUpdate(roundData, gameBoard)));

        const roundReadyTimeout = setTimeout(() => {
          dispatch(alertUpdated("prepare yourself . . ."));
        }, 1500);

        dispatch(cardsFaceDown());

        const newRoundTimeout = setTimeout(() => {
          //  reveal cards and isNewRound = false
          dispatch(newRoundUpdated());
        }, 3250);

        return () => {
          clearTimeout(roundReadyTimeout);
          clearTimeout(newRoundTimeout);
        };
      } else if (roundCount <= roundAmount) {
        // Round Starts: Reveal Cards
        const faceUpDelay = setTimeout(() => {
          dispatch(cardsFaceUp({ flippedCards: cardIdList }));
        }, 250);

        // then turn down after delay
        const boardResetTimeout = setTimeout(() => {
          dispatch(gameStartFaceDown());
        }, revealDelay);
        return () => {
          clearTimeout(boardResetTimeout);
          clearTimeout(faceUpDelay);
        };
      } else {
        dispatch(gameStartFaceDown());
        dispatch(alertUpdated(alertEndUpdate(gameBoard)));
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName, dispatch, isNewRound, isLoss, isWin, isNewGame])
  
};

export { useBoardUpdate };
