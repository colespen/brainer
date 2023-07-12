import { DashboardTopProps } from "../datatypes/proptypes";

const DashboardTop = ({
  gameBoard,
  cardData,
  nameInputFocus,
  userNameChange,
  listenForEnter,
  setUserNameChange,
  handleNameClick,
}: DashboardTopProps) => {
  return (
    <div className="game-dashboard-top">
      {!gameBoard.userName ? (
        <div className="name-container">
          <input
            ref={nameInputFocus}
            className="title-item name-input"
            type="text"
            placeholder="your name"
            value={userNameChange}
            onKeyDown={listenForEnter}
            onChange={(e) => setUserNameChange(e.target.value.toUpperCase())}
          />
          <button className="dashboard-item name-btn" onClick={handleNameClick}>
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
