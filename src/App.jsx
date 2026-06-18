import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'

import { useScrollStore } from '@/store/scroll'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

import { CursorTorch } from '@/components/effects/CursorTorch'
import { Navbar } from '@/components/layout/Navbar'
import { ScrollProgressBar } from '@/components/layout/ScrollProgressBar'
import { Footer } from '@/components/layout/Footer'

import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Projects } from '@/components/sections/Projects'
import { Contact } from '@/components/sections/Contact'

function ScrollSync() {
  const setProgress = useScrollStore((state) => state.setProgress)
  useLenis((lenis) => setProgress(lenis.progress))
  return null
}

// Route in-page hash links (nav, logo, CTAs) through Lenis for smooth scrolling,
// offsetting for the fixed navbar so target sections aren't hidden beneath it.
function SmoothAnchors() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return undefined

    const handleClick = (event) => {
      const link = event.target.closest('a[href^="#"]')
      if (!link) return
      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return

      if (hash === '#top') {
        event.preventDefault()
        lenis.scrollTo(0)
        return
      }

      const target = document.querySelector(hash)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: -72 })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [lenis])

  return null
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <ReactLenis
      root
      options={{ smoothWheel: !reducedMotion, lerp: 0.1, wheelMultiplier: 0.9 }}
    >
      <CursorTorch reducedMotion={reducedMotion} />
      <ScrollSync />
      <SmoothAnchors />

      <ScrollProgressBar />
      <Navbar />

      <main id="top">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </ReactLenis>
  )
}
