import { useEffect, useRef, useState } from "react";
import { colorMap } from "../datatypes/colortypes";
import { Card } from "../datatypes/gameDatatypes";

/**
 * @param gridN grid size
 * @param paintMax max number of colored cards
 * @param isNewRound boolean to trigger new round
 * @returns cardData state and totalColorCards
 * @description generates card data for game and randomly assigns colors to cards
 *  */
function useGenerateCardData(
  gridN: number,
  paintMax: number,
  isNewRound: boolean,
  isNewGame: boolean
): { cardData: Card[] } {
  const [cardData, setCardData] = useState<Card[]>([]);
  const totalCardRef = useRef<number>(16); // ref better here?
  // const [totalCard, setTotalCards] = useState((gridN * gridN));

  // let totalCards = 0; // remove global?
  // let newData: Card[] = []; // no global needed

  const createInitialCardData = (totalCards: number) => {
    return Array.from({ length: totalCards }, (_, i) => {
      return {
        id: i,
        color: colorMap.none,
        isColor: false,
      };
    });
  };

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
    const maxColorCards = Math.floor(totalCards * paintMax);
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
  }, [isNewRound, isNewGame, paintMax, gridN]);

  return { cardData };
}

export { useGenerateCardData };
