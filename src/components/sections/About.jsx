import { useRef, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { aboutReel, bio } from '@/data/about'
import { profile } from '@/data/profile'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { ScrollReelTestimonials } from '@/components/ui/ScrollReelTestimonials'

const HEADING = {
  eyebrow: 'About me',
  title: 'Where mathematics meets the backend.',
  description: 'A full-stack Django developer and 4th-year Modeling & Simulation student.',
}

// Mobile editorial About — B&W photo strip, condensed heading, highlighted bio,
// condensed social links. Mirrors the reference layout; desktop keeps the reel.
function MobileAbout() {
  return (
    <div className="px-6 py-24 md:hidden">
      <Reveal className="relative -mx-6 h-[55vh] overflow-hidden">
        <img
          src="/me.png"
          alt={`Portrait of ${profile.name}`}
          loading="lazy"
          className="h-full w-full object-cover object-top grayscale"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, black 55%, transparent 98%)',
            maskImage: 'linear-gradient(to bottom, black 55%, transparent 98%)',
          }}
        />
      </Reveal>

      <Reveal>
        <h2 className="mt-6 font-condensed text-7xl uppercase leading-none tracking-wide">
          About
        </h2>
      </Reveal>

      <div className="mt-6 space-y-4">
        {bio.map((paragraph, i) => (
          <Reveal key={i} delay={0.05 * (i + 1)}>
            <p className="text-base leading-relaxed text-muted">
              {paragraph.map((segment, j) =>
                segment.kw ? (
                  <span key={j} className="kw">
                    {segment.text}
                  </span>
                ) : (
                  segment.text
                ),
              )}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.25} className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        {profile.socials.map((social) => (
          <a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="font-condensed text-2xl uppercase tracking-widest text-ink transition-opacity hover:opacity-70"
          >
            {social.label} <span aria-hidden="true" className="text-muted">↗</span>
          </a>
        ))}
      </Reveal>
    </div>
  )
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
      <section id="about" className="relative z-10 md:px-10 md:py-28">
        <MobileAbout />
        <div className="mx-auto hidden max-w-6xl md:block">
          <SectionHeading {...HEADING} align="center" />
          <Reveal className="mt-14 flex justify-center">
            <ScrollReelTestimonials testimonials={aboutReel} />
          </Reveal>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="relative z-10">
      <MobileAbout />
      {/* Desktop: pinned scroll-driven reel */}
      <div ref={ref} className="hidden md:block" style={{ height: '300vh' }}>
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 sm:px-10">
          <SectionHeading {...HEADING} align="center" />
          <div className="mt-12 flex w-full justify-center">
            <ScrollReelTestimonials testimonials={aboutReel} activeIndex={index} />
          </div>
          <p className="mt-8 font-display text-xs uppercase tracking-[0.3em] text-muted">
            Scroll to read more ↓
          </p>
        </div>
      </div>
    </section>
  )
}
