import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { Environment } from "@react-three/drei";
import { EffectComposer, Outline, SMAA } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { cardFlipped, cardFound, lossSet } from "../gameBoardSlice";
import { GameBoardProps } from "../../datatypes/proptypes";
import { useAppDispatch } from "../../hooks/redux";
import GameCard3D from "./GameCard3D";
import RenderSettings from "./RenderSettings";
import ResponsiveGridCalculator from "./ResponsiveGridCalculator";
import GridRotationController from "./GridRotationController";
import { getResponsiveValues } from "../../config/responsiveConfig";
import * as THREE from "three";

function GameBoard3D({ gridN, cardData, gameBoard, ...rest }: GameBoardProps) {
  const dispatch = useAppDispatch();
  const [hoveredCubes, setHoveredCubes] = useState<
    THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>[]
  >([]);
  const gridGroupRef = useRef<THREE.Group>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseOverGrid, setIsMouseOverGrid] = useState(false);
  const [responsiveValues, setResponsiveValues] = useState({
    spacing: 1.08,
    cubeScale: 1.0,
    gridScale: 1.0,
  });

  // Initialize responsive values on mount
  useEffect(() => {
    const checkInitialViewport = () => {
      const responsiveValues = getResponsiveValues(window.innerWidth);
      setResponsiveValues(responsiveValues);
    };

    checkInitialViewport();
  }, []);

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
  const getPosition = (
    index: number,
    spacing: number
  ): [number, number, number] => {
    const row = Math.floor(index / gridN);
    const col = index % gridN;
    // Center the grid and add responsive spacing
    const x = (col - (gridN - 1) / 2) * spacing;
    const y = ((gridN - 1) / 2 - row) * spacing;
    return [x, y, 0];
  };

  // Component to track hovered cubes for outline effect
  const OutlineTracker = () => {
    const { scene } = useThree();

    useFrame(() => {
      const newHoveredCubes: THREE.Mesh<
        THREE.BufferGeometry,
        THREE.Material | THREE.Material[]
      >[] = [];
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.hovered) {
          newHoveredCubes.push(
            child as THREE.Mesh<
              THREE.BufferGeometry,
              THREE.Material | THREE.Material[]
            >
          );
        }
      });

      if (
        newHoveredCubes.length !== hoveredCubes.length ||
        !newHoveredCubes.every((cube) => hoveredCubes.includes(cube))
      ) {
        setHoveredCubes(newHoveredCubes);
      }
    });

    return null;
  };

  return (
    <div
      style={{ width: "100%", height: "100vh", minHeight: "600px" }}
      onMouseEnter={() => setIsMouseOverGrid(true)}
      onMouseLeave={() => setIsMouseOverGrid(false)}
      onMouseMove={(event) => {
        if (isMouseOverGrid) {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          setMousePosition({ x, y });
        }
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 15],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        style={{ background: "transparent" }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true,
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 3)]}
        shadows
      >
        {/* Subtle lighting for consistent depth and color visibility */}
        <ambientLight intensity={1} color="rgba(255, 246, 238, 1)" />

        {/* Single consistent directional light from top-left */}
        <directionalLight
          position={[2, 2, 4]}
          intensity={0.5}
          color="#ffffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Very gentle fill light to prevent pure black shadows */}
        <directionalLight
          position={[-1, -1.5, 1.5]}
          intensity={0.25}
          color="#ffffff"
        />

        {/* Rotatable grid group */}
        <group ref={gridGroupRef} scale={responsiveValues.gridScale}>
          {/* Cards */}
          {cardData.map((card, index) => (
            <group
              key={card.id}
              position={getPosition(index, responsiveValues.spacing)}
              scale={responsiveValues.cubeScale}
            >
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

        {/* Clean rendering settings and responsive camera */}
        <RenderSettings gridN={gridN} />

        {/* Responsive grid calculator */}
        <ResponsiveGridCalculator onUpdate={setResponsiveValues} />

        {/* Track hovered cubes */}
        <OutlineTracker />

        {/* Grid rotation controller */}
        <GridRotationController
          gridGroupRef={gridGroupRef}
          isGameActive={
            !gameBoard.isLoss &&
            !gameBoard.isWin &&
            !gameBoard.isNewRound &&
            !gameBoard.isRevealed
          }
          isWaitingForPlayer={!gameBoard.userName}
          shouldResetOnPrepare={
            gameBoard.alert === "prepare yourself . . ." ||
            gameBoard.alert === "Here we go!"
          }
          isWin={gameBoard.isWin}
          isLoss={gameBoard.isLoss}
          mousePosition={mousePosition}
        />

        {/* Professional post-processing effects */}
        <EffectComposer multisampling={16}>
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
