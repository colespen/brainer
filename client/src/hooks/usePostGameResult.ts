import { useEffect } from "react";
import { useSelector } from "react-redux";
import { postGameResults } from "../services/postGameResults";
import { selectedGameState } from "../components/gameBoardSlice";

const usePostGameResult = () => {
  const { gameBoard } = useSelector(selectedGameState);
  const { roundCount, roundAmount, userName, totalFound, cardsFound } =
    gameBoard;

  // post game results
  useEffect(() => {
    if (roundCount <= roundAmount) return;
    const totalFoundCalculated = (totalFound + cardsFound) * 10;
    try {
      // TODO FIX TYPE W/ AWAIT
      void postGameResults(userName, totalFoundCalculated);
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, roundAmount, roundCount]);
};

export default usePostGameResult;