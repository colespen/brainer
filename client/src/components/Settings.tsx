import "./Settings.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  gridNSet,
  roundsSet,
  hardReset,
  showSettingsSet,
  selectedGameState,
} from "./gameBoardSlice";
import useCheckViewport from "../hooks/useCheckViewport";

const Settings = ({ resetUserName }: { resetUserName: () => void }) => {
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);
  const { gridN, userName, roundAmount, isNewGame, isGameEnd, showSettings } =
    gameBoard;

  const { isLarge, isSmall } = useCheckViewport(750, 540);

  const disabledInput = !!userName && !isGameEnd;

  useEffect(() => {
    if (!isNewGame) {
      dispatch(showSettingsSet(false));
    }
    dispatch(showSettingsSet(isLarge));
  }, [dispatch, isLarge, isNewGame]);

  return (
    <div className="settings-container">
      <button
        className={"settings-btn cog" + (showSettings ? " transparent" : "")}
        onClick={() => {
          dispatch(showSettingsSet(!showSettings));
        }}
      >
        <img
          loading="eager"
          height="22.5px"
          alt="settings button"
          src="/settings-icon.png"
        />
      </button>

      <div className={"settings" + (!showSettings ? " transparent" : "")}>
        <div className="slider rounds-slider">
          <label>rounds</label>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            onChange={(e) => dispatch(roundsSet(Number(e.target.value)))}
            value={roundAmount}
            disabled={disabledInput}
          />
        </div>
        <div className="slider grid-slider">
          <label>grid</label>
          <input
            type="range"
            min={4}
            max={isSmall ? 8 : 7} // max 7 for < 400px
            step={1}
            onChange={(e) => dispatch(gridNSet(Number(e.target.value)))}
            value={gridN}
            disabled={disabledInput}
          />
        </div>
        <div
          className="game-reset"
          data-tooltip="WARNING: this resets current state"
        >
          <button
            className="settings-btn reset"
            onClick={() => {
              dispatch(hardReset());
              resetUserName();
            }}
          >
            <img
              loading="eager"
              height="18px"
              alt="reset button"
              src="/reset-icon.png"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;
