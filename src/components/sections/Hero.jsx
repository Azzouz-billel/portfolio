import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { profile } from '@/data/profile'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { CTAButton } from '@/components/ui/CTAButton'
import { SplineScene } from '@/components/ui/SplineScene'
import { Spotlight } from '@/components/ui/Spotlight'

const EASE = [0.22, 1, 0.36, 1]
const SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

const DESKTOP_QUERY = '(min-width: 768px)'

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  // The 3D robot crowds the text on phones, so it's desktop-only; smaller
  // screens fall back to the same halo gradient used for reduced motion.
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setIsDesktop(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const showRobot = !reducedMotion && isDesktop

  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16 sm:px-10"
    >
      {/* Interactive 3D background (robot reacts to the mouse) */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
        {showRobot ? (
          <SplineScene scene={SCENE} className="absolute inset-0 h-full w-full" />
        ) : (
          <div className="halo absolute inset-0" />
        )}
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-xl">
          <motion.p
            className="eyebrow mb-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {profile.title}
          </motion.p>

          <motion.h1
            className="text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            <span className="text-gradient">Simulating Code.</span>
            <br />
            Building Solutions.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          >
            {profile.subtitle}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
          >
            <CTAButton href="#projects">View my work</CTAButton>
            <CTAButton href="#contact" variant="ghost">
              Get in touch
            </CTAButton>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-6 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="font-display text-xs uppercase tracking-[0.3em] text-muted">
          Scroll to assemble ↓
        </span>
      </motion.div>
    </section>
  )
}
