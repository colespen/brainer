import { useState, useEffect } from "react";
import { useGenerateCardData } from "../lib/useGenerateCardData";
import { useDispatch, useSelector } from "react-redux";
import { addGameData } from "./gameDataSlice";

import GameCard from "./GameCard";
import "./GameBoard.css";

const GameBoard = () => {
  // keeps track of id's of cards that have been flipped
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [cardsFound, setcardsFound] = useState<number>(0);
  const [totalFound, setTotalFound] = useState<number>(0);
  const [isNewRound, setIsNewRound] = useState<boolean>(true);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [isLoss, setIsLoss] = useState<boolean>(false);
  const [roundAmount, setRoundAmount] = useState<number>(5); // user setting
  const [roundCount, setRoundCount] = useState<number>(1);
  const dispatch = useDispatch();
  // access from store
  // const roundData = useSelector((state: any) => state.gameDataSlice.gameData);
  // console.log(roundData);

  // SETTINGS temp harcode
  const gridN = 8; 
  const paintMax = 0.15; // difficulty / .1
  const revealDelay = 1490; // 475

  const { state, totalColorCards } = useGenerateCardData(
    gridN,
    paintMax,
    isNewRound
  );
  const [cardData, setCardData] = state;

  // handle board reset on wins and new rounds
  // turn up cards on first render then over after delay
  useEffect(() => {
    const cardIdList = cardData.map((card) => card.id);

    if (isLoss) {
      setAlert("you got brained");
      const lossTimeout = setTimeout(() => {
        setIsLoss(false);
        setcardsFound(0);
        setAlert(null);
        setIsNewRound(true);
      }, 2000);
      return () => clearTimeout(lossTimeout);
    }

    if (isWin) {
      setAlert("Solid.");

      const winTimeout = setTimeout(() => {
        setTotalFound((prev) => prev + cardsFound);
        setcardsFound(0); // makes isWin false
        setAlert(null);
        setIsNewRound(true);
      }, 2000);
      return () => clearTimeout(winTimeout);
    }

    if (isNewRound) {
      setAlert("Next Round");

      const roundReadyTimeout = setTimeout(() => {
        setAlert("Prepare Yourself. . .");
      }, 1500);

      setFlippedCards([]);

      const newRoundTimeout = setTimeout(() => {
        setAlert(null);
        setIsNewRound(false);
        setIsRevealed(true)
        setFlippedCards(cardIdList); // turn cards face up
        if (flippedCards.length) setRoundCount((prev) => prev + 1);
      }, 3500);

      return () => {
        clearTimeout(roundReadyTimeout);
        clearTimeout(newRoundTimeout);
      };
    } else {
      setIsRevealed(true)
      setFlippedCards(cardIdList); // turn cards face up

      // handle card turnover for start of round
      const gridResetTimeout = setTimeout(() => {
        setAlert(null);
        setFlippedCards([]); // face down
        setIsRevealed(false)
      }, revealDelay);
      return () => clearTimeout(gridResetTimeout);
    }
  }, [isNewRound, isLoss, isWin]);

  // update GameData on win or loss
  useEffect(() => {
    if (cardData.length !== 0 && cardsFound === totalColorCards) {
      setIsWin(true);
      dispatch(
        addGameData({
          roundNum: roundCount,
          win: true,
          points: cardsFound,
          guesses: flippedCards.length,
        })
      );
    } else {
      setIsWin(false);
    }
    if (isLoss) {
      dispatch(
        addGameData({
          roundNum: roundCount,
          win: false,
          points: cardsFound,
          guesses: flippedCards.length,
        })
      );
    }
  }, [cardsFound, isLoss]);

  // turn clicked cards face up
  const handleCardClick = (id: number) => {
    if (!flippedCards.includes(id)) {
      setFlippedCards((prevFlippedCards) => [...prevFlippedCards, id]);
    }
    if (cardData[id].isColor) {
      console.log("card found");
      // if correct card, cardsFound++
      setcardsFound((prevCardsFound) => prevCardsFound + 1);
    } else {
      // if wrong card, isLoss = true
      setIsLoss(true);
      console.log("nope");
    }
  };
  // console.log("cardsFound", cardsFound);
  // console.log("totalColorCards", totalColorCards);

  return (
    <>
      <div className="game-dashboard-top">
        <span className="round-count">
          <p>round</p>{" "}
          <h2>
            {roundCount} / {roundAmount}
          </h2>
        </span>

        <h1 className="game-alert">
          {alert || (cardsFound < totalColorCards ? cardsFound : alert)}
        </h1>
      </div>
      <div
        className="game-board"
        style={{
          gridTemplateColumns: `repeat(${gridN}, 1fr)`,
        }}
      >
        {cardData.map((card) => (
          <GameCard
            key={card.id}
            id={card.id}
            flippedCards={flippedCards}
            color={card.color}
            handleCardClick={handleCardClick}
            isLoss={isLoss}
            isWin={isWin}
            isNewRound={isNewRound}
            isRevealed={isRevealed}
          />
        ))}
      </div>
      <div className="game-dashboard-bottom">
        <span className="score-count">
          <h3>
            {totalFound +
              (isNewRound || flippedCards.length === cardData.length
                ? 0
                : cardsFound)}
          </h3>
          <p>points</p>
        </span>
      </div>
      <br></br>
      <br></br>
      <button className="new-game" onClick={() => setIsNewRound(true)}>
        new game
      </button>
    </>
  );
};

export default GameBoard;
