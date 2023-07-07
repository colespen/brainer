import { useState, useEffect } from "react";
import { useGenerateCardData } from "../lib/useGenerateCardData";
import GameCard from "./GameCard";

const GameBoard = () => {
  // keeps track of id's of cards that have been flipped
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isNewRound, setNewRound] = useState<boolean>(true);
  const [cardsFound, setcardsFound] = useState<number>(0);
  const [alert, setAlert] = useState<string | null>(null);

  // SETTINGS temp harcode
  const gridN = 6;
  const paintThresh = 0.12;
  const revealDelay = 475;

  const { state, totalColorCards } = useGenerateCardData(
    gridN,
    paintThresh,
    isNewRound
  );
  const [cardData, setCardData] = state;

  const isWin = cardData.length !== 0 && cardsFound === totalColorCards;
  const isInitGuessCount =
    isNewRound || flippedCards.length === cardData.length;

  // handle board reset on wins and new rounds
  // turn up cards on first render then over after delay
  useEffect(() => {
    const cardIdList = cardData.map((card) => card.id);

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
      // setAlert("START YOUR BRAINED!");
      setAlert("Next Round. . .");
      setFlippedCards([]);
      const newRoundTimeout = setTimeout(() => {
        setAlert(null);
        setNewRound(false);
        setFlippedCards(cardIdList);
      }, 2000);
      return () => clearTimeout(newRoundTimeout);
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
  }, [isNewRound, isWin]);

  const handleCardClick = (id: number) => {
    if (!flippedCards.includes(id)) {
      setFlippedCards((prevFlippedCards) => [...prevFlippedCards, id]);
    }
    if (cardData[id].isColor) {
      setcardsFound((prevCardsFound) => prevCardsFound + 1);
    } else {
      console.log("nope");
    }
  };

  return (
    <>
      <div className="score-dashboard">
        <h1>{alert || cardsFound}</h1>
        <h3>{isInitGuessCount ? 0 : flippedCards.length}</h3>
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
          />
        ))}
      </div>
      <br></br>
      <br></br>
      <button onClick={() => setNewRound(true)}>new game</button>
    </>
  );
};

export default GameBoard;
