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

const Settings = ({ resetUserName }: { resetUserName: () => void }) => {
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);
  const { gridN, userName, roundAmount, isNewGame, isGameEnd, showSettings } =
    gameBoard;

  console.log("showSettings:", showSettings);

  useEffect(() => {
    if (!isNewGame) {
      dispatch(showSettingsSet(false));
    }
  }, [isNewGame]);

  return (
    <div className="settings-container">
      <button
        className={"settings-btn cog" + (showSettings ? " opaque" : "")}
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

      <div className={"settings" + (!showSettings ? " opaque" : "")}>
        <div className="slider rounds-slider">
          <label>rounds</label>
          <input
            type="range"
            min={1}
            max={25}
            step={1}
            onChange={(e) => dispatch(roundsSet(Number(e.target.value)))}
            value={roundAmount}
            disabled={!!userName && !isGameEnd}
          />
        </div>
        <div className="slider grid-slider">
          <label>grid</label>
          <input
            type="range"
            min={3}
            max={8}
            step={1}
            onChange={(e) => dispatch(gridNSet(Number(e.target.value)))}
            value={gridN}
            disabled={!!userName && !isGameEnd}
          />
        </div>
        <div
          className="game-reset"
          data-tooltip="WARNING: this will reset current state"
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
