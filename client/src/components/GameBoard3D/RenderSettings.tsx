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

  // Responsive camera positioning based on viewport and grid size
  useFrame(() => {
    const isMobile = viewport.width < 768;
    const isTablet = viewport.width >= 768 && viewport.width < 1024;
    
    // Calculate responsive camera distance based on grid size and viewport
    const baseDistance = Math.max(gridN * 2, 8);
    let cameraDistance = baseDistance;
    
    if (isMobile) {
      // Increase distance on mobile for better fit
      cameraDistance = baseDistance * 1.4;
    } else if (isTablet) {
      // Slightly increase distance on tablets
      cameraDistance = baseDistance * 1.2;
    }
    
    // Smoothly adjust camera position
    const targetPosition = new THREE.Vector3(0, 0, cameraDistance);
    camera.position.lerp(targetPosition, 0.05);
    
    // Update camera's projection matrix
    camera.updateProjectionMatrix();
  });

  return null;
};

export default RenderSettings;