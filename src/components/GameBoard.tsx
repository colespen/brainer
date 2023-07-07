import { useState, useEffect } from "react";
import { useGenerateCardData } from "../lib/useGenerateCardData";
import GameCard from "./GameCard";

import "./GameBoard.css";

const GameBoard = () => {
  // keeps track of id's of cards that have been flipped
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [cardsFound, setcardsFound] = useState<number>(0);
  const [isNewRound, setNewRound] = useState<boolean>(true);
  const [alert, setAlert] = useState<string | null>(null);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [isLoss, setIsLoss] = useState<boolean>(false);
  const [roundAmount, setRoundAmount] = useState<number>(5); // user setting
  const [roundCount, setRoundCount] = useState<number>(1);
  const [roundData, setRoundData] = useState<
    { roundNum: number; win: boolean; points: number; guesses: number }[]
  >([]);

  // SETTINGS temp harcode
  const gridN = 6;
  const paintMax = 0.1; // difficulty
  const revealDelay = 475;

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
      setAlert("nice try no cig");
      const lossTimeout = setTimeout(() => {
        setIsLoss(false);
        setAlert(null);
        setNewRound(true);
      }, 2000);
      return () => clearTimeout(lossTimeout);
    }

    if (isWin) {
      setAlert("Solid.");
      const winTimeout = setTimeout(() => {
        setcardsFound(0); // makes isWin false
        setAlert(null);
        setNewRound(true);
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
        setNewRound(false);
        setFlippedCards(cardIdList);
        if (flippedCards.length) setRoundCount((prev) => prev + 1);
      }, 3500);
      return () => {
        clearTimeout(roundReadyTimeout);
        clearTimeout(newRoundTimeout);
      };
    } else {
      // (FLIP CARDS AFTER newRoundTimeout DELAY) set array of all id's of cards
      setFlippedCards(cardIdList);
      // handle card turnover for start of round
      const gridResetTimeout = setTimeout(() => {
        setAlert(null);
        setFlippedCards([]); // face down
      }, revealDelay);
      return () => clearTimeout(gridResetTimeout);
    }
  }, [isNewRound, isLoss, isWin]);

  // if wrong card clicked set round win: false
  useEffect(() => {
    if (cardData.length !== 0 && cardsFound === totalColorCards) {
      setIsWin(true);
      setRoundData((prev) => [
        ...prev,
        {
          roundNum: roundData.length + 1,
          win: true,
          points: cardsFound,
          guesses: flippedCards.length,
        },
      ]);
    } else {
      setIsWin(false);
    }
    if (isLoss) {
      setRoundData((prev) => [
        ...prev,
        {
          roundNum: roundData.length + 1,
          win: false,
          points: cardsFound,
          guesses: flippedCards.length,
        },
      ]);
    }
  }, [cardsFound, isLoss]);

  const handleCardClick = (id: number) => {
    if (!flippedCards.includes(id)) {
      setFlippedCards((prevFlippedCards) => [...prevFlippedCards, id]);
    }
    if (cardData[id].isColor) {
      setcardsFound((prevCardsFound) => prevCardsFound + 1);
    } else {
      setIsLoss(true);
      console.log("nope");
    }
  };

  console.log(roundData);

  return (
    <>
      <div className="game-dashboard-top">
        <span className="round-count">
          <p>round</p>{" "}
          <h2>
            {roundCount} / {roundAmount}
          </h2>
        </span>

        <h1 className="game-alert">{alert || cardsFound}</h1>
        <h3>
          {isNewRound || flippedCards.length === cardData.length
            ? 0
            : flippedCards.length}
        </h3>
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
          />
        ))}
      </div>
      <div className="game-dashboard-bottom">
        <span className="round-count">
          <p>round</p>{" "}
          <h2>
            {roundCount} / {roundAmount}
          </h2>
        </span>
      </div>
      <br></br>
      <br></br>
      <button className="new-game" onClick={() => setNewRound(true)}>new game</button>
    </>
  );
};

export default GameBoard;
