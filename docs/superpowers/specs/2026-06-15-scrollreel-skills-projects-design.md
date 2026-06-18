# Scroll-Reel About + Skill Logos + Project Image Cards — Design

Date: 2026-06-15
Status: Approved by user ("confirmed")

## Goal

Replace the About section with a ported scroll-reel quote carousel featuring the
user's photo; enlarge the Skills cards and give each a real brand logo + a
one-line intro; and rebuild Projects as a responsive grid of image cards (drop
the pinned fan-out).

## Constraints & Stack

- JSX, React 19, Vite 6, Tailwind v4 (`@theme` in `src/index.css`).
- Add `react-icons` (tree-shaken brand logos). No `tw-animate-css` (unneeded).
- `me.png` already exists in `public/`.
- Keep the monochrome cursor-torch and light/dark theming working everywhere.
- Accessibility: carousel keeps its `role`/`aria` + keyboard nav; logos are
  decorative (`aria-hidden`); images have alt text; reduced-motion degrades.

## Feature 1 — About → ScrollReelTestimonials (ported)

**Behavior:** About is a centered "About me" heading above the scroll-reel card:
a counter-rotating reel of portrait tiles (all `/me.png`) on the left, and a
rotating first-person quote + facet label + prev/next controls on the right.
Text animates in per-character; the old block exits before the new rises.

**Implementation:**
- New `src/components/ui/ScrollReelTestimonials.jsx` — the provided component
  ported to JSX with these adaptations:
  - shadcn classes → project tokens: `bg-muted`/`border-border`/inset shadow on
    the container → `.glass`; `text-foreground` → `text-ink`;
    `text-muted-foreground` → `text-muted`; control `border-foreground/15` →
    `border-ink/15`; `focus-visible:ring-ring` → `focus-visible:ring-accent`.
  - Placeholder `Cell` uses a new `.reel-cell` class (theme-aware) instead of
    `from-secondary to-card`.
  - `dark:` variants removed (dark is the default theme); light handled by
    `html.light` overrides of `.glass`/`.reel-cell`.
  - `Featured` tile keeps the image + saturation/sheen overlays + shadow.
  - No `tw-animate-css` import.
- `src/index.css` additions: `@keyframes scroll-reel-char-rise`,
  `@keyframes scroll-reel-exit`, and the base rules `.scroll-reel-char`
  (inline-block, opacity 0 + translateY, runs char-rise forwards) and
  `.scroll-reel-exit` (runs exit forwards); `.reel-cell` + `html.light .reel-cell`.
- `src/components/sections/About.jsx`: rewritten to render a `SectionHeading`
  (eyebrow "About me") + `<ScrollReelTestimonials testimonials={ABOUT_REEL} />`,
  centered. `ABOUT_REEL` (defined in the file) = 3 entries, each
  `image: '/me.png'`, `alt: 'Portrait of <name>'`, with the approved first-person
  quotes and facet-label authors. Old bio paragraphs + ghost word-marks removed.
- `src/data/profile.js`: `photo: '/me.png'`.

**Boundary:** Self-contained widget + a thin About wrapper holding its content.

## Feature 2 — Skills: bigger cards, brand logos, intros

**Behavior:** Each skill card is larger and shows a brand logo, the skill name,
and a one-line intro. Layout (vertical marquee on md+, static grid on mobile)
is unchanged.

**Implementation:**
- `npm install react-icons`.
- `src/data/skills.js`: each group's `items` become objects
  `{ name, blurb }` (short intro per skill). Group `id`/`title`/`accent` keep.
- New `src/data/skill-icons.jsx`: maps skill `name` → an icon component, using
  `react-icons/si` brand marks where they exist (Python, Django, PostgreSQL,
  Celery, Redis, React, Three.js, Framer, Tailwind, Vite, NumPy/SciPy) and
  `lucide-react` fallbacks for concept skills (Mathematical modeling, Numerical
  methods, Algorithms & data structures, Monte Carlo methods, Discrete-event
  simulation, DRF). Exposes `getSkillIcon(name)` returning a component (default
  lucide fallback if unmapped).
- `src/components/ui/SkillMarqueeColumn.jsx`: `SkillCard` enlarged — logo in a
  tinted rounded square (group accent), bigger `name`, `blurb` line under it,
  `p-6`. Card accepts `{ name, blurb, icon, accent }`.
- `src/components/sections/Skills.jsx`: build cards from `skillGroups` mapping
  each item via `getSkillIcon(item.name)`; pass `blurb`. Marquee + mobile grid
  unchanged structurally.

**Boundary:** Data (blurbs) + icon map + presentational card. Skills owns wiring.

## Feature 3 — Projects: responsive image-card grid

**Behavior:** A responsive 2-column grid of cards, each with a project image on
top (or a gradient placeholder when no image is set), then category, title,
description, tags, and links. Scroll-revealed. No pinning/fan-out.

**Implementation:**
- `src/data/projects.js`: add `image: ''` to each project (commented drop-in
  instructions: put files in `public/projects/` and set e.g. `/projects/x.png`).
- `src/components/sections/ProjectCard.jsx`: add a top media area — `<img>` with
  `aspect-video object-cover` when `project.image` is set; otherwise a gradient
  placeholder block (category label centered). Keep title/desc/tags/links.
- `src/components/sections/Projects.jsx`: rewrite to a `RevealGroup` 2-column
  grid of `ProjectCard`s. Remove `useScroll`/`useTransform`/`FanCard`/`FAN`/the
  280vh pinned wrapper and the mobile/desktop split.

**Boundary:** Data field + card media + simpler section. Self-contained.

## Data Flow

- About reel content: local `ABOUT_REEL` const in About.jsx.
- Skills: `skillGroups` (with blurbs) + `getSkillIcon` map → cards.
- Projects: `projects` (with image paths) → cards with image/placeholder.

## Testing & Verification

No test runner; visual deliverables. Verify `npm run lint` + `npm run build`,
then manually: (a) About reel cycles with per-char text + working arrows/keys,
photo tiles show me.png; (b) reel readable in light + dark, torch still reveals
color; (c) skill cards bigger with correct brand logos + intros, marquee scrolls
+ pauses on hover, mobile grid intact; (d) projects grid shows images or
placeholders, links work, reveals on scroll.

## Out of Scope

- Real project images (user drops them into `public/projects/` later).
- Real third-party testimonials (reel uses the user's own about-me lines).
- Removing now-unused `GlassCard`.
