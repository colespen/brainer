import { useEffect, useState } from "react";
import { colorMap } from "../datatypes.ts/colortypes";
import { Card } from "../datatypes.ts/cardtypes";

/**
 * all this is doing is assigning the specified number of card ids.
 *  */
function useGenerateCardData(
  gridN: number,
  paintThresh: number,
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
      let randomPaint = colorMap.none;
      let isColor = false;
      if (Math.random() < paintThresh) {
        randomPaint = colorMap.blue;
        isColor = true;
      }
      return {
        id: i,
        color: randomPaint,
        isColor,
      };
    });
    const totalColorCardsCount = newData.filter((card) => card.isColor).length;
    setCardData(newData);
    setTotalColorCards(totalColorCardsCount);
  }, [gridN, isNewRound]); // [..., blockFreq] ?

  return { state: [cardData, setCardData], totalColorCards };
}

export { useGenerateCardData };
