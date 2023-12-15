import "./Settings.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  gridNSet,
  roundsSet,
  hardReset,
  selectedGameState,
} from "./gameBoardSlice";

const Settings = ({ resetUserName }: { resetUserName: () => void }) => {
  const [showSettings, setShowSettings] = useState(true);
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);
  const { gridN, userName, roundAmount, isNewGame, isGameEnd } = gameBoard;

  useEffect(() => {
    if (!isNewGame) {
      setShowSettings(false);
    }
  }, [isNewGame]);

  return (
    <div className="settings-container">
      <button
        className={"settings-btn cog" + (showSettings ? " opaque" : "")}
        onClick={() => {
          setShowSettings(!showSettings);
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
