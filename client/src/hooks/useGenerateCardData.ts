import { useEffect, useRef, useState } from "react";
import { colorMap } from "../datatypes/colortypes";
import { CardData } from "../datatypes/gameDatatypes";

/**
 * @param gridN grid size
 * @param isNewRound boolean to trigger new round
 * @param isNewGame boolean true when new game set
 * @returns cardData (state) and revealDelay (duration in ms cards are shown face up)
 * @description generates card data for game and randomly assigns colors to cards
 *  */
function useGenerateCardData(
  gridN: number,
  isNewRound: boolean,
  isNewGame: boolean
): { cardData: CardData[]; revealDelay: number } {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [paintMultiplier, setPaintMultiplier] = useState<number>(0.1);
  const [revealDelay, setRevealDelay] = useState<number>(650);
  const totalCardRef = useRef<number>(16);

  const createInitialCardData = (totalCards: number) => {
    return Array.from({ length: totalCards }, (_, i) => {
      return {
        id: i,
        color: colorMap.none,
        isColor: false,
      };
    });
  };

  useEffect(() => {
    if (!isNewRound) {
      return;
    }
    if (isNewGame) {
      setPaintMultiplier(0.1);
      setRevealDelay(650);
    } else {
      setPaintMultiplier((prev) => Number((prev + 0.035).toFixed(2)));
      setRevealDelay((prev) => Math.max(prev - 30, 200)); // min revealDelay = 200ms
    }
  }, [isNewRound, isNewGame]);

  // update grid size
  useEffect(() => {
    const totalCards = gridN * gridN;
    totalCardRef.current = totalCards;
    const newData = createInitialCardData(totalCards);
    setCardData(newData);
  }, [gridN]);

  // assign random colours
  useEffect(() => {
    const totalCards = totalCardRef.current;

    if (!isNewRound) {
      return;
    }
    let colorCardsCount = 0;
    const newData = createInitialCardData(totalCards);

    // assign at least one colored card
    let randomIndex = Math.floor(Math.random() * totalCards);
    newData[randomIndex].color = colorMap.blue;
    newData[randomIndex].isColor = true;
    colorCardsCount++;

    // create new array of all indexes to later splice from, exluding first index
    const availableIndexes = Array.from(
      { length: totalCards },
      (_, i) => i
    ).filter((index) => index !== randomIndex);
    // const availableIndexes = Array.from({ length: totalCards }, (_, i) => i); // ***

    const maxColorCards = Math.min(
      Math.floor(totalCards * paintMultiplier),
      Math.floor(totalCards * 0.5) // restrict no more than 50% of total cards
    );

    // assign colors until max
    while (colorCardsCount < maxColorCards) {
      randomIndex = Math.floor(Math.random() * availableIndexes.length);
      // currentIndex is random deleted index returned from splice
      const currentIndex = availableIndexes.splice(randomIndex, 1)[0];

      newData[currentIndex].color = colorMap.blue;
      newData[currentIndex].isColor = true;
      colorCardsCount++;
    }

    setCardData(newData);
  }, [isNewRound, paintMultiplier, gridN]);

  return { cardData, revealDelay };
}

export { useGenerateCardData };
