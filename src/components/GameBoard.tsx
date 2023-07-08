import { useEffect } from "react";
import { useGenerateCardData } from "../hooks/useGenerateCardData";
import { useDispatch, useSelector } from "react-redux";
import { winAdded, lossAdded } from "./gameDataSlice";
import {
  winUpdated,
  lossUpdated,
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

import GameCard from "./GameCard";
import "./GameBoard.css";
import { RootState } from "../store";

const GameBoard = () => {
  const dispatch = useDispatch();
  // access from store
  const { gameData, gameBoard } = useSelector((state: RootState) => {
    return {
      gameData: state.gameDataSlice.gameData,
      gameBoard: state.gameBoardSlice.gameBoard,
    };
  });
  console.log(gameData, gameBoard);

  // SETTINGS temp harcode
  const gridN = 6;
  const paintMax = 0.15; // difficulty / .1
  const revealDelay = 1490; // 475

  const { cardState, totalColorCards } = useGenerateCardData(
    gridN,
    paintMax,
    gameBoard.isNewRound
  );
  const [cardData, setCardData] = cardState;

  // handle board reset on wins and new rounds
  // turn up cards on first render then over after delay
  useEffect(() => {
    const cardIdList = cardData.map((card) => card.id);

    if (gameBoard.isLoss) {
      dispatch(alertUpdated("you got brained"));
      const lossTimeout = setTimeout(() => {
        dispatch(
          lossUpdated({
            totalFound: gameBoard.cardsFound, // todo
          })
        );
      }, 2000);
      return () => clearTimeout(lossTimeout);
    }

    if (gameBoard.isWin) {
      dispatch(alertUpdated("Solid."));
      const winTimeout = setTimeout(() => {
        dispatch(
          winUpdated({
            totalFound: gameBoard.cardsFound, // todo
          })
        );
      }, 2000);
      return () => clearTimeout(winTimeout);
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

  // update GameData on win or loss
  useEffect(() => {
    if (cardData.length !== 0 && gameBoard.cardsFound === totalColorCards) {
      dispatch(winSet(true));
      dispatch(
        winAdded({
          roundNum: gameBoard.roundCount, // todo
          points: gameBoard.cardsFound, // todo
          guesses: gameBoard.flippedCards.length, // todo
        })
      );
    } else {
      // setIsWin(false);
    }
    if (gameBoard.isLoss) {
      dispatch(
        lossAdded({
          roundNum: gameBoard.roundCount, // todo
          points: gameBoard.cardsFound, // todo
          guesses: gameBoard.flippedCards.length, // todo
        })
      );
    }
  }, [gameBoard.cardsFound, gameBoard.isLoss]);

  // turn clicked cards face up
  const handleCardClick = (id: number) => {
    if (!gameBoard.flippedCards.includes(id)) {
      dispatch(cardsFlipped(id));
    }
    if (cardData[id].isColor) {
      console.log("card found");
      // if correct card, cardsFound++
      dispatch(cardFound());
    } else {
      // if wrong card, isLoss
      dispatch(lossSet(true));
      console.log("nope");
    }
  };

  return (
    <>
      <div className="game-dashboard-top">
        <span className="round-count">
          <p>round</p>
          <h2>
            {gameBoard.roundCount} / {gameBoard.roundAmount}
          </h2>
        </span>

        <h1 className="game-alert">
          {gameBoard.alert ||
            (gameBoard.cardsFound < totalColorCards
              ? gameBoard.cardsFound
              : gameBoard.alert)}
        </h1>
      </div>
      <div
        className="game-board"
        style={{
          gridTemplateColumns: `repeat(${gridN}, 1fr)`,
        }}
      >
        {cardData.map((card) => (
          <GameCard
            key={card.id}
            id={card.id}
            flippedCards={gameBoard.flippedCards}
            color={card.color}
            handleCardClick={handleCardClick}
            isLoss={gameBoard.isLoss}
            isWin={gameBoard.isWin}
            isNewRound={gameBoard.isNewRound}
            isRevealed={gameBoard.isRevealed}
          />
        ))}
      </div>
      <div className="game-dashboard-bottom">
        <span className="score-count">
          <h3>
            {gameBoard.totalFound +
              (gameBoard.isNewRound ||
              gameBoard.flippedCards.length === cardData.length
                ? 0
                : gameBoard.cardsFound)}
          </h3>
          <p>points</p>
        </span>
        <span className="round-count won">
          <p>won</p>
          <h2>
            {/* TODO */}
            {gameBoard.roundCount} / {gameBoard.roundAmount}
          </h2>
        </span>
      </div>
      <br></br>
      <br></br>
      <button className="new-game" onClick={() => dispatch(newRoundSet(true))}>
        new game
      </button>
    </>
  );
};

export default GameBoard;
