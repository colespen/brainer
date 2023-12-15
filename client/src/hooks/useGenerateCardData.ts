import { useEffect, useRef, useState } from "react";
import { colorMap } from "../datatypes/colortypes";
import { CardData } from "../datatypes/gameDatatypes";

/**
 * @param gridN grid size
 * @param isNewRound boolean to trigger new round
 * @param isNewGame boolean true when new game set
 * @returns cardData state and totalColorCards
 * @description generates card data for game and randomly assigns colors to cards
 *  */
function useGenerateCardData(
  gridN: number,
  isNewRound: boolean,
  isNewGame: boolean
): { cardData: CardData[]; revealDelay: number } {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [paintMultiplier, setPaintMultiplier] = useState<number>(0.07); // paintMax 0.11 start
  const [revealDelay, setRevealDelay] = useState<number>(685); // 650 -> 500
  const totalCardRef = useRef<number>(16); // ref better here?

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
    if (!isNewRound) return;
    if (isNewGame) {
      setPaintMultiplier(0.07);
      setRevealDelay(685);
    }
    setPaintMultiplier((prev) => Number((prev + 0.035).toFixed(2)));
    setRevealDelay((prev) => prev - 30);
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
    // totalCards = gridN * gridN;
    const totalCards = totalCardRef.current;
    if (!isNewRound) return;
    let colorCardsCount = 0;
    const newData = createInitialCardData(totalCards);

    // assign at least one colored card
    let randomIndex = Math.floor(Math.random() * totalCards);
    newData[randomIndex].color = colorMap.blue;
    newData[randomIndex].isColor = true;
    colorCardsCount++;

    // assign random color to remaining cards within range
    const maxColorCards = Math.floor(totalCards * paintMultiplier);
    // create new array of all indexes to later splice from
    const availableIndexes = Array.from({ length: totalCards }, (_, i) => i);

    // assign colors until max
    while (colorCardsCount < maxColorCards) {
      randomIndex = Math.floor(Math.random() * availableIndexes.length);
      // currentIndex is random deleted index retruned from splice
      const currentIndex = availableIndexes.splice(randomIndex, 1)[0];

      newData[currentIndex].color = colorMap.blue;
      newData[currentIndex].isColor = true;
      colorCardsCount++;
    }
    return () => {
      setCardData(newData);
      // setTotalColorCards(colorCardsCount);
    };
  }, [isNewRound, isNewGame, paintMultiplier, gridN]);

  return { cardData, revealDelay };
}

export { useGenerateCardData };
