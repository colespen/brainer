import { useEffect } from "react";
import { useSelector } from "react-redux";
import { postGameResults } from "../services/postGameResults";
import { selectedGameState } from "../components/gameBoardSlice";

const usePostGameResult = () => {
  const { gameBoard } = useSelector(selectedGameState);
  const { roundCount, roundAmount, userName, totalFound, cardsFound, isGameEnd } =
    gameBoard;

  // post game results
  useEffect(() => {
    if (roundCount <= roundAmount || isGameEnd) {
      return;
    }
    const totalFoundCalculated = (totalFound + cardsFound) * 10;
    postGameResults(userName, totalFoundCalculated).catch((error: Error) => {
      console.error("could not post game results:", error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundAmount, roundCount]);
};

export default usePostGameResult;
