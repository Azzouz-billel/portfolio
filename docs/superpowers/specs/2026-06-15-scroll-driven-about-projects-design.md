# Scroll-Driven About Reel + Pinned Project Fan-Out — Design

Date: 2026-06-15
Status: Approved by user ("confirmed")

## Goal

Make the About scroll-reel advance by scroll instead of arrow buttons (pinned),
restore the Projects pinned fan-out using the new image cards at a slightly
smaller size, and make the About reel portrait show its original colors on hover.

## Constraints & Stack

- JSX, React 19, Vite 6, Tailwind v4, framer-motion (installed). No new deps.
- Keep the global cursor torch + light/dark theming working.
- Accessibility: scroll-driven mode hides arrows on desktop; the reduced-motion /
  mobile fallback keeps the arrow-driven (keyboard-accessible) reel and the
  static projects grid. Respect `prefers-reduced-motion`.

## Feature 1 — About reel: scroll-driven (pinned), arrows removed

**Behavior:** On desktop with motion, the About section pins to the viewport;
scroll progress selects the active quote (index 0 → 1 → 2), each change playing
the existing per-character rise + reel slide. No arrow buttons. On reduced-motion
or small screens it falls back to the current arrow-driven, non-pinned reel.

**Implementation:**
- `ScrollReelTestimonials.jsx`: add an optional `activeIndex` prop.
  - When `activeIndex` is a number → **controlled**: an effect drives the
    exit→swap transition whenever it changes (reusing the existing `exiting` /
    `displayIndex` logic and the `animating` lock so transitions don't overlap;
    after a transition resolves, the component reconciles to the latest
    `activeIndex` if it moved during the lock). Arrow controls are not rendered.
  - When `activeIndex` is `undefined` → **uncontrolled**: current behavior with
    arrows + keyboard nav (the fallback path uses this).
- `About.jsx`:
  - Desktop + motion: a pinned wrapper (`~300vh`, sticky inner `h-screen`,
    centered). `useScroll` on the wrapper → `scrollYProgress`; map progress to an
    index in `[0, count-1]` via `useMotionValueEvent` into local state; render
    `<ScrollReelTestimonials testimonials={ABOUT_REEL} activeIndex={index} />`.
  - Reduced-motion: render `<ScrollReelTestimonials testimonials={ABOUT_REEL} />`
    (uncontrolled, arrows) without pinning.
  - Uses `usePrefersReducedMotion`. A scroll-hint ("scroll to read more ↓") shows
    on desktop.

**Boundary:** Component gains a controlled mode; About owns the scroll→index map.

## Feature 2 — About reel photo: color on hover

**Behavior:** The featured portrait (`me.png`) is desaturated by default and
shows its **original colors when hovered**.

**Implementation:** In `ScrollReelTestimonials.jsx`, the `Featured` tile becomes
a `group`; its `mix-blend-saturation` desaturation overlay gets
`transition-opacity` + `group-hover:opacity-0`, so hovering reveals true color
(complemented by the cursor torch already revealing color at the pointer).

**Boundary:** Local change to the `Featured` sub-component.

## Feature 3 — Projects: pinned fan-out with smaller image cards

**Behavior:** Restore the pinned scroll-split: the section pins, project cards
start stacked and fan out on scroll, each card being the new image card, sized a
bit smaller. Reduced-motion / mobile keeps the static 2-column grid.

**Implementation:**
- `Projects.jsx`: reintroduce the pinned wrapper (`~280vh`, sticky inner) with
  `useScroll` + a `FanCard` that maps `scrollYProgress` to per-card
  `rotate`/`x`/`y` (stacked → fanned), rendering `<ProjectCard>` inside. Card
  width ≈ `max-w-xs` (smaller than the grid). Desktop+motion only (`hidden
  lg:block`); the existing static `RevealGroup` grid stays for mobile /
  reduced-motion (`lg:hidden` or when reduced-motion).
- `ProjectCard.jsx` is unchanged (image-on-top card); it just renders smaller
  inside the fan.

**Boundary:** Projects section regains fan logic; ProjectCard untouched.

## Data Flow

- About: `scrollYProgress` → index state → `activeIndex` prop.
- Projects: `scrollYProgress` → per-card transforms in `FanCard`.
- Content data (`ABOUT_REEL`, `projects`) unchanged in shape.

## Testing & Verification

No test runner; visual. Verify `npm run lint` + `npm run build`, then manually:
(a) About pins and scroll cycles the 3 quotes with per-char animation, no arrows;
(b) hovering the reel photo shows original color; (c) reduced-motion About shows
the arrow reel, no pin; (d) Projects pins and cards fan out on scroll as smaller
image cards; (e) mobile/reduced-motion Projects shows the static grid.

## Out of Scope

- Real project images (placeholders remain until user adds files).
- Changing project-image hover behavior (already handled by the global torch).
