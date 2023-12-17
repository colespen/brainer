import "./styles.css";
import "./NewGameBtn.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGenerateCardData } from "../hooks/useGenerateCardData";
import { useBoardUpdate } from "../hooks/useBoardUpdate";
import { selectedRoundState } from "./roundDataSlice";
import { selectedGameState, userNameSet } from "./gameBoardSlice";

import useUpdateOnWinOrLoss from "../hooks/useUpdateOnWinOrLoss";
import useNewGameDelayAlert from "../hooks/useNewGameDelayAlert";
import usePostGameResult from "../hooks/usePostGameResult";

import {
  handleNameClick,
  listenForEnter,
  nameInputFocus,
} from "../handlers/eventHandlers";

import Settings from "./Settings";
import GameBoard from "./GameBoard";
import DashboardTop from "./DashboardTop";
import DashboardSide from "./DashboardSide";

const GameMain = () => {
  const dispatch = useDispatch();
  const [userNameState, setUserNameState] = useState<string>("");
  const { roundData } = useSelector(selectedRoundState);
  const { gameBoard } = useSelector(selectedGameState);
  const { gridN, isNewGame, isNewRound, isLoss, isWin } = gameBoard;

  // TODO: display roundData stats
  const { cardData } = useGenerateCardData(gridN, isNewRound, isNewGame);

  useBoardUpdate(gameBoard, roundData);
  useUpdateOnWinOrLoss();
  useNewGameDelayAlert();
  const { loading } = usePostGameResult();

  // temp hack - fix vh issue
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="gameboard-main">
      <Settings resetUserName={() => setUserNameState("")} />
      <DashboardTop
        gameBoard={gameBoard}
        cardData={cardData}
        nameInputFocus={nameInputFocus}
        userName={userNameState}
        listenForEnter={(e) =>
          listenForEnter(e, userNameState, dispatch, userNameSet)
        }
        setUserNameChange={setUserNameState}
        handleNameClick={() =>
          handleNameClick(userNameState, dispatch, userNameSet)
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
      <DashboardSide gameBoard={gameBoard} loadingScore={loading} />
    </div>
  );
};

export default GameMain;
