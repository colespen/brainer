import { useDispatch, useSelector } from "react-redux";
import { gridNSet, selectedGameState } from "./gameBoardSlice";
import { getInputBackgroundSize } from "../handlers/eventHandlers";

const Settings = () => {
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);
  const { gridN, isNewRound, userName, isRevealed } = gameBoard;
  return (
    <div className="grid-slider">
      <label>grid</label>
      <input
        type="range"
        min={3}
        max={8}
        step={1}
        onChange={(e) => dispatch(gridNSet(Number(e.target.value)))}
        value={gridN}
        style={getInputBackgroundSize(gridN)}
        disabled={(userName !== "" && isNewRound) || isRevealed}
      />
    </div>
  );
};
export default Settings;
