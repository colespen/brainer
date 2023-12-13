import { useDispatch, useSelector } from "react-redux";
import {
  gridNSet,
  roundsSet,
  hardReset,
  selectedGameState,
} from "./gameBoardSlice";
import { useState } from "react";

const Settings = ({ resetUserName }: { resetUserName: () => void }) => {
  const [showSettings, setShowSettings] = useState(false);
  const dispatch = useDispatch();
  const { gameBoard } = useSelector(selectedGameState);
  const { gridN, userName, roundCount, roundAmount } = gameBoard;

  const endOfGame = roundCount > roundAmount;

  return (
    <div className="settings-container">
      {
        <button
          className={"settings-btn cog" + (showSettings ? " opaque" : "")}
          onClick={() => {
            setShowSettings(!showSettings);
          }}
        >
          <img height="22px" alt="reset button" src="/settings-icon.png" />
        </button>
      }
      {showSettings && (
        <>
          <div className="slider rounds-slider">
            <label>rounds</label>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              onChange={(e) => dispatch(roundsSet(Number(e.target.value)))}
              value={roundAmount}
              disabled={!!userName && !endOfGame}
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
              disabled={!!userName && !endOfGame}
            />
          </div>
          <div
            className="game-reset"
            data-tooltip="WARNING: this will reset all data"
          >
            <button
              className="settings-btn reset"
              onClick={() => {
                dispatch(hardReset());
                resetUserName();
              }}
            >
              <img height="20px" alt="reset button" src="/reset-icon.png" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default Settings;
