import { useEffect, useState } from "react";
import { colorMap } from "../datatypes.ts/colortypes";
import { Card } from "../datatypes.ts/gameDatatypes";

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
  isNewRound: boolean
): {
  state: [Card[], React.Dispatch<React.SetStateAction<Card[]>>];
  totalColorCards: number;
} {
  const [cardData, setCardData] = useState<Card[]>([]);
  const [totalColorCards, setTotalColorCards] = useState(0);

  useEffect(() => {
    // if not new round return
    // or if cardData return to avoid dupes
    if (!isNewRound) return;
    const totalCards = gridN * gridN;

    // Generate card ids (instead of c-style loop use from())
    const newData: Card[] = Array.from({ length: totalCards }, (_, i) => {
      return {
        id: i,
        color: colorMap.none,
        isColor: false,
      };
    });
    let colorCardsCount = 0;

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
      let randomIndex = Math.floor(Math.random() * availableIndexes.length);
      // currentIndex is random deleted index retruned from splice
      const currentIndex = availableIndexes.splice(randomIndex, 1)[0];

      newData[currentIndex].color = colorMap.blue;
      newData[currentIndex].isColor = true;
      colorCardsCount++;
    }

    setCardData(newData);
    setTotalColorCards(colorCardsCount);
  }, [gridN, isNewRound]); // [..., blockFreq] ?

  // console.log("cardData", cardData);

  return { state: [cardData, setCardData], totalColorCards };
}

export { useGenerateCardData };
