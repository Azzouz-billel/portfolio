import { useRef } from 'react'

import { useCursorTorch } from '@/hooks/useCursorTorch'

// Runs on mouse and touch alike: the page renders grayscale, and the hole
// around the pointer reveals true color. Touch reveals only while pressing.
export function CursorTorch({ reducedMotion }) {
  const ref = useRef(null)
  const enabled = !reducedMotion
  useCursorTorch(ref, enabled)

  if (!enabled) return null
  return <div ref={ref} className="cursor-torch" aria-hidden="true" />
}
