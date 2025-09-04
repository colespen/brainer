import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

interface ResponsiveValues {
  spacing: number;
  cubeScale: number;
}

interface ResponsiveGridCalculatorProps {
  onUpdate: (values: ResponsiveValues) => void;
}

const ResponsiveGridCalculator = ({ onUpdate }: ResponsiveGridCalculatorProps) => {
  const { viewport } = useThree();
  const lastViewportWidth = useRef(viewport.width);
  
  useFrame(() => {
    // Only update when viewport width changes significantly
    if (Math.abs(viewport.width - lastViewportWidth.current) > 50) {
      lastViewportWidth.current = viewport.width;
      
      const isMobile = viewport.width < 768;
      const isTablet = viewport.width >= 768 && viewport.width < 1024;
      
      // Calculate responsive spacing and scale
      let spacing = 1.08;
      let cubeScale = 1.0;
      
      if (isMobile) {
        // Reduce spacing and cube size on mobile
        spacing = 0.85;
        cubeScale = 0.75;
      } else if (isTablet) {
        // Slightly reduce on tablets
        spacing = 0.95;
        cubeScale = 0.9;
      }
      
      onUpdate({ spacing, cubeScale });
    }
  });
  
  return null;
};

export default ResponsiveGridCalculator;