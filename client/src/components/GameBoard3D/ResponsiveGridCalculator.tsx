import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

interface ResponsiveValues {
  spacing: number;
  cubeScale: number;
  gridScale: number;
}

interface ResponsiveGridCalculatorProps {
  onUpdate: (values: ResponsiveValues) => void;
}

const ResponsiveGridCalculator = ({ onUpdate }: ResponsiveGridCalculatorProps) => {
  const { viewport } = useThree();
  const lastViewportWidth = useRef(viewport.width);
  
  useFrame(() => {
    const viewportChanged = Math.abs(viewport.width - lastViewportWidth.current) > 50;
    
    if (viewportChanged) {
      lastViewportWidth.current = viewport.width;
      
      const isMobile = viewport.width < 768;
      const isTablet = viewport.width >= 768 && viewport.width < 1024;
      const isDesktop = viewport.width >= 1024;
      
      // Calculate responsive spacing, scale, and grid scale
      let spacing = 1.08;
      let cubeScale = 1.0;
      let gridScale = 1.0;
      
      if (isMobile) {
        spacing = 0.85;
        cubeScale = 0.75;
        gridScale = 1.0;
      } else if (isTablet) {
        spacing = 0.95;
        cubeScale = 0.9;
        gridScale = 1.15;
      } else if (isDesktop) {
        spacing = 1.08;
        cubeScale = 1.0;
        gridScale = 1.3;
      }
      
      onUpdate({ spacing, cubeScale, gridScale });
    }
  });
  
  return null;
};

export default ResponsiveGridCalculator;