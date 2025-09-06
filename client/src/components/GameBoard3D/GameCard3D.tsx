import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { colorMap } from "../../datatypes/colortypes";
import { GameCardProps } from "../../datatypes/proptypes";
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

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.08 : 1.0;
      const scaleVector = new THREE.Vector3(
        targetScale,
        targetScale,
        targetScale,
      );
      groupRef.current.scale.lerp(scaleVector, 0.15);
    }
  });

  const isFlipped = flippedCards.includes(id);
  const notFound = !isClicked && isColor;
  const winColor = isWin && isColor ? colorMap.win : color;
  const cardColor = isLoss && notFound ? colorMap.notFound : winColor;
  const faceColor = isFlipped ? cardColor : colorMap.faceDown;

  const faceColorThree = new THREE.Color(faceColor);

  // enhanced inner glow effect on hover
  const emissiveColor = hovered
    ? new THREE.Color(faceColor).multiplyScalar(0.6)
    : new THREE.Color(faceColor).multiplyScalar(0.08);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // immediate visual feedback on touch start
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
        onPointerDown={handlePointerDown}
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
          borderColor: hovered ? "#9294ff" : "#585aa9",
        }}
      >
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshPhysicalMaterial
          color={faceColorThree.multiplyScalar(1.2)} // Subtly brighter base color
          emissive={emissiveColor}
          roughness={0.25} // Smoother surface for enhanced reflections
          metalness={0.12} // Slightly more metallic for realistic sheen
          envMapIntensity={0.25} // Enhanced environment reflections
          clearcoat={0.15} // Subtle clear coat for realistic surface
          clearcoatRoughness={0.1} // Smooth clear coat
          reflectivity={0.6} // Enhanced surface reflectivity
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Clean cube edges - only the 12 edges of a cube */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.901, 0.901, 0.901)]} />
        <lineBasicMaterial
          color={borderColorThree}
          transparent
          opacity={0.6}
          linewidth={1.5}
        />
      </lineSegments>
    </group>
  );
};

export default GameCard3D;
