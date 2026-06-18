import { useRef } from 'react'

import { useCursorTorch } from '@/hooks/useCursorTorch'

// Fine-pointer + non-reduced-motion only: coarse/touch devices stay full-color.
const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function CursorTorch({ reducedMotion }) {
  const ref = useRef(null)
  const enabled = !reducedMotion && canHover()
  useCursorTorch(ref, enabled)

  if (!enabled) return null
  return <div ref={ref} className="cursor-torch" aria-hidden="true" />
}
