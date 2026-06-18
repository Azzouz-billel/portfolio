import * as THREE from 'three'

/**
 * Even point distribution on a sphere using the golden-angle (Fibonacci)
 * spiral. These become the assembled target positions for each shard.
 */
export function fibonacciSphere(count, radius = 1) {
  const points = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const ringRadius = Math.sqrt(1 - y * y)
    const theta = goldenAngle * i
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * ringRadius,
        y,
        Math.sin(theta) * ringRadius,
      ).multiplyScalar(radius),
    )
  }
  return points
}

/**
 * Precomputes everything the assembly needs per shard: scattered start state,
 * assembled target state, and a per-shard delay so pieces arrive staggered
 * ("piece by piece") rather than all at once.
 */
export function makeAssemblyData(count, radius, scatter) {
  const targets = fibonacciSphere(count, radius)
  const scatterPositions = []
  const targetQuaternions = []
  const scatterQuaternions = []
  const delays = []

  const up = new THREE.Vector3(0, 1, 0)
  const center = new THREE.Vector3()
  const lookMatrix = new THREE.Matrix4()

  for (let i = 0; i < count; i++) {
    // Random start far out in a spherical shell.
    const direction = new THREE.Vector3().randomDirection()
    const distance = scatter * (0.6 + Math.random() * 0.8)
    scatterPositions.push(direction.multiplyScalar(distance))

    // Assembled orientation: each shard faces outward from the center.
    lookMatrix.lookAt(targets[i], center, up)
    targetQuaternions.push(
      new THREE.Quaternion().setFromRotationMatrix(lookMatrix),
    )

    // Random tumbling orientation while scattered.
    scatterQuaternions.push(
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
        ),
      ),
    )

    delays.push(Math.random() * 0.5)
  }

  return { targets, scatterPositions, targetQuaternions, scatterQuaternions, delays }
}
