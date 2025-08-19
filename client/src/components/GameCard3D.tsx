import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { colorMap } from "../datatypes/colortypes";
import { GameCardProps } from "../datatypes/proptypes";
import * as THREE from "three";

const GameCard3D = ({
  id,
  flippedCards,
  color,
  handleCardClick,
  isLoss,
  isWin,
  isNewRound,
  isRevealed,
  isColor,
}: GameCardProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setIsClicked(false);
  }, [isNewRound]);

  // Smooth hover animation for the entire group
  useFrame(() => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.08 : 1.0;
      const scaleVector = new THREE.Vector3(targetScale, targetScale, targetScale);
      groupRef.current.scale.lerp(scaleVector, 0.15);
    }
  });

  const isFlipped = flippedCards.includes(id);
  const notFound = !isClicked && isColor;
  const winColor = isWin && isColor ? colorMap.win : color;
  const cardColor = isLoss && notFound ? colorMap.notFound : winColor;
  const faceColor = isFlipped ? cardColor : colorMap.faceDown;

  // Convert hex colors to Three.js Color objects
  const faceColorThree = new THREE.Color(faceColor);
  
  // Enhanced shine effect for better visibility and depth
  const emissiveColor = hovered ? new THREE.Color(faceColor).multiplyScalar(0.15) : new THREE.Color(faceColor).multiplyScalar(0.05);

  const handleClick = () => {
    if (isRevealed || isLoss || isWin || isNewRound) return;
    handleCardClick(id);
    setIsClicked(true);
  };

  const borderColorThree = new THREE.Color(hovered ? "#9294ff" : "#585aa9");

  return (
    <group ref={groupRef}>
      {/* Main cube */}
      <mesh 
        ref={meshRef} 
        castShadow 
        receiveShadow
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        userData={{ 
          id, 
          hovered, 
          borderColor: hovered ? "#9294ff" : "#585aa9" 
        }}
      >
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial 
          color={faceColorThree}
          emissive={emissiveColor}
          roughness={0.4}
          metalness={0.0}
          envMapIntensity={0.05}
          side={THREE.FrontSide}
        />
      </mesh>
      
      {/* Clean cube edges - only the 12 edges of a cube */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.901, 0.901, 0.901)]} />
        <lineBasicMaterial 
          color={borderColorThree}
          transparent
          opacity={0.2}
          linewidth={2}
        />
      </lineSegments>
    </group>
  );
};

export default GameCard3D;