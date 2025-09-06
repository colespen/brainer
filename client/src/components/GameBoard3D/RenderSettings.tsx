import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface RenderSettingsProps {
  gridN: number;
}

const RenderSettings = ({ gridN }: RenderSettingsProps) => {
  const { gl, camera, viewport } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.NoToneMapping;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  // responsive camera positioning based on viewport and grid size
  useFrame(() => {
    const isMobile = viewport.width < 768;
    const isTablet = viewport.width >= 768 && viewport.width < 1024;
    const isDesktop = viewport.width >= 1024;

    let cameraDistance;

    if (isMobile) {
      // mobile: scale distance with grid size to maintain consistent appearance
      const baseDistance = Math.max(gridN * 2, 8);
      cameraDistance = baseDistance * 1.4;
    } else if (isTablet) {
      // tablet: scale distance with grid size to maintain consistent appearance
      const baseDistance = Math.max(gridN * 2, 8);
      cameraDistance = baseDistance * 1.2;
    } else if (isDesktop) {
      // desktop: fixed distance - let larger grids naturally appear bigger
      cameraDistance = 15; // Fixed distance regardless of grid size
    }

    // smoothly adjust camera position
    const targetPosition = new THREE.Vector3(0, 0, cameraDistance);
    camera.position.lerp(targetPosition, 0.05);

    camera.updateProjectionMatrix();
  });

  return null;
};

export default RenderSettings;
