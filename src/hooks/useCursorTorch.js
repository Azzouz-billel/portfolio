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
    window.addEventListener('pointermove', handleMove)

    const node = targetRef.current
    const unsubscribeX = x.on('change', (value) =>
      node?.style.setProperty('--torch-x', `${value}px`),
    )
    const unsubscribeY = y.on('change', (value) =>
      node?.style.setProperty('--torch-y', `${value}px`),
    )

    return () => {
      window.removeEventListener('pointermove', handleMove)
      unsubscribeX()
      unsubscribeY()
    }
  }, [enabled, sourceX, sourceY, x, y, targetRef])
}
