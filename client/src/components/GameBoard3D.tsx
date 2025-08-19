import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { Environment } from "@react-three/drei";
import { EffectComposer, Outline, SMAA } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { cardFlipped, cardFound, lossSet } from "./gameBoardSlice";
import { GameBoardProps } from "../datatypes/proptypes";
import { useAppDispatch } from "../hooks/redux";
import GameCard3D from "./GameCard3D";
import * as THREE from "three";

// Component to handle subtle mouse-following camera movement
function CameraController() {
  const { camera } = useThree();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    // Very subtle camera movement based on mouse position
    const targetX = mousePosition.x * 0.3;
    const targetY = mousePosition.y * 0.2;
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Component to set up clean rendering settings
function RenderSettings() {
  const { gl } = useThree();
  
  useEffect(() => {
    gl.toneMapping = THREE.NoToneMapping;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  return null;
}

function GameBoard3D({ gridN, cardData, gameBoard, ...rest }: GameBoardProps) {
  const dispatch = useAppDispatch();
  const [hoveredCubes, setHoveredCubes] = useState<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>[]>([]);

  // Turn clicked cards face up
  const handleCardClick = (id: number) => {
    if (!gameBoard.flippedCards.includes(id)) {
      dispatch(cardFlipped(id));
      if (cardData[id].isColor) {
        // If correct card, cardsFound++
        dispatch(cardFound());
      } else {
        // If wrong card, isLoss
        dispatch(lossSet(true));
      }
    }
  };

  // Calculate positions for grid layout
  const getPosition = (index: number): [number, number, number] => {
    const row = Math.floor(index / gridN);
    const col = index % gridN;
    // Center the grid and add spacing
    const x = (col - (gridN - 1) / 2) * 1.1;
    const y = ((gridN - 1) / 2 - row) * 1.1;
    return [x, y, 0];
  };

  // Component to track hovered cubes for outline effect
  const OutlineTracker = () => {
    const { scene } = useThree();
    
    useFrame(() => {
      const newHoveredCubes: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>[] = [];
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.hovered) {
          newHoveredCubes.push(child as THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>);
        }
      });
      
      if (newHoveredCubes.length !== hoveredCubes.length || 
          !newHoveredCubes.every(cube => hoveredCubes.includes(cube))) {
        setHoveredCubes(newHoveredCubes);
      }
    });
    
    return null;
  };

  return (
    <div style={{ width: "100%", height: "60vh", minHeight: "400px" }}>
      <Canvas
        camera={{ 
          position: [0, 0, Math.max(gridN * 1.5, 7)], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: "transparent" }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        shadows
      >
        {/* Subtle lighting for consistent depth and color visibility */}
        <ambientLight intensity={0.6} color="#ffffff" />
        
        {/* Single consistent directional light from top-left */}
        <directionalLight 
          position={[2, 2, 4]} 
          intensity={0.3} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* Very gentle fill light to prevent pure black shadows */}
        <directionalLight 
          position={[-1, -1.5, 1.5]} 
          intensity={0.2} 
          color="#ffffff"
        />

        {/* Cards */}
        {cardData.map((card, index) => (
          <group key={card.id} position={getPosition(index)}>
            <GameCard3D
              id={card.id}
              color={card.color}
              isColor={card.isColor}
              isRevealed={gameBoard.isRevealed}
              flippedCards={gameBoard.flippedCards}
              handleCardClick={handleCardClick}
              {...rest}
            />
          </group>
        ))}

        {/* Minimal environment for clean appearance */}
        <Environment preset="city" environmentIntensity={0.05} />
        
        {/* Clean rendering settings */}
        <RenderSettings />
        
        {/* Track hovered cubes */}
        <OutlineTracker />
        
        {/* Subtle mouse-following camera movement */}
        <CameraController />
        
        {/* Professional post-processing effects */}
        <EffectComposer multisampling={8}>
          <SMAA />
          <Outline 
            selection={[]} // We'll implement a different approach for all cubes
            selectionLayer={10}
            blendFunction={BlendFunction.SCREEN}
            edgeStrength={2.5}
            pulseSpeed={0.0}
            visibleEdgeColor={0x585aa9}
            hiddenEdgeColor={0x404040}
            height={512}
            blur={false}
            xRay={false}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default GameBoard3D;