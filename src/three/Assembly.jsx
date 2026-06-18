import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { makeAssemblyData } from './geometry'
import { useScrollStore } from '@/store/scroll'
import { clamp, lerp, smoothstep } from '@/lib/math'

const COUNT = 320
const RADIUS = 2.2
const SCATTER = 14
const STAGGER_WINDOW = 0.5 // pieces finish arriving within (1 - this) of the scroll

export function Assembly({ reducedMotion = false }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const coreRef = useRef()

  const data = useMemo(() => makeAssemblyData(COUNT, RADIUS, SCATTER), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const position = useMemo(() => new THREE.Vector3(), [])
  const quaternion = useMemo(() => new THREE.Quaternion(), [])

  const eased = useRef(reducedMotion ? 1 : 0)

  useFrame((_, delta) => {
    const target = reducedMotion ? 1 : useScrollStore.getState().progress
    // Critically damped follow so the assembly trails the scroll smoothly.
    eased.current = THREE.MathUtils.damp(eased.current, target, 4, delta)
    const p = eased.current

    for (let i = 0; i < COUNT; i++) {
      const ti = smoothstep(clamp((p - data.delays[i]) / STAGGER_WINDOW, 0, 1))

      position.lerpVectors(data.scatterPositions[i], data.targets[i], ti)
      quaternion.copy(data.scatterQuaternions[i]).slerp(data.targetQuaternions[i], ti)

      dummy.position.copy(position)
      dummy.quaternion.copy(quaternion)
      dummy.scale.setScalar(lerp(0.32, 0.6, ti))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true

    // Glowing core resolves in only once the shell is nearly formed.
    const coreReveal = smoothstep(clamp((p - 0.55) / 0.45, 0, 1))
    coreRef.current.scale.setScalar(0.001 + coreReveal)
    coreRef.current.material.emissiveIntensity = 0.2 + coreReveal * 1.6

    // Gentle spin that speeds up as the structure completes.
    const spin = reducedMotion ? 0 : 0.05 + p * 0.18
    groupRef.current.rotation.y += delta * spin
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#9fd8ff"
          emissive="#1e6fff"
          emissiveIntensity={0.6}
          metalness={0.65}
          roughness={0.22}
        />
      </instancedMesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[RADIUS * 0.5, 1]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.2}
          metalness={0.2}
          roughness={0.4}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  )
}
