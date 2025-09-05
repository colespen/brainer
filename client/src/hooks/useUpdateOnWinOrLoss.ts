import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGenerateCardData } from "../hooks/useGenerateCardData";
import { winAdded, lossAdded } from "../components/roundDataSlice";
import { selectedGameState, winSet } from "../components/gameBoardSlice";
import { roundResultAdd } from "../actionHelpers.ts/gameBoardActions";

const useUpdateOnWinOrLoss = () => {
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);
  const { gridN, isNewGame, isNewRound } = gameBoard;

  const { cardData } = useGenerateCardData(gridN, isNewRound, isNewGame);
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
};

export default useUpdateOnWinOrLoss;
