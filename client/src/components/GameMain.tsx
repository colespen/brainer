import { useEffect, useState } from "react";
import { useGenerateCardData } from "../hooks/useGenerateCardData";
import { useWinMessage } from "../hooks/useWinMessage";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  newGameSet,
  userNameSet,
} from "./gameBoardSlice";
import {
  alertEndUpdate,
  alertRoundUpdate,
  roundResultAdd,
} from "../actionHelpers.ts/gameBoardActions";

import { postGameResults } from "../services/postGameResults";
import { handleNewGame } from "../handlers/handleNewGame";
import {
  getInputBackgroundSize,
  handleNameClick,
  listenForEnter,
  nameInputFocus,
} from "../handlers/eventHandlers";
import GameBoard from "./GameBoard";
import DashboardTop from "./DashboardTop";
import "./styles.css";
import "./NewGameBtn.css";

const GameMain = () => {
  const [gridN, setGridN] = useState<number>(5);
  const [userNameChange, setUserNameChange] = useState<string>("");
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);
  const {
    isNewGame,
    isNewRound,
    isLoss,
    isWin,
    roundCount,
    roundAmount,
    winCount,
    userName,
  } = gameBoard;
  const { roundData } = useSelector(selectedRoundState);
  // console.log(gameBoard, roundData);
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
    if (!userName) return;
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
  }, [userName, dispatch, isNewRound, isLoss, isWin, isNewGame]);

  // console.log("gameBoard.cardsFound:", gameBoard.cardsFound);
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
      dispatch(newGameSet(false));
    }, 1000);
    return () => clearTimeout(newGameTimeout);
  }, [dispatch, isNewGame]);

  console.log("gameBoard.totalFound:", gameBoard.totalFound);

  useEffect(() => {
    if (roundCount <= roundAmount) return;
    const totalFound = (gameBoard.totalFound + gameBoard.cardsFound) * 10;
    try {
      // TODO FIX TYPE W/ AWAIT
      void postGameResults(userName, totalFound);
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, roundAmount, roundCount]);

  const handleNewGameClick = () => {
    handleNewGame(gameBoard, dispatch, newGameReset, newGameSet);
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
        style={getInputBackgroundSize(gridN)}
      />
      <DashboardTop
        gameBoard={gameBoard}
        cardData={cardData}
        nameInputFocus={nameInputFocus}
        userNameChange={userNameChange}
        listenForEnter={(e) =>
          listenForEnter(e, userNameChange, dispatch, userNameSet)
        }
        setUserNameChange={setUserNameChange}
        handleNameClick={() =>
          handleNameClick(userNameChange, dispatch, userNameSet)
        }
      />
      <GameBoard
        cardData={cardData}
        gameBoard={gameBoard}
        gridN={Math.sqrt(cardData.length)}
        isLoss={isLoss}
        isWin={isWin}
        isNewRound={isNewRound}
      />
      <div className="game-dashboard-bottom">
        <span className="dashboard-item">
          <p>round:</p>
          <h2>
            {roundCount > roundAmount ? roundAmount : roundCount} /{" "}
            {roundAmount}
          </h2>
        </span>
        <span className="dashboard-item won">
          <p>won:</p>
          <h2>
            {winCount} / {roundAmount}
          </h2>
        </span>
        <span className="dashboard-item score">
          <p>points:</p>
          <h2>{(gameBoard.totalFound + gameBoard.cardsFound) * 10}</h2>
        </span>
        <Link to="../highscores">
          <button
            className="dashboard-item highscores"
            onClick={() => dispatch(newGameReset())}
            disabled={userName !== "" && roundCount <= roundAmount}
          >
            high scores
          </button>
        </Link>
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
