import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
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

// Component to handle grid rotation via mouse drag and auto-rotation
function GridRotationController({ 
  gridGroupRef, 
  isGameActive,
  isWaitingForPlayer,
  shouldResetOnPrepare,
  isWin,
  isLoss 
}: { 
  gridGroupRef: React.RefObject<THREE.Group>, 
  isGameActive: boolean,
  isWaitingForPlayer: boolean,
  shouldResetOnPrepare: boolean,
  isWin: boolean,
  isLoss: boolean 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previousMouse, setPreviousMouse] = useState({ x: 0, y: 0 });
  const [userInterrupted, setUserInterrupted] = useState(false);
  const [victoryStartTime, setVictoryStartTime] = useState<number | null>(null);
  const [lossStartTime, setLossStartTime] = useState<number | null>(null);

  // Track victory and loss state changes
  useFrame((state, delta) => {
    if (!gridGroupRef.current) return;
    
    // Start victory animation when win occurs
    if (isWin && victoryStartTime === null) {
      setVictoryStartTime(state.clock.elapsedTime);
    }
    
    // Start loss animation when loss occurs
    if (isLoss && lossStartTime === null) {
      setLossStartTime(state.clock.elapsedTime);
    }
    
    // Reset victory timer when no longer winning
    if (!isWin && victoryStartTime !== null) {
      setVictoryStartTime(null);
    }
    
    // Reset loss timer when no longer losing
    if (!isLoss && lossStartTime !== null) {
      setLossStartTime(null);
    }
    
    // Loss shake animation (0.5 second duration)
    if (isLoss && lossStartTime !== null && gridGroupRef.current) {
      const lossDuration = state.clock.elapsedTime - lossStartTime;
      if (lossDuration < 0.5) {
        // Simple quick shake
        const intensity = (1 - lossDuration / 0.5) * 0.05; // Small, decreasing shake
        gridGroupRef.current.rotation.x += Math.sin(lossDuration * 30) * intensity;
        gridGroupRef.current.rotation.y += Math.cos(lossDuration * 25) * intensity;
        return;
      }
    }
    
    // Victory playful spin animation (0.8 second 180-degree spin)
    if (isWin && victoryStartTime !== null && gridGroupRef.current) {
      const victoryDuration = state.clock.elapsedTime - victoryStartTime;
      if (victoryDuration < 0.8) {
        // Simple 180-degree spin with smooth easing
        const progress = victoryDuration / 0.8;
        const easing = Math.sin(progress * Math.PI); // Smooth start and stop
        
        gridGroupRef.current.rotation.y = progress * Math.PI * easing; // 180-degree spin
        return;
      } else {
        // Ensure clean return to zero rotation
        gridGroupRef.current.rotation.x = 0;
        gridGroupRef.current.rotation.y = 0;
        gridGroupRef.current.rotation.z = 0;
      }
    }
    
    // Reset rotation when "prepare yourself" appears
    if (shouldResetOnPrepare && gridGroupRef.current) {
      gridGroupRef.current.rotation.x = THREE.MathUtils.lerp(gridGroupRef.current.rotation.x, 0, 0.12);
      gridGroupRef.current.rotation.y = THREE.MathUtils.lerp(gridGroupRef.current.rotation.y, 0, 0.12);
      gridGroupRef.current.rotation.z = THREE.MathUtils.lerp(gridGroupRef.current.rotation.z, 0, 0.12);
      return;
    }
    
    // Auto-rotate when waiting for player to begin game (unless user interrupted)
    if (isWaitingForPlayer && !userInterrupted && !shouldResetOnPrepare && gridGroupRef.current) {
      const time = state.clock.elapsedTime;
      // Create interesting 3D orbital rotation that showcases depth
      gridGroupRef.current.rotation.x = Math.sin(time * 0.3) * 0.4; // Gentle tilt forward/back
      gridGroupRef.current.rotation.y = time * 0.2; // Main rotation around Y axis
      gridGroupRef.current.rotation.z = Math.sin(time * 0.5) * 0.2; // Subtle roll
      return;
    }
    
    // Reset user interruption when no longer waiting
    if (!isWaitingForPlayer && userInterrupted) {
      setUserInterrupted(false);
    }
    
    // Reset rotation when gameplay is active
    if (isGameActive && gridGroupRef.current) {
      gridGroupRef.current.rotation.x = THREE.MathUtils.lerp(gridGroupRef.current.rotation.x, 0, 0.08);
      gridGroupRef.current.rotation.y = THREE.MathUtils.lerp(gridGroupRef.current.rotation.y, 0, 0.08);
      gridGroupRef.current.rotation.z = THREE.MathUtils.lerp(gridGroupRef.current.rotation.z, 0, 0.08);
    }
  });

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      // Allow rotation interruption when waiting for player, or normal rotation when game stopped
      if (isGameActive) return;
      
      // If waiting for player, interrupt the auto-rotation
      if (isWaitingForPlayer) {
        setUserInterrupted(true);
      }
      
      setIsDragging(true);
      setPreviousMouse({ x: event.clientX, y: event.clientY });
      document.body.style.cursor = 'grabbing';
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !gridGroupRef.current || isGameActive) return;
      
      const deltaX = event.clientX - previousMouse.x;
      const deltaY = event.clientY - previousMouse.y;
      
      const rotationSpeed = 0.005; // Reduced speed for better control
      
      // Fix rotation direction - drag up should rotate up
      gridGroupRef.current.rotation.y += deltaX * rotationSpeed;
      gridGroupRef.current.rotation.x += deltaY * rotationSpeed;
      
      setPreviousMouse({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'auto';
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, previousMouse, isGameActive, isWaitingForPlayer]);

  return null;
}

function GameBoard3D({ gridN, cardData, gameBoard, ...rest }: GameBoardProps) {
  const dispatch = useAppDispatch();
  const [hoveredCubes, setHoveredCubes] = useState<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>[]>([]);
  const gridGroupRef = useRef<THREE.Group>(null);

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
    <div style={{ width: "100%", height: "100vh", minHeight: "600px" }}>
      <Canvas
        camera={{ 
          position: [0, 0, Math.max(gridN * 2, 8)], 
          fov: 50,
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

        {/* Rotatable grid group */}
        <group ref={gridGroupRef}>
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
        </group>

        {/* Minimal environment for clean appearance */}
        <Environment preset="city" environmentIntensity={0.05} />
        
        {/* Clean rendering settings */}
        <RenderSettings />
        
        {/* Track hovered cubes */}
        <OutlineTracker />
        
        {/* Grid rotation controller */}
        <GridRotationController 
          key="grid-rotation-controller" // Stable key to prevent remounting when gridN changes
          gridGroupRef={gridGroupRef} 
          isGameActive={!gameBoard.isLoss && !gameBoard.isWin && !gameBoard.isNewRound && !gameBoard.isRevealed}
          isWaitingForPlayer={!gameBoard.userName} // Only animate when no username is set (before first game)
          shouldResetOnPrepare={gameBoard.alert === "prepare yourself . . ." || gameBoard.alert === "Here we go!"}
          isWin={gameBoard.isWin}
          isLoss={gameBoard.isLoss}
        />
        
        {/* Subtle mouse-following camera movement */}
        <CameraController />
        
        {/* Professional post-processing effects */}
        <EffectComposer multisampling={8}>
          <SMAA />
          <Outline 
            selection={[]} // We'll implement a different approach for all cubes
            selectionLayer={10}
            blendFunction={BlendFunction.SCREEN}
            edgeStrength={4.0}
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