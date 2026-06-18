import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/sections/ProjectCard'

// Final fanned position per card (index-aligned to `projects`, 4 items).
const FAN = [
  { rotate: -20, x: '-138%', y: 30 },
  { rotate: -8, x: '-48%', y: 0 },
  { rotate: 8, x: '48%', y: 0 },
  { rotate: 20, x: '138%', y: 30 },
]

const SPREAD = [0, 0.6] // scroll-progress window over which cards fan out

function FanCard({ progress, project, target, index }) {
  const rotate = useTransform(progress, SPREAD, [0, target.rotate])
  const x = useTransform(progress, SPREAD, ['0%', target.x])
  const y = useTransform(progress, SPREAD, [index * 10, target.y])

  return (
    <motion.article
      style={{ rotate, x, y, zIndex: index }}
      className="absolute left-1/2 top-0 -ml-[8.5rem] w-[17rem] max-w-xs"
    >
      <ProjectCard project={project} />
    </motion.article>
  )
}

const HEADING = {
  eyebrow: 'Selected work',
  title: "Things I've modeled, built and shipped.",
  description: 'Django applications, Python automation, and simulation models.',
}

export function Projects() {
  const reducedMotion = usePrefersReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  return (
    <section id="projects" ref={ref} className="relative z-10">
      {/* Pinned fan-out — desktop, motion allowed */}
      {!reducedMotion && (
        <div className="hidden lg:block" style={{ height: '280vh' }}>
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
            <SectionHeading {...HEADING} align="center" />
            <div className="relative mt-16 h-[460px] w-full max-w-3xl">
              {projects.map((project, index) => (
                <FanCard
                  key={project.id}
                  progress={scrollYProgress}
                  project={project}
                  target={FAN[index]}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Static grid — mobile and reduced-motion */}
      <div className={reducedMotion ? 'px-6 py-28 sm:px-10' : 'px-6 py-28 sm:px-10 lg:hidden'}>
        <div className="mx-auto max-w-6xl">
          <SectionHeading {...HEADING} />
          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2" stagger={0.08}>
            {projects.map((project) => (
              <RevealItem key={project.id}>
                <ProjectCard project={project} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
