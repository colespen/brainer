import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedGameState,
  alertUpdated,
  newGameSet,
} from "../components/gameBoardSlice";

const useNewGameDelayAlert = () => {
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);
  const { isNewGame } = gameBoard;

  // new game boolean flip and alert
  useEffect(() => {
    if (!isNewGame) return;
    dispatch(alertUpdated("Cool let's go again . . ."));
    const newGameTimeout = setTimeout(() => {
      dispatch(newGameSet(false));
    }, 1000);
    return () => clearTimeout(newGameTimeout);
  }, [dispatch, isNewGame]);
};

export default useNewGameDelayAlert;
