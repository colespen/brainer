import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  ResponsiveValues,
  getResponsiveValues,
} from "../../config/responsiveConfig";

interface ResponsiveGridCalculatorProps {
  onUpdate: (values: ResponsiveValues) => void;
}

const ResponsiveGridCalculator = ({
  onUpdate,
}: ResponsiveGridCalculatorProps) => {
  const { viewport } = useThree();
  const lastViewportWidth = useRef(viewport.width);

  useFrame(() => {
    const viewportChanged =
      Math.abs(viewport.width - lastViewportWidth.current) > 50;

    if (viewportChanged) {
      lastViewportWidth.current = viewport.width;

      const responsiveValues = getResponsiveValues(viewport.width);
      onUpdate(responsiveValues);
    }
  });

  return null;
};

export default ResponsiveGridCalculator;
