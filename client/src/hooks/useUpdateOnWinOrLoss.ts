import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGenerateCardData } from "../hooks/useGenerateCardData";
import { winAdded, lossAdded } from "../store/slices/roundDataSlice";
import { selectedGameState, winSet } from "../store/slices/gameBoardSlice";
import { roundResultAdd } from "../actionHelpers.ts/gameBoardActions";

const useUpdateOnWinOrLoss = () => {
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);
  const { gridN, isNewGame, isNewRound } = gameBoard;

  const { cardData } = useGenerateCardData(gridN, isNewRound, isNewGame);
  useEffect(() => {
    const totalColorCards = cardData.filter((card) => card.isColor);
    if (
      cardData.length !== 0 &&
      gameBoard.cardsFound === totalColorCards.length
    ) {
      dispatch(winSet(true));
      dispatch(winAdded(roundResultAdd(gameBoard)));
    }
    if (gameBoard.isLoss) {
      dispatch(lossAdded(roundResultAdd(gameBoard)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, gameBoard.cardsFound, gameBoard.isLoss]);
};

export default useUpdateOnWinOrLoss;
