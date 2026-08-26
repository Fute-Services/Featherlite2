import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface SphereDomeProps {
  imageUrl: string;
}

function SphereDome({ imageUrl }: SphereDomeProps) {
  const texture = useTexture(imageUrl);

  return (
    <mesh scale={[-1, 1, 1]}>
      {/* Invert the sphere along X-axis so the image renders on the inside */}
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

interface PanoramaViewerProps {
  imageUrl: string;
  autoRotateSpeed?: number; // Optional prop to adjust rotation speed
}

export default function PanoramaViewer({ imageUrl, autoRotateSpeed = 0.5 }: PanoramaViewerProps) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <Suspense fallback={null}>
          <SphereDome imageUrl={imageUrl} />
        </Suspense>
        <OrbitControls
          autoRotate={true}                  // Enable automatic rotation
          autoRotateSpeed={autoRotateSpeed}  // Speed of rotation (negative value reverses direction)
          enableZoom={true}
          enablePan={false}
          rotateSpeed={-0.5}                 // Invert drag rotation for natural feel
          zoomSpeed={0.8}
          minDistance={1}
          maxDistance={100}
        />
      </Canvas>
    </div>
  );
}