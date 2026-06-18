import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, var(--color-accent), var(--color-accent-2), var(--color-accent-3))',
      }}
      aria-hidden="true"
    />
  )
}
