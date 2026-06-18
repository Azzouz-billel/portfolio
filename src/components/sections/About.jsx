import { useRef, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { aboutReel } from '@/data/about'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { ScrollReelTestimonials } from '@/components/ui/ScrollReelTestimonials'

const HEADING = {
  eyebrow: 'About me',
  title: 'Where mathematics meets the backend.',
  description: 'A full-stack Django developer and 4th-year Modeling & Simulation student.',
}

export function About() {
  const reducedMotion = usePrefersReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const [index, setIndex] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(aboutReel.length - 1, Math.max(0, Math.floor(p * aboutReel.length)))
    setIndex(next)
  })

  if (reducedMotion) {
    return (
      <section id="about" className="relative z-10 px-6 py-28 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading {...HEADING} align="center" />
          <Reveal className="mt-14 flex justify-center">
            <ScrollReelTestimonials testimonials={aboutReel} />
          </Reveal>
        </div>
      </section>
    )
  }

  return (
    <section id="about" ref={ref} className="relative z-10" style={{ height: '300vh' }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 sm:px-10">
        <SectionHeading {...HEADING} align="center" />
        <div className="mt-12 flex w-full justify-center">
          <ScrollReelTestimonials testimonials={aboutReel} activeIndex={index} />
        </div>
        <p className="mt-8 font-display text-xs uppercase tracking-[0.3em] text-muted">
          Scroll to read more ↓
        </p>
      </div>
    </section>
  )
}
