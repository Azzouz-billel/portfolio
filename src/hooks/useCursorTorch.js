import { useEffect } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

const SPRING = { stiffness: 380, damping: 36, mass: 0.4 }

/**
 * Tracks the pointer and writes spring-eased coordinates to `--torch-x` /
 * `--torch-y` on `targetRef` without triggering React re-renders.
 */
export function useCursorTorch(targetRef, enabled) {
  const sourceX = useMotionValue(-9999)
  const sourceY = useMotionValue(-9999)
  const x = useSpring(sourceX, SPRING)
  const y = useSpring(sourceY, SPRING)

  useEffect(() => {
    if (!enabled) return undefined

    const handleMove = (event) => {
      sourceX.set(event.clientX)
      sourceY.set(event.clientY)
    }
    // Touch: the reveal lasts only while the finger is down ("color until I touch").
    const handleRelease = (event) => {
      if (event.pointerType !== 'touch') return
      sourceX.set(-9999)
      sourceY.set(-9999)
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerdown', handleMove)
    window.addEventListener('pointerup', handleRelease)
    window.addEventListener('pointercancel', handleRelease)

    const node = targetRef.current
    const unsubscribeX = x.on('change', (value) =>
      node?.style.setProperty('--torch-x', `${value}px`),
    )
    const unsubscribeY = y.on('change', (value) =>
      node?.style.setProperty('--torch-y', `${value}px`),
    )

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerdown', handleMove)
      window.removeEventListener('pointerup', handleRelease)
      window.removeEventListener('pointercancel', handleRelease)
      unsubscribeX()
      unsubscribeY()
    }
  }, [enabled, sourceX, sourceY, x, y, targetRef])
}
