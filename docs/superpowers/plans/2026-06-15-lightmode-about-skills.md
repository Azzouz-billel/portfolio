# Light Mode + About & Skills Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a muted light theme (navbar toggle, persisted, no-flash), rebuild About (borderless feathered photo + oversized-numeral flowing bio), and turn Skills into vertical auto-scrolling marquee columns.

**Architecture:** Theme is an `html.light` class toggling CSS-variable overrides in `src/index.css`; a `useTheme` hook syncs the class + `localStorage`, and an inline `index.html` script applies it pre-mount. About and Skills are rewritten using new CSS utilities (`.feather-mask`, `.ghost-figure`, `.kw`, `.skill-track`, `.marquee-fade`). The skills marquee uses CSS keyframes (no JS animation lib) for free hover-pause and reduced-motion handling. The existing cursor-torch is unchanged and works in both themes.

**Tech Stack:** React 19, Vite 6, Tailwind v4 (`@theme`), lucide-react v1.18 (`Sun`, `Moon`, `Server`, `Sigma`, `Boxes` — all verified). No new dependencies.

**Verification approach:** No test runner; deliverables are visual. Each task ends with `npm run lint` (and `npm run build` where structural), plus a manual browser checklist at the end.

**Git note:** Not a git repo. Treat "Commit" steps as checkpoints unless `git init` is run first.

---

## File Structure

**Create:**
- `src/hooks/useTheme.js` — theme state ↔ `<html>` class ↔ `localStorage`.
- `src/components/ui/SkillMarqueeColumn.jsx` — one scrolling column + `SkillCard`.

**Modify:**
- `index.html` — inline no-flash theme script.
- `src/index.css` — light-theme token + glass overrides; `.feather-mask`,
  `.ghost-figure`, `.kw`, `.skill-track`, `.marquee-fade` utilities + keyframes.
- `src/components/layout/Navbar.jsx` — sun/moon `ThemeToggle` (desktop + mobile).
- `src/components/sections/About.jsx` — feathered photo + ghost-numeral bio.
- `src/components/sections/Skills.jsx` — marquee columns + mobile grid.

---

## Task 1: Light theme + new CSS utilities

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add light-theme token overrides**

In `src/index.css`, add this block immediately after the closing `}` of the
`@theme { ... }` block (before `@layer base`):

```css
/* Muted light theme — applied when <html> has class "light" */
html.light {
  --color-base: #dcdce2;
  --color-surface: #e7e7ed;
  --color-surface-2: #ffffff00;
  --color-accent: #2563eb;
  --color-accent-2: #0e7490;
  --color-accent-3: #7c3aed;
  --color-ink: #1b1e29;
  --color-muted: #565d70;
  --shadow-glass: 0 18px 50px -26px rgba(15, 18, 30, 0.3);
}
```

- [ ] **Step 2: Add light-theme glass overrides**

In `src/index.css`, at the very end of the file, append:

```css
/* Light-theme glass: frosted white films with dark hairline borders */
html.light .glass,
html.light .liquid-glass {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.55)),
    rgba(255, 255, 255, 0.4);
  border-color: rgba(15, 18, 30, 0.1);
  box-shadow:
    var(--shadow-glass),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

html.light .glass-strong {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.7)),
    rgba(255, 255, 255, 0.5);
  border-color: rgba(15, 18, 30, 0.12);
}

html.light .liquid-glass-pill {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.7)),
    rgba(255, 255, 255, 0.5);
  border-color: rgba(15, 18, 30, 0.12);
  box-shadow:
    0 12px 32px -16px rgba(15, 18, 30, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
```

- [ ] **Step 3: Add the About + Skills utilities to `@layer components`**

In `src/index.css`, inside the `@layer components { ... }` block, before its
closing `}` (right after the `.loader` rule added previously), add:

```css
  /* Borderless photo — edges dissolve into the page */
  .feather-mask {
    -webkit-mask-image: radial-gradient(
      ellipse 72% 72% at 50% 45%,
      #000 50%,
      transparent 82%
    );
    mask-image: radial-gradient(
      ellipse 72% 72% at 50% 45%,
      #000 50%,
      transparent 82%
    );
  }

  /* Oversized outlined ghost numerals/word-marks behind the bio */
  .ghost-figure {
    font-family: var(--font-display);
    font-weight: 700;
    line-height: 0.8;
    color: transparent;
    -webkit-text-stroke: 1.5px color-mix(in oklab, var(--color-ink) 16%, transparent);
  }

  /* Highlighted keyword inside flowing body copy */
  .kw {
    color: var(--color-ink);
    font-weight: 600;
    box-shadow: inset 0 -0.4em 0 color-mix(in oklab, var(--color-accent) 22%, transparent);
  }

  /* Vertical marquee track (skills) — CSS animation gives free hover-pause */
  .skill-track {
    animation: marquee-up linear infinite;
  }
  .skill-track:hover {
    animation-play-state: paused;
  }

  /* Top/bottom fade for the marquee viewport */
  .marquee-fade {
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent,
      black 14%,
      black 86%,
      transparent
    );
    mask-image: linear-gradient(
      to bottom,
      transparent,
      black 14%,
      black 86%,
      transparent
    );
  }
```

- [ ] **Step 4: Add the marquee keyframes**

In `src/index.css`, at the end of the file (after the light glass overrides),
append:

```css
@keyframes marquee-up {
  to {
    transform: translateY(-50%);
  }
}
```

- [ ] **Step 5: Verify the build compiles**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm run build
```
Expected: build succeeds, no CSS errors.

- [ ] **Step 6: Commit**

```bash
git add src/index.css && git commit -m "style: light theme tokens + about/skills utilities"
```

---

## Task 2: Theme toggle (no-flash + hook + navbar button)

**Files:**
- Modify: `index.html`
- Create: `src/hooks/useTheme.js`
- Modify: `src/components/layout/Navbar.jsx`

- [ ] **Step 1: Add the no-flash script to `index.html`**

In `index.html`, add this script inside `<head>`, immediately after the
`<meta name="theme-color" ... />` line:

```html
    <script>
      try {
        if (localStorage.getItem('theme') === 'light') {
          document.documentElement.classList.add('light')
        }
      } catch (e) {}
    </script>
```

- [ ] **Step 2: Create the `useTheme` hook**

Create `src/hooks/useTheme.js`:

```js
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

const getInitialTheme = () => {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (e) {
      // storage unavailable (private mode) — theme still applies for this session
    }
  }, [theme])

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
    [],
  )

  return { theme, toggleTheme }
}
```

- [ ] **Step 3: Add the toggle button to `Navbar.jsx`**

In `src/components/layout/Navbar.jsx`, add these imports after the existing
`framer-motion` import line:

```jsx
import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'
```

Inside the `Navbar` component body, after the `const [menuOpen, setMenuOpen] =
useState(false)` line, add:

```jsx
  const { theme, toggleTheme } = useTheme()
```

Then, in the desktop area, replace this existing block:

```jsx
        <a
          href="#contact"
          className="hidden rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-ink transition-colors hover:bg-accent/20 md:inline-flex"
        >
          Let’s talk
        </a>
```

with:

```jsx
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            aria-pressed={theme === 'light'}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-ink transition-colors hover:bg-white/5"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <a
            href="#contact"
            className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-ink transition-colors hover:bg-accent/20"
          >
            Let’s talk
          </a>
        </div>
```

- [ ] **Step 4: Add a theme toggle to the mobile menu**

In `src/components/layout/Navbar.jsx`, inside the mobile `<ul className="flex
flex-col p-2">`, add this item after the `{LINKS.map(...)}` block (still inside
the `<ul>`):

```jsx
              <li>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-muted hover:bg-white/5 hover:text-ink"
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === 'light' ? 'Dark mode' : 'Light mode'}
                </button>
              </li>
```

- [ ] **Step 5: Verify**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build
```
Expected: lint + build pass.

Manual (user): the navbar shows a sun icon in dark mode; clicking it switches to
a muted light theme and the icon becomes a moon; reloading keeps the chosen theme
with no flash.

- [ ] **Step 6: Commit**

```bash
git add index.html src/hooks/useTheme.js src/components/layout/Navbar.jsx && git commit -m "feat: persisted light/dark theme toggle"
```

---

## Task 3: About — feathered photo + oversized-numeral bio

**Files:**
- Modify: `src/components/sections/About.jsx`

- [ ] **Step 1: Rewrite `About.jsx`**

Replace the entire contents of `src/components/sections/About.jsx` with:

```jsx
import { profile } from '@/data/profile'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

export function About() {
  return (
    <section id="about" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left — borderless, edge-feathered photo */}
        <Reveal>
          <img
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            className="feather-mask mx-auto aspect-[4/5] w-full max-w-sm object-cover"
            loading="lazy"
          />
        </Reveal>

        {/* Right — oversized ghost numerals behind a flowing bio */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="ghost-figure pointer-events-none absolute -top-16 right-0 select-none text-[10rem] sm:text-[13rem]"
          >
            04
          </span>

          <Reveal>
            <SectionHeading
              eyebrow="About me"
              title="Where mathematics meets the backend."
            />
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              I'm a 4th-year <span className="kw">Modeling &amp; Simulation</span> student
              and a junior Python developer who lives in the backend — designing data
              models, <span className="kw">APIs</span>, and the systems that hold them
              together.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              My simulation background shapes how I think: I reach for the underlying
              math, reason about behavior before writing code, and care about systems
              that stay <span className="kw">correct as they scale</span>.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="ghost-figure pointer-events-none absolute -left-1 -top-3 select-none text-5xl"
                >
                  Django
                </span>
                <p className="relative pt-8 text-sm text-muted">Full-stack focus</p>
              </div>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="ghost-figure pointer-events-none absolute -left-1 -top-3 select-none text-5xl"
                >
                  Python
                </span>
                <p className="relative pt-8 text-sm text-muted">Daily driver</p>
              </div>
            </div>
          </Reveal>
        </div>
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
Expected: pass (no unused-import errors — `GlassCard` no longer imported here).

Manual (user): photo on the left has no frame and fades at its edges; the right
side shows a large outlined "04" behind the heading/bio, highlighted keywords,
and "Django"/"Python" ghost word-marks with captions — no boxes.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/About.jsx && git commit -m "feat: borderless feathered photo + oversized-numeral about"
```

---

## Task 4: Skills — vertical marquee columns

**Files:**
- Create: `src/components/ui/SkillMarqueeColumn.jsx`
- Modify: `src/components/sections/Skills.jsx`

- [ ] **Step 1: Create the column + card component**

Create `src/components/ui/SkillMarqueeColumn.jsx`:

```jsx
import { Fragment } from 'react'

export function SkillCard({ name, category, icon: Icon, accent }) {
  return (
    <div className="liquid-glass flex w-full items-center gap-3 p-5">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="truncate font-medium leading-5">{name}</p>
        <p className="text-xs text-muted">{category}</p>
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

- [ ] **Step 2: Rewrite `Skills.jsx`**

Replace the entire contents of `src/components/sections/Skills.jsx` with:

```jsx
import { Boxes, Server, Sigma } from 'lucide-react'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { SkillCard, SkillMarqueeColumn } from '@/components/ui/SkillMarqueeColumn'
import { skillGroups } from '@/data/skills'

const GROUP_ICONS = { backend: Server, simulation: Sigma, frontend: Boxes }
const DURATIONS = [17, 22, 19]

// Flatten each skill group into per-item cards carrying the group's icon/accent.
const columns = skillGroups.map((group) => ({
  id: group.id,
  cards: group.items.map((name) => ({
    name,
    category: group.title,
    icon: GROUP_ICONS[group.id] ?? Server,
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
        <div className="marquee-fade mt-14 hidden max-h-[640px] justify-center gap-6 overflow-hidden md:flex">
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

- [ ] **Step 3: Verify**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build
```
Expected: pass.

Manual (user): on desktop, three columns of skill cards scroll upward at
different speeds, fade at top/bottom, and pause when hovered; on a narrow window
they collapse to a static 1–2 column grid showing every skill; with reduced-motion
the columns are frozen (static).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/SkillMarqueeColumn.jsx src/components/sections/Skills.jsx && git commit -m "feat: vertical auto-scrolling skills marquee"
```

---

## Task 5: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Lint + production build**

Run:
```bash
cd "/home/billel/Desktop/claude code/portfolio" && npm run lint && npm run build
```
Expected: both succeed.

- [ ] **Step 2: Manual browser checklist (user runs `npm run dev`)**

1. Navbar sun/moon toggle flips to a muted light theme; persists across reload; no flash.
2. Light theme: text readable, glass surfaces adapt (frosted white, dark hairline).
3. Cursor torch still reveals color in both themes.
4. About: photo left with no frame, edges feathered; right side has ghost "04" + flowing bio + Django/Python word-marks, no boxes.
5. Skills: 3 columns scroll vertically at different speeds, pause on hover, fade top/bottom; mobile shows a static grid of all skills.
6. Reduced-motion: marquee frozen, no scroll-jank.

- [ ] **Step 3: Final commit (if needed)**

```bash
git add -A && git commit -m "chore: light mode + about/skills verification pass"
```

---

## Self-Review Notes

- **Spec coverage:** Feature 1 → Tasks 1–2; Feature 2 → Tasks 1 (`.feather-mask`) + 3; Feature 3 → Tasks 1 (`.ghost-figure`/`.kw`) + 3; Feature 4 → Tasks 1 (marquee CSS) + 4. All covered.
- **Deviation from spec:** marquee uses CSS keyframes (not framer-motion) — lighter, free hover-pause, automatic reduced-motion. Documented in spec.
- **Name consistency:** `useTheme` returns `{ theme, toggleTheme }` and Navbar uses both; `SkillMarqueeColumn` takes `cards`/`duration`/`className` and `SkillCard` takes `name`/`category`/`icon`/`accent`, matching the `columns` mapping in `Skills.jsx`; `GROUP_ICONS` keys (`backend`/`simulation`/`frontend`) match `skillGroups` ids.
- **No placeholders:** every code step is complete.
```
