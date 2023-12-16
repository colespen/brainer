import { useEffect, useState } from "react";

const useCheckViewport = (
  widthThresholdLarge = 900,
  widthThresholdSmall = 400
) => {
  const [isLarge, setIsLarge] = useState<boolean>(false);
  const [isSmall, setIsSmall] = useState<boolean>(false);

  useEffect(() => {
    const checkViewportWidth = () => {
      const viewportWidth = window.innerWidth;
      setIsLarge(viewportWidth > widthThresholdLarge);
      setIsSmall(viewportWidth > widthThresholdSmall);
    };

    checkViewportWidth();

    window.addEventListener("resize", checkViewportWidth);

    return () => {
      window.removeEventListener("resize", checkViewportWidth);
    };
  }, [widthThresholdLarge, widthThresholdSmall]);

  return { isLarge, isSmall };
};

export default useCheckViewport;
