import { useEffect, useState } from "react";
import { useGenerateCardData } from "../hooks/useGenerateCardData";
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
  const [gridN, setGridN] = useState(4);
  const [winMessage, setWinMessage] = useState("Solid."); // TODO: abstract
  const [isNewGame, setIsNewGame] = useState(false);
  const dispatch = useDispatch();

  const { gameBoard } = useSelector(selectedGameState);
  const { isNewRound, isLoss, isWin, roundCount, roundAmount, winCount } =
    gameBoard;
  const { roundData } = useSelector(selectedRoundState);
  // console.log(gameBoard, roundData);
  // TODO: roundData stats and highscores
  // SETTINGS temp harcode
  const paintMax = 0.28; // difficulty / .1
  const revealDelay = 675; // 475

  const { cardState } = useGenerateCardData(
    gridN,
    paintMax,
    isNewRound,
    isNewGame
  );
  const [cardData, setCardData] = cardState;

  // handle board reset on win/loss and new rounds
  useEffect(() => {
    const cardIdList = cardData.map((card) => card.id);

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
        dispatch(newRoundUpdated({ flippedCards: cardIdList }));
      }, 3250);

      return () => {
        clearTimeout(roundReadyTimeout);
        clearTimeout(newRoundTimeout);
      };
    } else if (gameBoard.roundCount <= roundAmount) {
      // when each new round start reveal cards
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
  }, [isNewRound, isLoss, isWin, isNewGame]);

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
  }, [gameBoard.cardsFound, gameBoard.isLoss]);

  useEffect(() => {
    if (winCount === 1) setWinMessage("Solid.");
    if (winCount === 2) setWinMessage("Wow.");
    if (winCount === roundAmount - 2) setWinMessage("Yup :)))");
    if (winCount === roundAmount - 1) setWinMessage("Perfecto!");
  }, [winCount]);

  useEffect(() => {
    if (!isNewGame) return;
    dispatch(alertUpdated("Cool let's go again . . ."));
    const newGameTimeout = setTimeout(() => {
      setIsNewGame(false);
    }, 1000);
    return () => clearTimeout(newGameTimeout);
  }, [isNewGame]);

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
          <h3>{gameBoard.totalFound + gameBoard.cardsFound}</h3>
        </span>
        <button
          className={`new-game ` + (roundCount > roundAmount)}
          onClick={handleNewGameClick}
        >
          new game
        </button>
      </div>
    </>
  );
};

export default GameMain;
