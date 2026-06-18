import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, Environment, Lightformer, Sparkles } from '@react-three/drei'

import { Assembly } from './Assembly'
import { Effects } from './Effects'

export function Scene({ reducedMotion }) {
  return (
    <Canvas
      className="!fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
      camera={{ position: [0, 0, 9], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#05060d']} />
      <fog attach="fog" args={['#05060d', 14, 34]} />

      {/* Glowing accent lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[-6, -2, 4]} intensity={45} color="#38bdf8" />
      <pointLight position={[6, 3, -4]} intensity={40} color="#a855f7" />

      <Suspense fallback={null}>
        <Assembly reducedMotion={reducedMotion} />

        <Sparkles count={40} scale={18} size={2} speed={reducedMotion ? 0 : 0.3} opacity={0.4} color="#22d3ee" />

        {/* Procedural reflections — no external HDR fetch */}
        <Environment resolution={256}>
          <Lightformer intensity={2} color="#38bdf8" position={[-5, 2, 4]} scale={[6, 6, 1]} />
          <Lightformer intensity={1.5} color="#a855f7" position={[5, -2, 3]} scale={[6, 6, 1]} />
          <Lightformer intensity={1} color="#ffffff" position={[0, 5, -5]} scale={[10, 4, 1]} />
        </Environment>
      </Suspense>

      <Effects />
      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
