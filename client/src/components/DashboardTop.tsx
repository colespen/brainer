import { DashboardTopProps } from "../datatypes/proptypes";

const DashboardTop = ({
  gameBoard,
  cardData,
  nameInputFocus,
  userName,
  listenForEnter,
  setUserNameChange,
  handleNameClick,
}: DashboardTopProps) => {
  const handleSetUserNameChange = (e: string) => {
    if (e.length > 9) return;
    const upperCase = e.toUpperCase();
    setUserNameChange(upperCase);
  };

  const showInput = !gameBoard.userName;

  return (
    <div
      className={"game-dashboard-top" + (!showInput ? " non-interactive" : "")}
    >
      {showInput ? (
        <div className="name-container">
          <input
            ref={nameInputFocus}
            className="title-item name-input"
            type="text"
            placeholder="your name"
            value={userName}
            onKeyDown={listenForEnter}
            onChange={(e) => handleSetUserNameChange(e.target.value)}
          />
          <button
            className="btn dashboard-item name-btn"
            onClick={handleNameClick}
          >
            GO
          </button>
        </div>
      ) : (
        <h1 className="title-item game-alert">
          {gameBoard.alert ||
            (gameBoard.cardsFound > 0 &&
            gameBoard.cardsFound <
              cardData.filter((card) => card.isColor).length
              ? gameBoard.cardsFound
              : gameBoard.alert)}
        </h1>
      )}
    </div>
  );
};

export default DashboardTop;
