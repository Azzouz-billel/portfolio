# Monochrome + Spline Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the colorful R3F portfolio into a monochrome site where color is revealed only around the cursor, with a Spline robot hero background, liquid-glass surfaces, a pinned scroll-driven projects fan-out, and an animated contact form.

**Architecture:** A single fixed `backdrop-filter: grayscale` overlay with a cursor-following radial mask provides the global black-and-white + color-torch effect. The hero background swaps from react-three-fiber to a lazy-loaded Spline scene. Glass styling is upgraded in `src/index.css` (existing `.glass`/`.glass-strong` class names are restyled in place, so consumers like Navbar/GlassCard need no churn). Projects becomes a tall pinned section driven by framer-motion `useScroll`/`useTransform`. Contact is rebuilt with floating-label fields and an animated submit button.

**Tech Stack:** React 19, Vite 6, Tailwind v4 (`@theme`), framer-motion (installed), Lenis (installed), `@splinetool/react-spline` + `@splinetool/runtime` (new), `lucide-react` (new). JSX, not TS/shadcn — matching the repo.

**Verification approach:** This repo has no test runner and the deliverables are visual/animation, so each task is verified with `npm run lint` and (where structural) `npm run build`, plus a manual browser check list at the end. We do not add a test framework (out of scope). The dev server is `npm run dev`.

**Git note:** This folder is not a git repository. Either run `git init` first to enable the commit steps, or treat each "Commit" step as a checkpoint and skip it. Commit messages below assume a repo exists.

---

## File Structure

**Create:**
- `src/hooks/useCursorTorch.js` — pointer tracking → spring-eased CSS vars.
- `src/components/effects/CursorTorch.jsx` — the fixed grayscale+mask overlay.
- `src/components/ui/SplineScene.jsx` — lazy Spline loader with Suspense fallback.
- `src/components/ui/Spotlight.jsx` — animated white spotlight SVG (no `cn`/extra deps).
- `src/components/sections/ProjectCard.jsx` — shared project card body (fan + list).

**Modify:**
- `src/index.css` — restyle glass utilities to liquid glass, add pill variant, torch + spotlight + loader CSS, spotlight keyframes.
- `src/components/sections/Hero.jsx` — remove photo column, add Spline background + Spotlight.
- `src/App.jsx` — remove R3F `<Scene>`, mount `<CursorTorch>`.
- `src/components/ui/CTAButton.jsx` — primary variant becomes the liquid-glass pill.
- `src/components/sections/Projects.jsx` — pinned fan-out + list fallback.
- `src/components/sections/Contact.jsx` — creative animated form.
- `package.json` — new dependencies (via `npm install`).

**Leave unused (out of scope to delete):** `src/three/*`.

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install the new packages**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm install @splinetool/react-spline @splinetool/runtime lucide-react
```
Expected: install completes; `node_modules/@splinetool` and `node_modules/lucide-react` now exist. If the sandbox blocks the network, report it and ask the user to run this command — the rest of the plan assumes these are installed.

- [ ] **Step 2: Verify**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && ls node_modules/@splinetool && ls -d node_modules/lucide-react
```
Expected: both listed, no error.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json && git commit -m "build: add spline + lucide-react deps"
```

---

## Task 2: Liquid-glass tokens, torch, spotlight & loader CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add new design tokens to the `@theme` block**

In `src/index.css`, inside the existing `@theme { ... }` block, add these lines just before the closing `}` (after the `--font-sans` line):

```css
  /* surfaces & motion tokens */
  --radius-glass: 1.25rem;
  --shadow-glass: 0 24px 70px -24px rgba(0, 0, 0, 0.85);
  --shadow-bloom: 0 0 60px -10px rgba(56, 189, 248, 0.45);
  --torch-radius: 220px;

  /* spotlight intro animation (used by Spotlight.jsx) */
  --animate-spotlight: spotlight 2.2s ease 0.6s 1 forwards;
```

- [ ] **Step 2: Replace the `.glass` and `.glass-strong` rules with liquid glass**

In `src/index.css`, replace the existing `.glass { ... }` and `.glass-strong { ... }` rules (inside `@layer components`) with:

```css
  /* Liquid glass — deep translucent black, gradient hairline, bloom + inner highlight */
  .glass,
  .liquid-glass {
    @apply rounded-2xl border border-white/10;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
      rgba(8, 10, 18, 0.55);
    backdrop-filter: blur(22px) saturate(150%);
    -webkit-backdrop-filter: blur(22px) saturate(150%);
    box-shadow:
      var(--shadow-glass),
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset 0 -1px 0 rgba(255, 255, 255, 0.04);
  }

  .glass-strong {
    @apply rounded-2xl border border-white/15;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03)),
      rgba(8, 10, 18, 0.7);
    backdrop-filter: blur(30px) saturate(170%);
    -webkit-backdrop-filter: blur(30px) saturate(170%);
    box-shadow:
      var(--shadow-glass),
      inset 0 1px 0 rgba(255, 255, 255, 0.16);
  }

  /* Pill variant for the primary CTA — matches the "Liquid Glass" reference */
  .liquid-glass-pill {
    @apply rounded-full border border-white/15;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03)),
      rgba(10, 12, 20, 0.6);
    backdrop-filter: blur(18px) saturate(160%);
    -webkit-backdrop-filter: blur(18px) saturate(160%);
    box-shadow:
      0 14px 40px -16px rgba(0, 0, 0, 0.9),
      inset 0 1px 0 rgba(255, 255, 255, 0.22),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  .liquid-glass-pill:hover {
    box-shadow:
      0 18px 48px -14px rgba(0, 0, 0, 0.9),
      var(--shadow-bloom),
      inset 0 1px 0 rgba(255, 255, 255, 0.28);
    transform: translateY(-1px);
  }
```

- [ ] **Step 3: Append torch overlay, spotlight keyframes, and loader to `@layer components`**

Add these rules inside the `@layer components { ... }` block (before its closing `}`):

```css
  /* Global B&W overlay; the radial hole around the cursor reveals true color */
  .cursor-torch {
    position: fixed;
    inset: 0;
    z-index: 60;
    pointer-events: none;
    --torch-x: -9999px;
    --torch-y: -9999px;
    backdrop-filter: grayscale(1);
    -webkit-backdrop-filter: grayscale(1);
    -webkit-mask-image: radial-gradient(
      circle var(--torch-radius) at var(--torch-x) var(--torch-y),
      transparent 0%,
      transparent 45%,
      black 100%
    );
    mask-image: radial-gradient(
      circle var(--torch-radius) at var(--torch-x) var(--torch-y),
      transparent 0%,
      transparent 45%,
      black 100%
    );
  }

  /* Spline loading spinner */
  .loader {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-top-color: var(--color-accent);
    animation: spin 0.8s linear infinite;
  }
```

Then add these keyframes at the end of the file (outside any layer):

```css
@keyframes spotlight {
  0% {
    opacity: 0;
    transform: translate(-72%, -62%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -40%) scale(1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

- [ ] **Step 4: Verify build still compiles**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm run build
```
Expected: build succeeds (Tailwind compiles the new utilities; no CSS syntax errors).

- [ ] **Step 5: Commit**

```bash
git add src/index.css && git commit -m "style: liquid glass tokens, cursor torch, spotlight + loader"
```

---

## Task 3: Cursor color torch

**Files:**
- Create: `src/hooks/useCursorTorch.js`
- Create: `src/components/effects/CursorTorch.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create the pointer-tracking hook**

Create `src/hooks/useCursorTorch.js`:

```js
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
```

- [ ] **Step 2: Create the overlay component**

Create `src/components/effects/CursorTorch.jsx`:

```jsx
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
```

- [ ] **Step 3: Mount it in `App.jsx`**

In `src/App.jsx`, add the import alongside the other component imports:

```jsx
import { CursorTorch } from '@/components/effects/CursorTorch'
```

Then render it as the first child inside `<ReactLenis>`, immediately before `<ScrollSync />`:

```jsx
      <CursorTorch reducedMotion={reducedMotion} />
      <ScrollSync />
```

- [ ] **Step 4: Verify**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build
```
Expected: lint passes (no react-hooks violations), build succeeds.

Manual (user): with a mouse, the page is grayscale and a soft circle of color follows the cursor; with DevTools "Emulate prefers-reduced-motion: reduce", the page is full color and the overlay is absent.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCursorTorch.js src/components/effects/CursorTorch.jsx src/App.jsx && git commit -m "feat: cursor color torch over monochrome page"
```

---

## Task 4: Spline robot hero background

**Files:**
- Create: `src/components/ui/SplineScene.jsx`
- Create: `src/components/ui/Spotlight.jsx`
- Modify: `src/components/sections/Hero.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create the Spline loader**

Create `src/components/ui/SplineScene.jsx`:

```jsx
import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="loader" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
```

- [ ] **Step 2: Create the Spotlight SVG (no extra deps)**

Create `src/components/ui/Spotlight.jsx`:

```jsx
export function Spotlight({ className = '', fill = 'white' }) {
  return (
    <svg
      className={`animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] opacity-0 lg:w-[84%] ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
      aria-hidden="true"
    >
      <g filter="url(#spotlight-filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="spotlight-filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  )
}
```

- [ ] **Step 3: Rework `Hero.jsx` — remove photo, add Spline background**

Replace the entire contents of `src/components/sections/Hero.jsx` with:

```jsx
import { motion } from 'framer-motion'

import { profile } from '@/data/profile'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { CTAButton } from '@/components/ui/CTAButton'
import { SplineScene } from '@/components/ui/SplineScene'
import { Spotlight } from '@/components/ui/Spotlight'

const EASE = [0.22, 1, 0.36, 1]
const SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16 sm:px-10"
    >
      {/* Interactive 3D background (robot reacts to the mouse) */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
        {reducedMotion ? (
          <div className="halo absolute inset-0" />
        ) : (
          <SplineScene scene={SCENE} className="absolute inset-0 h-full w-full" />
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
```

- [ ] **Step 4: Remove the R3F background from `App.jsx`**

In `src/App.jsx`, delete the lazy `Scene` declaration (the `const Scene = lazy(...)` block and its explanatory comment) and remove the `<Suspense fallback={null}><Scene reducedMotion={reducedMotion} /></Suspense>` block from the render. Also remove the now-unused `lazy, Suspense` import if nothing else uses them (the file keeps `usePrefersReducedMotion` for `CursorTorch`). After editing, the top of the render inside `<ReactLenis>` should read:

```jsx
      <CursorTorch reducedMotion={reducedMotion} />
      <ScrollSync />

      <ScrollProgressBar />
      <Navbar />
```

- [ ] **Step 5: Verify**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build
```
Expected: lint + build pass; no unused-import errors.

Manual (user): hero shows the Spline robot on the right, text on the left, white spotlight sweep on load; the robot tracks the mouse; no photo remains.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/SplineScene.jsx src/components/ui/Spotlight.jsx src/components/sections/Hero.jsx src/App.jsx && git commit -m "feat: spline robot hero background, remove r3f + photo"
```

---

## Task 5: Liquid-glass CTA pill

**Files:**
- Modify: `src/components/ui/CTAButton.jsx`

(Navbar and GlassCard already use `.glass`, which Task 2 restyled — no change needed there.)

- [ ] **Step 1: Make the primary variant a liquid-glass pill**

Replace the `VARIANTS` object in `src/components/ui/CTAButton.jsx` with:

```jsx
const VARIANTS = {
  primary: 'liquid-glass-pill text-ink',
  ghost:
    'rounded-full border border-white/15 bg-white/0 text-ink transition-all duration-300 hover:bg-white/5 hover:border-white/30',
}
```

Then, in the same file, remove `rounded-full border` from the shared `className` array (the variants now own their border/radius) so the base class list reads:

```jsx
      className={[
        'inline-flex items-center justify-center gap-2 px-6 py-3',
        'font-display text-sm font-medium tracking-wide transition-all duration-300',
        VARIANTS[variant],
        className,
      ].join(' ')}
```

- [ ] **Step 2: Verify**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build
```
Expected: pass.

Manual (user): primary buttons look like the glossy "Liquid Glass" pill and brighten/lift on hover.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CTAButton.jsx && git commit -m "style: CTA button becomes liquid-glass pill"
```

---

## Task 6: Projects — pinned scroll-driven fan-out

**Files:**
- Create: `src/components/sections/ProjectCard.jsx`
- Modify: `src/components/sections/Projects.jsx`

- [ ] **Step 1: Create the shared card body**

Create `src/components/sections/ProjectCard.jsx`:

```jsx
export function ProjectCard({ project }) {
  return (
    <div className="liquid-glass flex h-full flex-col p-6">
      <p className="eyebrow mb-3" style={{ letterSpacing: '0.22em' }}>
        {project.category}
      </p>
      <h3 className="text-xl font-semibold">{project.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-4 text-sm">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-accent transition-opacity hover:opacity-80"
          >
            Code →
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="text-ink transition-opacity hover:opacity-80"
          >
            Live →
          </a>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `Projects.jsx` with the pinned fan**

Replace the entire contents of `src/components/sections/Projects.jsx` with:

```jsx
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/sections/ProjectCard'

// Final fanned position per card (index-aligned to `projects`, 4 items).
const FAN = [
  { rotate: -16, x: '-115%', y: 26 },
  { rotate: -5, x: '-38%', y: 0 },
  { rotate: 5, x: '38%', y: 0 },
  { rotate: 16, x: '115%', y: 26 },
]

const SPREAD = [0, 0.6] // scroll-progress window over which cards fan out

function FanCard({ progress, project, target, index }) {
  const rotate = useTransform(progress, SPREAD, [0, target.rotate])
  const x = useTransform(progress, SPREAD, ['0%', target.x])
  const y = useTransform(progress, SPREAD, [index * 10, target.y])

  return (
    <motion.article
      style={{ rotate, x, y, zIndex: index }}
      className="absolute left-1/2 top-0 -ml-[40%] w-[80%] max-w-xs sm:max-w-sm"
    >
      <ProjectCard project={project} />
    </motion.article>
  )
}

function ProjectsList() {
  return (
    <div className="mx-auto mt-14 grid max-w-6xl gap-6 px-6 sm:grid-cols-2 sm:px-10">
      {projects.map((project) => (
        <Reveal key={project.id}>
          <ProjectCard project={project} />
        </Reveal>
      ))}
    </div>
  )
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
      {/* Pinned fan — desktop, motion allowed */}
      {!reducedMotion && (
        <div className="hidden lg:block" style={{ height: '280vh' }}>
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
            <SectionHeading
              eyebrow="Selected work"
              title="Things I've modeled, built and shipped."
              description="Django applications, Python automation, and simulation models."
            />
            <div className="relative mt-16 h-[440px] w-full max-w-3xl">
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

      {/* Fallback list — mobile and reduced-motion */}
      <div className={reducedMotion ? 'py-28' : 'py-28 lg:hidden'}>
        <SectionHeading
          eyebrow="Selected work"
          title="Things I've modeled, built and shipped."
          description="Django applications, Python automation, and simulation models."
        />
        <ProjectsList />
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build
```
Expected: pass (no react-hooks/exhaustive-deps errors — `useTransform` lives in `FanCard`, not a loop).

Manual (user): on desktop, scrolling into Projects pins the section; the stacked cards fan apart as you scroll and re-stack on scroll-up. On a narrow window or with reduced-motion, a normal 2-column card grid shows instead.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ProjectCard.jsx src/components/sections/Projects.jsx && git commit -m "feat: pinned scroll-driven projects fan-out"
```

---

## Task 7: Creative animated contact form

**Files:**
- Modify: `src/components/sections/Contact.jsx`

- [ ] **Step 1: Rewrite `Contact.jsx`**

Replace the entire contents of `src/components/sections/Contact.jsx` with:

```jsx
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Github, Linkedin, Loader2, Mail, MessageSquare, Send, User } from 'lucide-react'

import { profile } from '@/data/profile'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

const SOCIAL_ICONS = { GitHub: Github, LinkedIn: Linkedin, Email: Mail }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Field({ id, label, icon: Icon, value, onChange, error, type = 'text', textarea = false }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div className="relative">
      <span
        className={`pointer-events-none absolute left-4 top-4 transition-colors ${
          focused ? 'text-accent' : 'text-muted'
        }`}
      >
        <Icon size={18} />
      </span>
      <Tag
        id={id}
        name={id}
        type={textarea ? undefined : type}
        rows={textarea ? 4 : undefined}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={Boolean(error)}
        className={`peer w-full rounded-xl border bg-white/5 pl-11 pr-4 pt-6 pb-2 text-ink outline-none transition-all ${
          textarea ? 'resize-none' : ''
        } ${
          error
            ? 'border-rose-400/60'
            : focused
              ? 'border-accent/60 shadow-[0_0_34px_-10px_rgba(56,189,248,0.55)]'
              : 'border-white/10'
        }`}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-11 transition-all ${
          active ? 'top-2 text-[11px] text-accent' : 'top-4 text-sm text-muted'
        }`}
      >
        {label}
      </label>
      {error && <p className="mt-1 pl-1 text-xs text-rose-300">{error}</p>}
    </div>
  )
}

const BUTTON_LABEL = {
  idle: (
    <>
      Send message <Send size={16} />
    </>
  ),
  sending: (
    <>
      Sending <Loader2 size={16} className="animate-spin" />
    </>
  ),
  sent: (
    <>
      Sent <Check size={16} />
    </>
  ),
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please tell me your name.'
    if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.message.trim().length < 10) next.message = 'A little more detail, please.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // EDIT: swap this mailto handoff for Formspree / EmailJS / your Django API.
  const handleSubmit = (event) => {
    event.preventDefault()
    if (status !== 'idle' || !validate()) return
    setStatus('sending')
    const subject = encodeURIComponent(`Portfolio message from ${form.name || 'someone'}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.setTimeout(() => {
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      setStatus('sent')
    }, 700)
  }

  return (
    <section id="contact" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something that holds together."
            description="Open to internships, junior roles and collaboration on backend or simulation projects."
          />

          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
            {profile.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.label] ?? Mail
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="liquid-glass-pill inline-flex items-center gap-2 px-5 py-3 text-sm text-ink"
                >
                  <Icon size={16} /> {social.label}
                </a>
              )
            })}
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <form onSubmit={handleSubmit} className="liquid-glass space-y-5 p-6 sm:p-8" noValidate>
            <Field
              id="name"
              label="Name"
              icon={User}
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Field
              id="email"
              label="Email"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Field
              id="message"
              label="Message"
              icon={MessageSquare}
              textarea
              value={form.message}
              onChange={handleChange}
              error={errors.message}
            />

            <motion.button
              type="submit"
              disabled={status !== 'idle'}
              whileTap={{ scale: 0.98 }}
              className="liquid-glass-pill flex w-full items-center justify-center gap-2 px-6 py-3 font-display text-sm font-medium text-ink disabled:opacity-80"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  className="inline-flex items-center gap-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {BUTTON_LABEL[status]}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build
```
Expected: pass.

Manual (user): labels float up on focus/fill; the focused field glows; submitting with empty/invalid fields shows inline errors; a valid submit animates Send → Sending (spinner) → Sent (check) and opens the mail client; social links are glass pills with icons.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contact.jsx && git commit -m "feat: creative animated liquid-glass contact form"
```

---

## Task 8: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Lint + production build**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build
```
Expected: both succeed with no errors.

- [ ] **Step 2: Manual browser checklist (user runs `npm run dev`)**

Confirm each:
1. Page is grayscale; a color circle follows the cursor (desktop).
2. Hero shows the Spline robot reacting to the mouse; no photo; spotlight sweep on load.
3. Nav, cards, form, buttons all read as liquid glass; primary buttons are glossy pills.
4. Scrolling into Projects pins the section and fans the cards out, re-stacking on reverse.
5. Contact: floating labels, focus glow, inline validation, Send→Sending→Sent button.
6. With `prefers-reduced-motion: reduce`: full color (no torch), static hero gradient, Projects shows a 2-column grid (no pinning).

- [ ] **Step 3: Final commit (if any stray changes)**

```bash
git add -A && git commit -m "chore: monochrome + spline redesign verification pass"
```

---

## Self-Review Notes

- **Spec coverage:** Feature 1 → Tasks 2–3; Feature 2 → Task 4; Feature 3 → Tasks 2 & 5 (and Navbar/GlassCard auto-updated via restyled `.glass`); Feature 4 → Task 6; Feature 5 → Task 7. All covered.
- **Decision deviation from spec:** Spec said "replace `.glass` with `.liquid-glass`"; the plan instead restyles `.glass`/`.glass-strong` in place (and adds `.liquid-glass` as an alias) to avoid churn in Navbar/GlassCard. Same visual outcome, fewer edits.
- **Type/name consistency:** `useCursorTorch(targetRef, enabled)` matches its call in `CursorTorch`; `ProjectCard` prop `project` matches usages in `FanCard`/`ProjectsList`; `SplineScene`/`Spotlight` prop names match Hero usage; `status` values `idle|sending|sent` match `BUTTON_LABEL` keys.
- **No placeholders:** every code step contains complete code.
```
