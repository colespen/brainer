import { useEffect, useState } from "react";
import { useGenerateCardData } from "../hooks/useGenerateCardData";
import { useDispatch, useSelector } from "react-redux";
import { winAdded, lossAdded, RoundDataState } from "./roundDataSlice";
import {
  resultsUpdated,
  newRoundUpdated,
  gameStartFaceDown,
  alertUpdated,
  cardsFaceUp,
  cardsFaceDown,
  cardFlipped,
  cardFound,
  lossSet,
  winSet,
  incrementRound,
  newGameReset,
} from "./gameBoardSlice";
import { RootState } from "../store";

import GameBoard from "./GameBoard";
import "./styles.css";
import "./NewGameBtn.css";

const GameMain = () => {
  const [gridN, setGridN] = useState(4);
  const [winMessage, setWinMessage] = useState("Solid."); // TODO: abstract
  const [isNewGame, setIsNewGame] = useState(false);
  const dispatch = useDispatch();
  const { roundData, gameBoard } = useSelector((state: RootState) => {
    return {
      roundData: state.roundDataSlice.roundData,
      gameBoard: state.gameBoardSlice.gameBoard,
    };
  });
  // TODO: roundData stats and highscores

  // useEffect(() => {
  //   const wins = roundData.find((round: RoundDataState) => round.win === true);
  //   console.log("wins:", wins);
  // }, [roundData]);
  // console.log(roundData, gameBoard);

  // SETTINGS temp harcode
  const paintMax = 0.18; // difficulty / .1
  const revealDelay = 425; // 475

  const { cardState } = useGenerateCardData(
    gridN,
    paintMax,
    gameBoard.isNewRound
  );
  const [cardData, setCardData] = cardState;

  // handle board reset on win/loss and new rounds
  useEffect(() => {
    const cardIdList = cardData.map((card) => card.id);

    if (gameBoard.isLoss || gameBoard.isWin) {
      dispatch(alertUpdated(gameBoard.isLoss ? "you got brained" : winMessage));
      dispatch(cardsFaceUp({ flippedCards: cardIdList }));
      dispatch(incrementRound());
      const lossTimeout = setTimeout(() => {
        dispatch(resultsUpdated({ totalFound: gameBoard.cardsFound }));
      }, 2000);
      return () => clearTimeout(lossTimeout);
    }

    if (
      isNewGame ||
      (gameBoard.isNewRound && gameBoard.roundCount <= gameBoard.roundAmount)
    ) {
      !isNewGame &&
        dispatch(
          alertUpdated(
            !roundData.length
              ? "Here we go!"
              : gameBoard.roundCount !== gameBoard.roundAmount
              ? `Round ${gameBoard.roundCount}`
              : "Final Round"
          )
        );

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
    } else if (gameBoard.roundCount <= gameBoard.roundAmount) {
      // when each new round start reveal cards
      dispatch(cardsFaceUp({ flippedCards: cardIdList }));
      // dispatch(newRoundUpdated({ flippedCards: cardIdList }));

      // then turn down after delay
      const boardResetTimeout = setTimeout(() => {
        dispatch(gameStartFaceDown());
      }, revealDelay);
      return () => clearTimeout(boardResetTimeout);
    } else {
      dispatch(gameStartFaceDown());
      dispatch(
        alertUpdated(
          gameBoard.winCount === gameBoard.roundAmount ? "Winner!" : "Game Over"
        )
      );
    }
  }, [gameBoard.isNewRound, gameBoard.isLoss, gameBoard.isWin, isNewGame]);

  // update GameData (rounds) on win or loss

  useEffect(() => {
    const totalColorCards = cardData.filter((card) => card.isColor);
    if (
      cardData.length !== 0 &&
      gameBoard.cardsFound === totalColorCards.length
    ) {
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

  useEffect(() => {
    if (gameBoard.winCount === 1) setWinMessage("Solid.");
    if (gameBoard.winCount === 2) setWinMessage("Wow.");
    if (gameBoard.winCount === gameBoard.roundAmount - 2)
      setWinMessage("Yup :)))");
    if (gameBoard.winCount === gameBoard.roundAmount - 1)
      setWinMessage("Perfecto!");
  }, [gameBoard.winCount]);

  useEffect(() => {
    if (!isNewGame) return;
    dispatch(alertUpdated("Cool let's go again . . ."));
    const newGameTimeout = setTimeout(() => {
      setIsNewGame(false);
    }, 1000);
    return () => clearTimeout(newGameTimeout);
  }, [isNewGame]);

  // turn clicked cards face up
  const handleCardClick = (id: number) => {
    if (!gameBoard.flippedCards.includes(id)) {
      dispatch(cardFlipped(id));
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

  const getInputBackgroundSize = () => {
    return { backgroundSize: `${(gridN * 100) / 8}% 100%` };
  };

  return (
    <>
      {/* TODO: abstract a control panel (modal) */}
      <input
        type="range"
        min={3}
        max={8}
        step={1}
        onChange={(e) => setGridN(Number(e.target.value))}
        value={gridN}
        style={getInputBackgroundSize()}
      />
      <div className="game-dashboard-top">
        <h1 className="game-alert">
          {gameBoard.alert ||
            (gameBoard.cardsFound > 0 &&
            gameBoard.cardsFound <
              cardData.filter((card) => card.isColor).length
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
        <span className="round-count">
          <p>round:</p>
          <h2>
            {gameBoard.roundCount > gameBoard.roundAmount
              ? gameBoard.roundAmount
              : gameBoard.roundCount}{" "}
            / {gameBoard.roundAmount}
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
          <h3>{gameBoard.totalFound + gameBoard.cardsFound}</h3>
        </span>
        <button
          className={`new-game ` + (gameBoard.roundCount > gameBoard.roundAmount)}
          onClick={() => {
            dispatch(newGameReset());
            setIsNewGame(true);
          }}
        >
          new game
        </button>
      </div>
    </>
  );
};

export default GameMain;
