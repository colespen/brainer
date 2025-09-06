import "./styles.css";
import "./NewGameBtn.css";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useGenerateCardData } from "../hooks/useGenerateCardData";
import { useBoardUpdate } from "../hooks/useBoardUpdate";
import { selectedRoundState } from "../store/slices/roundDataSlice";
import { selectedGameState, userNameSet } from "../store/slices/gameBoardSlice";

import useUpdateOnWinOrLoss from "../hooks/useUpdateOnWinOrLoss";
import useNewGameDelayAlert from "../hooks/useNewGameDelayAlert";
import usePostGameResult from "../hooks/usePostGameResult";

import {
  handleNameClick,
  listenForEnter,
  nameInputFocus,
} from "../handlers/eventHandlers";

import Settings from "./Settings";
import GameBoard3D from "./GameBoard3D/GameBoard3D";
import DashboardTop from "./DashboardTop";
import DashboardSide from "./DashboardSide";

const GameMain = () => {
  const dispatch = useAppDispatch();
  const [userNameState, setUserNameState] = useState<string>("");
  const { roundData } = useAppSelector(selectedRoundState);
  const { gameBoard } = useAppSelector(selectedGameState);
  const { gridN, isNewGame, isNewRound, isLoss, isWin } = gameBoard;

  const { cardData } = useGenerateCardData(gridN, isNewRound, isNewGame);

  useBoardUpdate(gameBoard, roundData);
  useUpdateOnWinOrLoss();
  useNewGameDelayAlert();
  const { loading } = usePostGameResult();

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
      <GameBoard3D
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
