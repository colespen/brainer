import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGenerateCardData } from "../hooks/useGenerateCardData";
import { useBoardUpdate } from "../hooks/useBoardUpdate";
import { winAdded, lossAdded, selectedRoundState } from "./roundDataSlice";
import {
  selectedGameState,
  alertUpdated,
  winSet,
  newGameSet,
  userNameSet,
} from "./gameBoardSlice";
import { roundResultAdd } from "../actionHelpers.ts/gameBoardActions";
import { postGameResults } from "../services/postGameResults";
import {
  handleNameClick,
  listenForEnter,
  nameInputFocus,
} from "../handlers/eventHandlers";

import Settings from "./Settings";
import GameBoard from "./GameBoard";
import DashboardTop from "./DashboardTop";
import DashboardBottom from "./DashboardBottom";

import "./styles.css";
import "./NewGameBtn.css";

const GameMain = () => {
  // const [gridN, setGridN] = useState<number>(5);
  const [userNameChange, setUserNameChange] = useState<string>("");
  const dispatch = useDispatch();
  const { roundData } = useSelector(selectedRoundState);
  const { gameBoard } = useSelector(selectedGameState);
  const {
    gridN,
    isNewGame,
    isNewRound,
    isLoss,
    isWin,
    roundCount,
    roundAmount,
    userName,
  } = gameBoard;
  // console.log(gameBoard, roundData);
  // TODO: roundData stats and highscores
  // SETTINGS temp harcode
  const { cardData } = useGenerateCardData(gridN, isNewRound, isNewGame);

  useBoardUpdate(gameBoard, roundData);

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

  // new game boolean flip and alert
  useEffect(() => {
    if (!isNewGame) return;
    dispatch(alertUpdated("Cool let's go again . . ."));
    const newGameTimeout = setTimeout(() => {
      dispatch(newGameSet(false));
    }, 1000);
    return () => clearTimeout(newGameTimeout);
  }, [dispatch, isNewGame]);

  // post game results
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

  return (
    <div className="gameboard-main">
      <Settings />
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
      <DashboardBottom gameBoard={gameBoard} />
    </div>
  );
};

export default GameMain;
