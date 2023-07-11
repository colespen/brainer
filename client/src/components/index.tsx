import { useEffect, useState } from "react";
import { useGenerateCardData } from "../hooks/useGenerateCardData";
import { useWinMessage } from "../hooks/useWinMessage";
import { useDispatch, useSelector } from "react-redux";
import { winAdded, lossAdded, selectedRoundState } from "./roundDataSlice";
import {
  selectedGameState,
  resultsUpdated,
  incrementRound,
  newRoundUpdated,
  gameStartFaceDown,
  alertUpdated,
  cardsFaceUp,
  cardsFaceDown,
  winSet,
  newGameReset,
} from "./gameBoardSlice";
import {
  alertEndUpdate,
  alertRoundUpdate,
  roundResultAdd,
} from "../actionHelpers.ts/gameBoardActions";

import GameBoard from "./GameBoard";
import "./styles.css";
import "./NewGameBtn.css";

const GameMain = () => {
  const [gridN, setGridN] = useState(5);
  const [isNewGame, setIsNewGame] = useState(false);
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);
  const { isNewRound, isLoss, isWin, roundCount, roundAmount, winCount } =
    gameBoard;
  const { roundData } = useSelector(selectedRoundState);
  console.log(gameBoard, roundData);
  // TODO: roundData stats and highscores
  // SETTINGS temp harcode

  const { cardData, revealDelay } = useGenerateCardData(
    gridN,
    isNewRound,
    isNewGame
  );
  const { winMessage } = useWinMessage(winCount, roundAmount);

  // handle board reset on win/loss and new rounds
  useEffect(() => {
    const cardIdList: number[] = cardData.map((card) => card.id);

    if (isLoss || isWin) {
      dispatch(alertUpdated(isLoss ? "you got brained" : winMessage));
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
    } else if (gameBoard.roundCount <= roundAmount) {
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
      // if wincount === roundAmount, add totalFound * 10 to highscore board in db.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isNewRound, isLoss, isWin, isNewGame]);

  // update `GameData` (rounds) on win or loss
  useEffect(() => {
    const totalColorCards = cardData.filter((card) => card.isColor);
    if (
      cardData.length !== 0 &&
      gameBoard.cardsFound === totalColorCards.length // .length
    ) {
      dispatch(winSet(true)); //    ***WIN
      dispatch(winAdded(roundResultAdd(gameBoard)));
    }
    if (gameBoard.isLoss) {
      dispatch(lossAdded(roundResultAdd(gameBoard)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, gameBoard.cardsFound, gameBoard.isLoss]);

  useEffect(() => {
    if (!isNewGame) return;
    dispatch(alertUpdated("Cool let's go again . . ."));
    const newGameTimeout = setTimeout(() => {
      setIsNewGame(false);
    }, 1000);
    return () => clearTimeout(newGameTimeout);
  }, [dispatch, isNewGame]);

  const getInputBackgroundSize = () => {
    return { backgroundSize: `${(gridN * 100) / 8}% 100%` };
  };

  const handleNewGameClick = () => {
    if (gameBoard.isRevealed || isLoss || isWin) return;
    dispatch(newGameReset());
    setIsNewGame(true);
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
        gameBoard={gameBoard}
        gridN={Math.sqrt(cardData.length)}
        isLoss={isLoss}
        isWin={isWin}
        isNewRound={isNewRound}
      />
      <div className="game-dashboard-bottom">
        <span className="round-count">
          <p>round:</p>
          <h2>
            {roundCount > roundAmount ? roundAmount : roundCount} /{" "}
            {roundAmount}
          </h2>
        </span>
        <span className="round-count won">
          <p>won:</p>
          <h2>
            {winCount} / {roundAmount}
          </h2>
        </span>
        <span className="round-count score">
          <p>points:</p>
          <h2>{(gameBoard.totalFound + gameBoard.cardsFound) * 10}</h2>
        </span>
        <button
          className={"new-game " + (roundCount > roundAmount ? "true" : "")}
          onClick={handleNewGameClick}
        >
          new game
        </button>
      </div>
    </>
  );
};

export default GameMain;
