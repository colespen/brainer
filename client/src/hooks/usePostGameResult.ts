import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { postGameResults } from "../services/postGameResults";
import { selectedGameState } from "../store/slices/gameBoardSlice";

const usePostGameResult = () => {
  const { gameBoard } = useSelector(selectedGameState);
  const {
    roundCount,
    roundAmount,
    userName,
    totalFound,
    cardsFound,
    isGameEnd,
  } = gameBoard;
  const [loading, setLoading] = useState(false);

  // post game results
  useEffect(() => {
    if (roundCount <= roundAmount || isGameEnd) {
      return;
    }
    setLoading(true);
    const totalFoundCalculated = (totalFound + cardsFound) * 10;
    postGameResults(userName, totalFoundCalculated)
      .then(() => sessionStorage.setItem("highscoreAdded", "true"))
      .catch((error: Error) => {
        console.error("could not post game results:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundAmount, roundCount]);

  return { loading };
};

export default usePostGameResult;
