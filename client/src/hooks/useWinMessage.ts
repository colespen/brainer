import { useEffect, useState } from "react";

function useWinMessage(winCount: number, roundAmount: number) {
  const [winMessage, setWinMessage] = useState<string>("No Brainer");
  useEffect(() => {
    if (winCount === 0) setWinMessage("No Brainer");
    else if (winCount === 1) setWinMessage("Wow.");
    else if (winCount === roundAmount - 2) setWinMessage("Yup :)))");
    else if (winCount === roundAmount - 1) setWinMessage("Perfecto!");
    else if (winCount % 2 === 0) {
      setWinMessage("Solid.");
    } else {
      setWinMessage("Correct");
    }
  }, [roundAmount, winCount]);

  return { winMessage };
}

export { useWinMessage };
