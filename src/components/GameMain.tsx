import { useEffect, useState } from "react";
import { useGenerateCardData } from "../hooks/useGenerateCardData";
import { useDispatch, useSelector } from "react-redux";
import { winAdded, lossAdded, RoundDataState } from "./roundDataSlice";
import {
  resultsUpdated,
  newRoundUpdated,
  boardFaceDown,
  alertUpdated,
  cardsFaceDown,
  cardsFlipped,
  cardFound,
  lossSet,
  winSet,
  newRoundSet,
} from "./gameBoardSlice";
import { RootState } from "../store";

import GameBoard from "./GameBoard";
import "./GameMain.css";

const GameMain = () => {
  const [gridN, setGridN] = useState(3);
  const dispatch = useDispatch();
  const { roundData, gameBoard } = useSelector((state: RootState) => {
    return {
      roundData: state.roundDataSlice.roundData,
      gameBoard: state.gameBoardSlice.gameBoard,
    };
  });
  // console.log(roundData, gameBoard);
  // useEffect(() => {
  //   const wins = roundData.find((round: RoundDataState) => round.win === true);
  //   console.log("wins:", wins);
  // }, [roundData]);

  // SETTINGS temp harcode
  const paintMax = 0.175; // difficulty / .1
  const revealDelay = 475; // 475

  const { cardState, totalColorCards } = useGenerateCardData(
    gridN,
    paintMax,
    gameBoard.isNewRound
  );
  const [cardData, setCardData] = cardState;


  // handle board reset on win/loss and new rounds
  useEffect(() => {
    const cardIdList = cardData.map((card) => card.id);

    if (gameBoard.isLoss || gameBoard.isWin) {
      dispatch(alertUpdated(gameBoard.isLoss ? "you got brained" : "Solid."));
      const lossTimeout = setTimeout(() => {
        dispatch(resultsUpdated({ totalFound: gameBoard.cardsFound }));
      }, 2000);
      return () => clearTimeout(lossTimeout);
    }

    if (gameBoard.isNewRound) {
      dispatch(alertUpdated("Next Round"));

      const roundReadyTimeout = setTimeout(() => {
        dispatch(alertUpdated("prepare yourself . . ."));
      }, 1500);
      dispatch(cardsFaceDown());

      const newRoundTimeout = setTimeout(() => {
        // turn cards face up
        dispatch(newRoundUpdated({ flippedCards: cardIdList }));
      }, 3500);

      return () => {
        clearTimeout(roundReadyTimeout);
        clearTimeout(newRoundTimeout);
      };
    } else {
      // turn cards face up
      dispatch(newRoundUpdated({ flippedCards: cardIdList }));

      // handle card turnover for start of round
      const boardResetTimeout = setTimeout(() => {
        dispatch(boardFaceDown());
      }, revealDelay);
      return () => clearTimeout(boardResetTimeout);
    }
  }, [gameBoard.isNewRound, gameBoard.isLoss, gameBoard.isWin]);

  // update GameData (rounds) on win or loss
  useEffect(() => {
    if (cardData.length !== 0 && gameBoard.cardsFound === totalColorCards) {
      dispatch(winSet(true)); //    ***WIN
      dispatch(
        winAdded({
          roundNum: gameBoard.roundCount,
          points: gameBoard.cardsFound,
          guesses: gameBoard.flippedCards.length,
        })
      );
    }
    if (gameBoard.isLoss) {
      dispatch(
        lossAdded({
          roundNum: gameBoard.roundCount,
          points: gameBoard.cardsFound,
          guesses: gameBoard.flippedCards.length,
        })
      );
    }
  }, [gameBoard.cardsFound, gameBoard.isLoss]);

  // turn clicked cards face up
  const handleCardClick = (id: number) => {
    if (!gameBoard.flippedCards.includes(id)) {
      dispatch(cardsFlipped(id));
      if (cardData[id].isColor) {
        console.log("card found");
        // if correct card, cardsFound++
        dispatch(cardFound());
      } else {
        // if wrong card, isLoss //   ***LOSS
        dispatch(lossSet(true));
        console.log("nope");
      }
    }
  };

  const getInputBacgroundSize = () => {
    return { backgroundSize: `${(gridN * 100) / 8}% 100%` };
  };

  return (
    <>
      <input
        type="range"
        min={3}
        max={8}
        step={1}
        onChange={(e) => setGridN(Number(e.target.value))}
        value={gridN}
        style={getInputBacgroundSize()}
      />
      <div className="game-dashboard-top">
        <h1 className="game-alert">
          {gameBoard.alert ||
            (gameBoard.cardsFound < totalColorCards
              ? gameBoard.cardsFound
              : gameBoard.alert)}
        </h1>
      </div>
      <GameBoard
        cardData={cardData}
        gridN={Math.sqrt(cardData.length)}
        flippedCards={gameBoard.flippedCards}
        handleCardClick={handleCardClick}
        isLoss={gameBoard.isLoss}
        isWin={gameBoard.isWin}
        isNewRound={gameBoard.isNewRound}
        isRevealed={gameBoard.isRevealed}
      />
      <div className="game-dashboard-bottom">
        {/* <div className="dashboard-bottom-rounds">
        </div> */}
        <span className="round-count">
          <p>round:</p>
          <h2>
            {gameBoard.roundCount} / {gameBoard.roundAmount}
          </h2>
        </span>
        <span className="round-count won">
          <p>won:</p>
          <h2>
            {gameBoard.winCount} / {gameBoard.roundAmount}
          </h2>
        </span>
        <span className="round-count score">
          <p>points:</p>
          <h3>
            {gameBoard.totalFound +
              (gameBoard.isNewRound ||
              gameBoard.flippedCards.length === cardData.length
                ? 0
                : gameBoard.cardsFound)}
          </h3>
        </span>
        <button
          className="new-game"
          onClick={() => dispatch(newRoundSet(true))}
        >
          new game
        </button>
      </div>
    </>
  );
};

export default GameMain;
