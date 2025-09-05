import { useState, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface GridRotationControllerProps {
  gridGroupRef: React.RefObject<THREE.Group | null>;
  isGameActive: boolean;
  isWaitingForPlayer: boolean;
  shouldResetOnPrepare: boolean;
  isWin: boolean;
  isLoss: boolean;
  mousePosition: { x: number; y: number };
  isMouseOverGrid: boolean;
}

const GridRotationController = ({
  gridGroupRef,
  isGameActive,
  isWaitingForPlayer,
  shouldResetOnPrepare,
  isWin,
  isLoss,
  mousePosition,
  isMouseOverGrid,
}: GridRotationControllerProps) => {
  const { camera, scene, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [previousMouse, setPreviousMouse] = useState({ x: 0, y: 0 });
  const [userInterrupted, setUserInterrupted] = useState(false);
  const [victoryStartTime, setVictoryStartTime] = useState<number | null>(null);
  const [lossStartTime, setLossStartTime] = useState<number | null>(null);
  const [victoryAnimationType, setVictoryAnimationType] = useState<number>(0);
  const raycasterRef = useRef(new THREE.Raycaster());

  // Helper function to check if mouse is actually over the 3D grid objects
  const isMouseOverGrid3D = (clientX: number, clientY: number): boolean => {
    if (!gridGroupRef.current) return false;

    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouse, camera);

    // Get all mesh objects from the grid group
    const gridMeshes: THREE.Object3D[] = [];
    gridGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        gridMeshes.push(child);
      }
    });

    const intersects = raycasterRef.current.intersectObjects(gridMeshes, true);
    return intersects.length > 0;
  };

  // Track victory and loss state changes
  useFrame((state) => {
    if (!gridGroupRef.current) return;

    // Start victory animation when win occurs
    if (isWin && victoryStartTime === null) {
      setVictoryStartTime(state.clock.elapsedTime);
      // Choose random animation type (0-3 for 4 variations)
      setVictoryAnimationType(Math.floor(Math.random() * 4));
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
        gridGroupRef.current.rotation.x +=
          Math.sin(lossDuration * 30) * intensity;
        gridGroupRef.current.rotation.y +=
          Math.cos(lossDuration * 25) * intensity;
        return;
      }
    }

    // Victory playful spin animation with variations (0.8 second 180-degree spin)
    if (isWin && victoryStartTime !== null && gridGroupRef.current) {
      const victoryDuration = state.clock.elapsedTime - victoryStartTime;
      if (victoryDuration < 0.8) {
        // Simple 180-degree spin with smooth easing - 4 variations
        const progress = victoryDuration / 0.8;
        const easing = Math.sin(progress * Math.PI); // Smooth start and stop

        switch (victoryAnimationType) {
          case 0: // Original Y-axis spin
            gridGroupRef.current.rotation.y = progress * Math.PI * easing;
            break;
          case 1: // Reverse Y-axis spin
            gridGroupRef.current.rotation.y = -progress * Math.PI * easing;
            break;
          case 2: // X-axis spin (forward flip)
            gridGroupRef.current.rotation.x = progress * Math.PI * easing;
            break;
          case 3: // Z-axis spin (barrel roll)
            gridGroupRef.current.rotation.z = progress * Math.PI * easing;
            break;
        }
        return;
      } else if (victoryDuration < 1.5) {
        // Spring-damped return to zero (0.7 seconds of spring damping)
        const dampingDuration = victoryDuration - 0.8;
        const dampingProgress = dampingDuration / 0.7;

        // Spring damping function with overshoot and settle
        const springDamping =
          Math.exp(-dampingProgress * 4) *
          Math.cos(dampingProgress * 8 * Math.PI);

        gridGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.x,
          0,
          0.15,
        );
        gridGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.y,
          0,
          0.15,
        );
        gridGroupRef.current.rotation.z = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.z,
          0,
          0.15,
        );

        // Add small spring oscillation based on animation type
        switch (victoryAnimationType) {
          case 0:
          case 1:
            gridGroupRef.current.rotation.y += springDamping * 0.1;
            break;
          case 2:
            gridGroupRef.current.rotation.x += springDamping * 0.1;
            break;
          case 3:
            gridGroupRef.current.rotation.z += springDamping * 0.1;
            break;
        }
        return;
      } else {
        // Final settle to zero
        gridGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.x,
          0,
          0.2,
        );
        gridGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.y,
          0,
          0.2,
        );
        gridGroupRef.current.rotation.z = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.z,
          0,
          0.2,
        );
      }
    }

    // Reset rotation when "prepare yourself" appears
    if (shouldResetOnPrepare && gridGroupRef.current) {
      gridGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        gridGroupRef.current.rotation.x,
        0,
        0.12,
      );
      gridGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        gridGroupRef.current.rotation.y,
        0,
        0.12,
      );
      gridGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        gridGroupRef.current.rotation.z,
        0,
        0.12,
      );
      return;
    }

    // Auto-rotate when waiting for player to begin game (unless user interrupted)
    if (
      isWaitingForPlayer &&
      !userInterrupted &&
      !shouldResetOnPrepare &&
      gridGroupRef.current
    ) {
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

    // Subtle mouse-following grid rotation when gameplay is active AND mouse is actually over 3D objects
    if (isGameActive && gridGroupRef.current) {
      // Check if mouse is over actual 3D grid objects using raycasting
      const rect = gl.domElement.getBoundingClientRect();
      const clientX = ((mousePosition.x + 1) * rect.width) / 2 + rect.left;
      const clientY = ((-mousePosition.y + 1) * rect.height) / 2 + rect.top;
      const isOver3DGrid = isMouseOverGrid3D(clientX, clientY);

      if (isOver3DGrid) {
        // More subtle rotation based on mouse position
        const targetRotationX = mousePosition.y * 0.07; // Up/down reversed (moves toward user)
        const targetRotationY = -mousePosition.x * 0.1; // Left/right reversed for natural feel

        gridGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.x,
          targetRotationX,
          0.05,
        );
        gridGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.y,
          targetRotationY,
          0.05,
        );
        gridGroupRef.current.rotation.z = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.z,
          0,
          0.08,
        );
      } else {
        // Return to neutral position when mouse is not over 3D objects
        gridGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.x,
          0,
          0.08,
        );
        gridGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.y,
          0,
          0.08,
        );
        gridGroupRef.current.rotation.z = THREE.MathUtils.lerp(
          gridGroupRef.current.rotation.z,
          0,
          0.08,
        );
      }
    }
  });

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      // Use precise 3D raycasting to check if mouse is over actual grid objects
      if (!isMouseOverGrid3D(event.clientX, event.clientY)) return;

      // Allow rotation interruption when waiting for player, or normal rotation when game stopped
      if (isGameActive) return;

      // If waiting for player, interrupt the auto-rotation only when clicking on the grid
      if (isWaitingForPlayer) {
        setUserInterrupted(true);
      }

      setIsDragging(true);
      setPreviousMouse({ x: event.clientX, y: event.clientY });
      document.body.style.cursor = "grabbing";
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
      document.body.style.cursor = "auto";
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    previousMouse,
    isGameActive,
    isWaitingForPlayer,
    gridGroupRef,
    camera,
    gl,
  ]);

  return null;
};

export default GridRotationController;
