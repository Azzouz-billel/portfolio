# Scroll-Reel About + Skill Logos + Project Image Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace About with a ported scroll-reel quote carousel (user's photo), enlarge Skills cards with real brand logos + intros, and rebuild Projects as a responsive image-card grid.

**Architecture:** A ported `ScrollReelTestimonials` JSX component (shadcn tokens remapped to the project's tokens/glass and themes) becomes the About centerpiece. Skills gains a `react-icons` brand-logo map + per-skill blurbs in data. Projects drops the pinned fan-out for a Reveal grid of image cards with graceful empty-image placeholders.

**Tech Stack:** React 19, Vite 6, Tailwind v4, framer-motion, lucide-react v1.18, react-icons (installed). All brand icons (`SiPython`, `SiDjango`, `SiPostgresql`, `SiCelery`, `SiRedis`, `SiReact`, `SiThreedotjs`, `SiFramer`, `SiTailwindcss`, `SiVite`, `SiNumpy`, `SiScipy`) and lucide fallbacks verified present.

**Verification approach:** No test runner; visual deliverables. Each task ends with `npm run lint` (+ `npm run build` where structural) and a manual checklist at the end.

**Git note:** Not a git repo. Treat "Commit" steps as checkpoints unless `git init` is run first.

---

## File Structure

**Create:**
- `src/components/ui/ScrollReelTestimonials.jsx` — ported carousel widget.
- `src/data/skill-icons.jsx` — `getSkillIcon(name)` → icon component map.

**Modify:**
- `src/index.css` — scroll-reel keyframes + base classes + `.reel-cell`.
- `src/components/sections/About.jsx` — heading + reel; `ABOUT_REEL` data.
- `src/data/profile.js` — `photo: '/me.png'`.
- `src/data/skills.js` — items become `{ name, blurb }`.
- `src/components/ui/SkillMarqueeColumn.jsx` — larger `SkillCard` with logo + blurb.
- `src/components/sections/Skills.jsx` — wire icons + blurbs.
- `src/data/projects.js` — add `image: ''` per project.
- `src/components/sections/ProjectCard.jsx` — image/placeholder media area.
- `src/components/sections/Projects.jsx` — Reveal grid (remove fan-out).

---

## Task 1: Scroll-reel CSS (keyframes, char/exit, reel-cell)

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add `.reel-cell` to `@layer components`**

In `src/index.css`, inside `@layer components { ... }`, after the `.marquee-fade`
rule, add:

```css
  /* Blurred placeholder tile in the scroll reel (theme-aware) */
  .reel-cell {
    flex-shrink: 0;
    border-radius: 0.75rem;
    border: 1px solid color-mix(in oklab, var(--color-ink) 10%, transparent);
    background: linear-gradient(
      to bottom,
      color-mix(in oklab, var(--color-ink) 7%, transparent),
      color-mix(in oklab, var(--color-ink) 3%, transparent)
    );
    filter: blur(1px);
  }

  /* Per-character rise for the reel quote text */
  .scroll-reel-char {
    display: inline-block;
    opacity: 0;
    transform: translateY(0.6em);
    animation: scroll-reel-char-rise 0.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
  }

  /* Whole-block exit before the next quote rises in */
  .scroll-reel-exit {
    animation: scroll-reel-exit 240ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
  }
```

- [ ] **Step 2: Add the reel keyframes**

In `src/index.css`, at the end of the file, append:

```css
@keyframes scroll-reel-char-rise {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scroll-reel-exit {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-12px);
  }
}
```

- [ ] **Step 3: Verify build**

Run: `cd "/home/billel/Desktop/claude code/portfolio" && npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/index.css && git commit -m "style: scroll-reel keyframes + reel-cell"
```

---

## Task 2: ScrollReelTestimonials component (ported to JSX)

**Files:**
- Create: `src/components/ui/ScrollReelTestimonials.jsx`

- [ ] **Step 1: Create the ported component**

Create `src/components/ui/ScrollReelTestimonials.jsx` with this exact content
(JSX; shadcn tokens remapped to project tokens; `dark:` variants removed):

```jsx
import * as React from 'react'

/* Counter-rotating scroll reel + per-character text rise.
 * Ported from the shadcn/TSX original to JSX + this project's tokens. */

const CELL = 121.33
const GAP = 8
const STEP = 3 * (CELL + GAP)

const EXIT_MS = 240
const SLIDE_MS = 800
const EASE_INOUT = 'cubic-bezier(0.65,0,0.35,1)'

const QUOTE_CLASSES =
  'm-0 text-lg font-medium leading-[1.3] tracking-[-0.02em] text-ink sm:text-[22px]'
const AUTHOR_CLASSES = 'm-0 text-sm font-medium leading-[1.3] text-muted'

const FEATURED_SHADOW =
  '0 1.008px 0.705px -0.563px rgba(0,0,0,0.18), 0 2.389px 1.672px -1.125px rgba(0,0,0,0.17), 0 4.357px 3.05px -1.688px rgba(0,0,0,0.17), 0 7.244px 5.07px -2.25px rgba(0,0,0,0.16), 0 11.698px 8.188px -2.813px rgba(0,0,0,0.15), 0 19.148px 13.404px -3.375px rgba(0,0,0,0.13), 0 32.972px 23.08px -3.938px rgba(0,0,0,0.09), 0 60px 42px -4.5px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.6)'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Cell() {
  return <div aria-hidden="true" className="reel-cell" style={{ width: CELL, height: CELL }} />
}

function Featured({ src, alt }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10"
      style={{ width: CELL, height: CELL, boxShadow: FEATURED_SHADOW }}
    >
      <img
        src={src}
        alt={alt ?? ''}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] bg-white mix-blend-saturation"
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

function Chars({ text, startIndex, staggerMs }) {
  let idx = startIndex
  const words = text.split(' ')
  return (
    <>
      {words.map((word, wi) => {
        const wordSpan = (
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs
              idx++
              return (
                <span key={ci} className="scroll-reel-char" style={{ animationDelay: `${delay}ms` }}>
                  {ch}
                </span>
              )
            })}
          </span>
        )
        if (wi < words.length - 1) idx++
        return (
          <React.Fragment key={wi}>
            {wordSpan}
            {wi < words.length - 1 ? ' ' : null}
          </React.Fragment>
        )
      })}
    </>
  )
}

export function ScrollReelTestimonials({ testimonials, charStaggerMs = 6, className }) {
  const [index, setIndex] = React.useState(0)
  const [displayIndex, setDisplayIndex] = React.useState(0)
  const [exiting, setExiting] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const animating = React.useRef(false)
  const timeouts = React.useRef([])

  const count = testimonials.length

  React.useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setMounted(true)),
    )
    const pending = timeouts.current
    return () => {
      cancelAnimationFrame(raf)
      pending.forEach(clearTimeout)
    }
  }, [])

  const paginate = React.useCallback(
    (dir) => {
      if (animating.current) return
      const next = index + dir
      if (next < 0 || next >= count) return
      animating.current = true

      setIndex(next)
      setExiting(true)

      timeouts.current.push(
        setTimeout(() => {
          setDisplayIndex(next)
          setExiting(false)
        }, EXIT_MS),
      )
      timeouts.current.push(
        setTimeout(() => {
          animating.current = false
        }, SLIDE_MS),
      )
    },
    [index, count],
  )

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      paginate(1)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      paginate(-1)
    }
  }

  const middleItems = React.useMemo(() => {
    const items = []
    for (let i = 0; i < 3; i++) items.push({ type: 'cell' })
    testimonials.forEach((_, i) => {
      items.push({ type: 'featured', i })
      if (i < count - 1) {
        items.push({ type: 'cell' }, { type: 'cell' })
      }
    })
    for (let i = 0; i < 3; i++) items.push({ type: 'cell' })
    return items
  }, [testimonials, count])

  const sideCellCount = 4 + 2 * count
  const centerIdx = (count - 1) / 2
  const middleY = (centerIdx - index) * STEP
  const sideY = -middleY

  const colStyle = (y) => ({
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE_INOUT}` : 'none',
  })

  const current = testimonials[displayIndex]

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="About me"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        'glass relative flex w-full max-w-[1060px] flex-col items-stretch gap-2.5 overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent md:min-h-[320px] md:flex-row',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="relative h-56 w-full shrink-0 self-stretch overflow-hidden md:h-auto md:w-[380px]"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>

          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(middleY)}
          >
            {middleItems.map((item, i) =>
              item.type === 'featured' ? (
                <Featured
                  key={i}
                  src={testimonials[item.i].image}
                  alt={testimonials[item.i].alt}
                />
              ) : (
                <Cell key={i} />
              ),
            )}
          </div>

          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch px-5 py-7 md:py-10">
        <div className="flex flex-col gap-[9px]">
          <svg
            className="block h-12 w-12 text-muted/40"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4.58 17.32C3.55 16.23 3 15 3 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18zm10 0C13.55 16.23 13 15 13 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18z" />
          </svg>

          <div className="relative w-full max-w-[390px] overflow-hidden" aria-live="polite">
            <div aria-hidden="true" className="invisible flex min-h-[140px] flex-col gap-[19px]">
              <p className={QUOTE_CLASSES}>{current.quote}</p>
              <p className={AUTHOR_CLASSES}>{current.author}</p>
            </div>
            <div
              key={displayIndex}
              className={cn(
                'absolute inset-x-0 top-0 flex flex-col gap-[19px] will-change-[transform,opacity]',
                exiting && 'scroll-reel-exit',
              )}
            >
              <p className={QUOTE_CLASSES}>
                <Chars text={current.quote} startIndex={0} staggerMs={charStaggerMs} />
              </p>
              <p className={AUTHOR_CLASSES}>
                <Chars
                  text={current.author}
                  startIndex={current.quote.length + 6}
                  staggerMs={charStaggerMs}
                />
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-1.5 md:mt-0">
          <button
            type="button"
            onClick={() => paginate(-1)}
            disabled={index === 0}
            aria-label="Previous"
            className="grid h-6 w-6 cursor-pointer place-items-center rounded-full border border-ink/15 bg-transparent p-0 text-ink transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:enabled:scale-[1.08] active:enabled:scale-[0.94] disabled:cursor-default disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg
              className="h-3 w-3 opacity-70"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.5 2.5 3.5 6l4 3.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            disabled={index === count - 1}
            aria-label="Next"
            className="grid h-6 w-6 cursor-pointer place-items-center rounded-full border border-ink/15 bg-transparent p-0 text-ink transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:enabled:scale-[1.08] active:enabled:scale-[0.94] disabled:cursor-default disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg
              className="h-3 w-3 opacity-70"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m4.5 2.5 4 3.5-4 3.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify lint + build**

Run: `cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ScrollReelTestimonials.jsx && git commit -m "feat: port scroll-reel testimonials to jsx"
```

---

## Task 3: About uses the reel + profile photo

**Files:**
- Modify: `src/data/profile.js`
- Modify: `src/components/sections/About.jsx`

- [ ] **Step 1: Point profile photo at me.png**

In `src/data/profile.js`, change the `photo` line to:

```js
  photo: '/me.png', // EDIT: your portrait in /public
```

- [ ] **Step 2: Rewrite `About.jsx`**

Replace the entire contents of `src/components/sections/About.jsx` with:

```jsx
import { profile } from '@/data/profile'
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

export function About() {
  return (
    <section id="about" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="About me"
          title="Where mathematics meets the backend."
          description="A full-stack Django developer and 4th-year Modeling & Simulation student."
          align="center"
        />

        <Reveal className="mt-14 flex justify-center">
          <ScrollReelTestimonials testimonials={ABOUT_REEL} />
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify lint + build**

Run: `cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build`
Expected: pass.

Manual (user): About shows a heading + the reel; me.png appears in the featured
tiles; arrows/left-right keys cycle 3 first-person lines with per-char animation.

- [ ] **Step 4: Commit**

```bash
git add src/data/profile.js src/components/sections/About.jsx && git commit -m "feat: about section uses scroll-reel with me.png"
```

---

## Task 4: Skill blurbs + brand-logo map

**Files:**
- Modify: `src/data/skills.js`
- Create: `src/data/skill-icons.jsx`

- [ ] **Step 1: Add blurbs to `skills.js` (items become objects)**

Replace the entire contents of `src/data/skills.js` with:

```js
// EDIT: tune categories, items and blurbs to match your stack.
export const skillGroups = [
  {
    id: 'backend',
    title: 'Backend',
    accent: '#38bdf8',
    blurb: 'Production web systems and APIs.',
    items: [
      { name: 'Python', blurb: 'My primary language for backend and modeling.' },
      { name: 'Django', blurb: 'Data models, auth and server-rendered apps.' },
      { name: 'Django REST Framework', blurb: 'Typed, versioned JSON APIs.' },
      { name: 'PostgreSQL', blurb: 'Relational schema design and queries.' },
      { name: 'Celery', blurb: 'Background jobs and scheduled tasks.' },
      { name: 'Redis', blurb: 'Caching and the Celery broker.' },
    ],
  },
  {
    id: 'simulation',
    title: 'Simulation & Modeling',
    accent: '#a855f7',
    blurb: 'The math behind the systems.',
    items: [
      { name: 'Mathematical modeling', blurb: 'Turning real systems into equations.' },
      { name: 'Numerical methods', blurb: 'Solving what has no closed form.' },
      { name: 'Algorithms & data structures', blurb: 'The bedrock of correct, fast code.' },
      { name: 'NumPy / SciPy', blurb: 'Vectorized math and scientific tooling.' },
      { name: 'Monte Carlo methods', blurb: 'Estimating behavior through sampling.' },
      { name: 'Discrete-event simulation', blurb: 'Modeling queues and processes over time.' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend & 3D Web',
    accent: '#22d3ee',
    blurb: 'Interfaces that feel alive.',
    items: [
      { name: 'React', blurb: 'Component-driven, stateful UIs.' },
      { name: 'React Three Fiber', blurb: 'Declarative 3D scenes in React.' },
      { name: 'Three.js', blurb: 'WebGL rendering under the hood.' },
      { name: 'Framer Motion', blurb: 'Fluid, physics-based animation.' },
      { name: 'Tailwind CSS', blurb: 'Token-driven styling at speed.' },
      { name: 'Vite', blurb: 'Fast dev server and bundler.' },
    ],
  },
]
```

- [ ] **Step 2: Create the icon map**

Create `src/data/skill-icons.jsx`:

```jsx
import { Binary, Dices, FunctionSquare, Server, Sigma, Workflow } from 'lucide-react'
import {
  SiCelery,
  SiDjango,
  SiFramer,
  SiNumpy,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiTailwindcss,
  SiThreedotjs,
  SiVite,
} from 'react-icons/si'

// Brand marks where they exist; lucide fallbacks for concept skills.
const ICONS = {
  Python: SiPython,
  Django: SiDjango,
  'Django REST Framework': Server,
  PostgreSQL: SiPostgresql,
  Celery: SiCelery,
  Redis: SiRedis,
  'Mathematical modeling': Sigma,
  'Numerical methods': FunctionSquare,
  'Algorithms & data structures': Binary,
  'NumPy / SciPy': SiNumpy,
  'Monte Carlo methods': Dices,
  'Discrete-event simulation': Workflow,
  React: SiReact,
  'React Three Fiber': SiThreedotjs,
  'Three.js': SiThreedotjs,
  'Framer Motion': SiFramer,
  'Tailwind CSS': SiTailwindcss,
  Vite: SiVite,
}

export function getSkillIcon(name) {
  return ICONS[name] ?? Server
}
```

- [ ] **Step 3: Verify build**

Run: `cd "/home/billel/Desktop/claude code/portfolio" && npm run build`
Expected: pass (skills.js not yet consumed in new shape until Task 5 — build
still compiles since `skill-icons.jsx` is standalone).

- [ ] **Step 4: Commit**

```bash
git add src/data/skills.js src/data/skill-icons.jsx && git commit -m "feat: skill blurbs + brand-logo map"
```

---

## Task 5: Bigger skill cards + wire icons

**Files:**
- Modify: `src/components/ui/SkillMarqueeColumn.jsx`
- Modify: `src/components/sections/Skills.jsx`

- [ ] **Step 1: Enlarge `SkillCard`**

Replace the entire contents of `src/components/ui/SkillMarqueeColumn.jsx` with:

```jsx
import { Fragment } from 'react'

export function SkillCard({ name, blurb, icon: Icon, accent }) {
  return (
    <div className="liquid-glass flex w-full items-start gap-4 p-6">
      <span
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        <Icon size={26} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-base font-semibold leading-5">{name}</p>
        <p className="mt-1.5 text-sm leading-snug text-muted">{blurb}</p>
      </div>
    </div>
  )
}

export function SkillMarqueeColumn({ cards, duration = 18, className = '' }) {
  return (
    <div className={className}>
      <div
        className="skill-track flex flex-col gap-5"
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {cards.map((card, index) => (
              <SkillCard key={`${copy}-${index}`} {...card} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire icons + blurbs in `Skills.jsx`**

Replace the entire contents of `src/components/sections/Skills.jsx` with:

```jsx
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SkillCard, SkillMarqueeColumn } from '@/components/ui/SkillMarqueeColumn'
import { skillGroups } from '@/data/skills'
import { getSkillIcon } from '@/data/skill-icons'

const DURATIONS = [20, 26, 23]

// Build per-item cards carrying the brand/concept icon + group accent.
const columns = skillGroups.map((group) => ({
  id: group.id,
  cards: group.items.map((item) => ({
    name: item.name,
    blurb: item.blurb,
    icon: getSkillIcon(item.name),
    accent: group.accent,
  })),
}))

export function Skills() {
  return (
    <section id="skills" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Capabilities"
          title="A stack built on systems thinking."
          description="From the math models underneath to the interfaces on top."
          align="center"
        />

        {/* Marquee columns — md and up */}
        <div className="marquee-fade mt-14 hidden max-h-[680px] justify-center gap-6 overflow-hidden md:flex">
          {columns.map((column, index) => (
            <SkillMarqueeColumn
              key={column.id}
              cards={column.cards}
              duration={DURATIONS[index]}
              className={index === 2 ? 'hidden lg:block' : ''}
            />
          ))}
        </div>

        {/* Static grid — mobile (nothing hidden, no scroll) */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:hidden">
          {columns.flatMap((column) =>
            column.cards.map((card, index) => (
              <SkillCard key={`${column.id}-${index}`} {...card} />
            )),
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify lint + build**

Run: `cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build`
Expected: pass.

Manual (user): skill cards are larger with a brand logo (Python/Django/React
logos etc.), name, and intro line; concept skills show a lucide icon; marquee
scrolls and pauses on hover; mobile shows the static grid.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/SkillMarqueeColumn.jsx src/components/sections/Skills.jsx && git commit -m "feat: bigger skill cards with brand logos + intros"
```

---

## Task 6: Project image cards + grid

**Files:**
- Modify: `src/data/projects.js`
- Modify: `src/components/sections/ProjectCard.jsx`
- Modify: `src/components/sections/Projects.jsx`

- [ ] **Step 1: Add an `image` field to each project**

In `src/data/projects.js`, add an `image: ''` line to each of the four project
objects (after each `category` line). Leave them empty for now. Update the top
comment to:

```js
// EDIT: replace with your real projects, links and stacks.
// Drop screenshots in public/projects/ and set image: '/projects/<file>.png'.
```

For example, the first object becomes:

```js
  {
    id: 'resource-hub',
    title: 'Academic Resource Hub',
    category: 'Django Web App',
    image: '',
    description:
      'A DRF-backed platform for students to upload, search and moderate study materials, replacing an ad-hoc Google Drive workflow.',
    tags: ['Django', 'DRF', 'PostgreSQL'],
    repoUrl: 'https://github.com/your-handle/resource-hub',
    liveUrl: '',
  },
```

Apply the same `image: ''` insertion to the `epidemic-sim`, `pipeline-bot`, and
`queue-model` objects.

- [ ] **Step 2: Add the media area to `ProjectCard`**

Replace the entire contents of `src/components/sections/ProjectCard.jsx` with:

```jsx
export function ProjectCard({ project }) {
  return (
    <div className="liquid-glass flex h-full flex-col overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden border-b border-white/10">
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.08] to-white/[0.02]"
          >
            <span className="eyebrow" style={{ letterSpacing: '0.22em' }}>
              {project.category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
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
    </div>
  )
}
```

- [ ] **Step 3: Rewrite `Projects.jsx` as a Reveal grid**

Replace the entire contents of `src/components/sections/Projects.jsx` with:

```jsx
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/sections/ProjectCard'

export function Projects() {
  return (
    <section id="projects" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Selected work"
          title="Things I've modeled, built and shipped."
          description="Django applications, Python automation, and simulation models."
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2" stagger={0.08}>
          {projects.map((project) => (
            <RevealItem key={project.id}>
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Verify lint + build**

Run: `cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build`
Expected: pass.

Manual (user): projects render as a 2-column grid; each card shows a gradient
placeholder with its category (until an image path is set); cards reveal on
scroll; Code/Live links work.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.js src/components/sections/ProjectCard.jsx src/components/sections/Projects.jsx && git commit -m "feat: project image-card grid (drop fan-out)"
```

---

## Task 7: Full verification pass

**Files:** none

- [ ] **Step 1: Lint + build**

Run: `cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 2: Manual browser checklist (user runs `npm run dev`)**

1. About: heading + scroll-reel; me.png in featured tiles; arrows/keys cycle 3 lines with per-character rise; reel readable in light + dark; cursor torch still reveals color.
2. Skills: bigger cards with correct brand logos + intro lines; concept skills use lucide icons; marquee scrolls + pauses on hover; mobile static grid.
3. Projects: 2-column grid; gradient placeholder shows each category; (after adding files to `public/projects/` + setting `image`) real images appear; links work.

- [ ] **Step 3: Final commit (if needed)**

```bash
git add -A && git commit -m "chore: scroll-reel + skills + projects verification pass"
```

---

## Self-Review Notes

- **Spec coverage:** Feature 1 → Tasks 1–3; Feature 2 → Tasks 4–5; Feature 3 → Task 6. All covered.
- **Name consistency:** `ScrollReelTestimonials({ testimonials, charStaggerMs, className })` matches About usage; `SkillCard({ name, blurb, icon, accent })` matches the `columns` mapping and `getSkillIcon` return; `getSkillIcon(name)` keys match `skills.js` item names exactly (incl. "NumPy / SciPy", "Django REST Framework"); `ProjectCard({ project })` reads `project.image`/`category`/`tags`/`repoUrl`/`liveUrl` matching `projects.js`.
- **react-icons + lucide names:** all verified present before writing this plan.
- **No placeholders:** every code step is complete; `image: ''` is an intentional empty value with a rendered placeholder, not a TODO.
```
