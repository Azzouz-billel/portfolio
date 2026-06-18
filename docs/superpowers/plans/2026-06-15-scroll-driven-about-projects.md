# Scroll-Driven About Reel + Pinned Project Fan-Out Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drive the About reel by scroll (pinned, arrows removed), color the reel photo on hover, and restore the Projects pinned fan-out using the new image cards at a smaller size.

**Architecture:** `ScrollReelTestimonials` gains a controlled mode via an optional `activeIndex` prop (an effect runs the existing exit→swap when it changes; arrows render only when uncontrolled). `About` pins a tall wrapper and maps `useScroll` progress → `activeIndex`; reduced-motion falls back to the uncontrolled arrow reel. `Projects` reintroduces a `FanCard` (framer-motion `useScroll`/`useTransform`) wrapping the existing `ProjectCard`, with the static grid kept for mobile/reduced-motion.

**Tech Stack:** React 19, Vite 6, Tailwind v4, framer-motion. No new dependencies.

**Verification approach:** No test runner; visual. Each task ends with `npm run lint` (+ `npm run build` where structural) and a manual checklist at the end.

**Git note:** Not a git repo. Treat "Commit" steps as checkpoints unless `git init` is run first.

---

## File Structure

**Modify:**
- `src/components/ui/ScrollReelTestimonials.jsx` — `activeIndex` controlled mode; `Featured` hover-color.
- `src/components/sections/About.jsx` — pinned scroll → `activeIndex`; reduced-motion fallback.
- `src/components/sections/Projects.jsx` — pinned `FanCard` of `ProjectCard`s + static grid fallback.

(`ProjectCard.jsx` unchanged — reused inside the fan.)

---

## Task 1: ScrollReelTestimonials controlled mode + photo hover-color

**Files:**
- Modify: `src/components/ui/ScrollReelTestimonials.jsx`

- [ ] **Step 1: Make the `Featured` tile colorize on hover**

In `src/components/ui/ScrollReelTestimonials.jsx`, replace the entire `Featured`
function with (adds `group` + `group-hover:opacity-0` on the desaturation layer):

```jsx
function Featured({ src, alt }) {
  return (
    <div
      className="group relative shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10"
      style={{ width: CELL, height: CELL, boxShadow: FEATURED_SHADOW }}
    >
      <img
        src={src}
        alt={alt ?? ''}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
      {/* desaturate by default; fade out on hover to reveal original color */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] bg-white opacity-100 mix-blend-saturation transition-opacity duration-300 group-hover:opacity-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] blur-[6px] mix-blend-overlay"
        style={{
          background:
            'linear-gradient(220.99deg, rgba(108,92,255,0) 32%, rgb(108,92,255) 41%, rgb(173,177,255) 47%, rgba(130,189,237,0.57) 54%, rgba(130,189,237,0) 65%)',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Accept `activeIndex` and add the controlled-mode effect**

In `ScrollReelTestimonials.jsx`, change the function signature line:

```jsx
export function ScrollReelTestimonials({ testimonials, charStaggerMs = 6, className }) {
```

to:

```jsx
export function ScrollReelTestimonials({ testimonials, activeIndex, charStaggerMs = 6, className }) {
```

Then, immediately after the existing `const onKeyDown = (e) => { ... }` block,
add this controlled-mode effect:

```jsx
  // Controlled mode: when a parent passes activeIndex (e.g. scroll-driven),
  // run the same exit -> swap transition. Re-runs interrupt cleanly toward the
  // latest target; the SLIDE_MS lock is only used by the uncontrolled arrows.
  React.useEffect(() => {
    if (activeIndex == null || activeIndex === displayIndex) return undefined
    setIndex(activeIndex)
    setExiting(true)
    const t = setTimeout(() => {
      setDisplayIndex(activeIndex)
      setExiting(false)
    }, EXIT_MS)
    return () => clearTimeout(t)
  }, [activeIndex, displayIndex])
```

- [ ] **Step 3: Disable key handler and hide arrows when controlled**

In `ScrollReelTestimonials.jsx`, on the root container `<div>`, change:

```jsx
      onKeyDown={onKeyDown}
```

to:

```jsx
      onKeyDown={activeIndex == null ? onKeyDown : undefined}
```

Then wrap the controls block: replace the opening of the controls container:

```jsx
        <div className="mt-6 flex items-center gap-1.5 md:mt-0">
```

with:

```jsx
        {activeIndex == null && (
        <div className="mt-6 flex items-center gap-1.5 md:mt-0">
```

and its matching closing `</div>` (the one right before the content section's
closing `</div>` that follows the two `<button>`s) with:

```jsx
        </div>
        )}
```

- [ ] **Step 4: Verify lint + build**

Run: `cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build`
Expected: pass (no react-hooks/exhaustive-deps errors; effect deps are `[activeIndex, displayIndex]`).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ScrollReelTestimonials.jsx && git commit -m "feat: scroll-controlled reel + hover-color photo"
```

---

## Task 2: About — pinned, scroll-driven

**Files:**
- Modify: `src/components/sections/About.jsx`

- [ ] **Step 1: Rewrite `About.jsx`**

Replace the entire contents of `src/components/sections/About.jsx` with:

```jsx
import { useRef, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'

import { profile } from '@/data/profile'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { ScrollReelTestimonials } from '@/components/ui/ScrollReelTestimonials'

const ABOUT_REEL = [
  {
    quote:
      'I build backends the way I build models — from clear first principles up to something that behaves predictably under load.',
    author: 'Backend engineering',
    image: '/me.png',
    alt: `Portrait of ${profile.name}`,
  },
  {
    quote:
      'My simulation background means I reach for the underlying math and reason about behavior before writing a line of code.',
    author: 'Modeling & simulation',
    image: '/me.png',
    alt: `Portrait of ${profile.name}`,
  },
  {
    quote:
      'I care about systems that stay correct as they scale — clean data models, solid APIs, and interfaces that feel alive.',
    author: 'The approach',
    image: '/me.png',
    alt: `Portrait of ${profile.name}`,
  },
]

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
    const next = Math.min(ABOUT_REEL.length - 1, Math.max(0, Math.floor(p * ABOUT_REEL.length)))
    setIndex(next)
  })

  if (reducedMotion) {
    return (
      <section id="about" className="relative z-10 px-6 py-28 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading {...HEADING} align="center" />
          <Reveal className="mt-14 flex justify-center">
            <ScrollReelTestimonials testimonials={ABOUT_REEL} />
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
          <ScrollReelTestimonials testimonials={ABOUT_REEL} activeIndex={index} />
        </div>
        <p className="mt-8 font-display text-xs uppercase tracking-[0.3em] text-muted">
          Scroll to read more ↓
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify lint + build**

Run: `cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build`
Expected: pass.

Manual (user): About pins; scrolling cycles the 3 quotes with per-character
animation and the reel slide; no arrow buttons; hovering the photo shows its
original colors. With reduced-motion, the arrow reel shows without pinning.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/About.jsx && git commit -m "feat: scroll-driven pinned about reel"
```

---

## Task 3: Projects — pinned fan-out of smaller image cards

**Files:**
- Modify: `src/components/sections/Projects.jsx`

- [ ] **Step 1: Rewrite `Projects.jsx`**

Replace the entire contents of `src/components/sections/Projects.jsx` with:

```jsx
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/sections/ProjectCard'

// Final fanned position per card (index-aligned to `projects`, 4 items).
const FAN = [
  { rotate: -16, x: '-112%', y: 24 },
  { rotate: -5, x: '-37%', y: 0 },
  { rotate: 5, x: '37%', y: 0 },
  { rotate: 16, x: '112%', y: 24 },
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
```

- [ ] **Step 2: Verify lint + build**

Run: `cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build`
Expected: pass (no react-hooks errors — `useTransform` lives in `FanCard`).

Manual (user): on desktop the Projects section pins and the smaller image cards
fan out from a stack as you scroll, re-stacking on scroll-up; on mobile /
reduced-motion the static 2-column image grid shows.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Projects.jsx && git commit -m "feat: pinned fan-out of smaller project image cards"
```

---

## Task 4: Full verification pass

**Files:** none

- [ ] **Step 1: Lint + build**

Run: `cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 2: Manual browser checklist (user runs `npm run dev`)**

1. About pins; scroll cycles the 3 quotes (per-char rise + reel slide); no arrows; hovering `me.png` reveals original color; reduced-motion → arrow reel, no pin.
2. Projects pins; smaller image cards fan out on scroll and re-stack on reverse; mobile/reduced-motion → static image grid.
3. Cursor torch, light/dark theme, nav, contact still work.

- [ ] **Step 3: Final commit (if needed)**

```bash
git add -A && git commit -m "chore: scroll-driven about + pinned projects verification"
```

---

## Self-Review Notes

- **Spec coverage:** Feature 1 → Tasks 1 (controlled mode) + 2 (About pin/map); Feature 2 → Task 1 (Featured hover); Feature 3 → Task 3. All covered.
- **Name consistency:** `ScrollReelTestimonials({ testimonials, activeIndex, charStaggerMs, className })` — About passes `activeIndex={index}` (controlled) or omits it (reduced-motion); `FanCard({ progress, project, target, index })` matches the `projects.map` call; `ProjectCard({ project })` unchanged.
- **Controlled-mode correctness:** the effect keys on `[activeIndex, displayIndex]`, returns early when equal, and its cleanup clears the pending swap so rapid scroll interrupts toward the latest index. The `animating` lock + `paginate` remain only for the uncontrolled (arrows) path, which About's reduced-motion branch uses.
- **No placeholders:** every code step is complete.
```
