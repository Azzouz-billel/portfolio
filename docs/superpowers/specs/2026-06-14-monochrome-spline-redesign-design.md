# Monochrome + Spline Portfolio Redesign — Design

Date: 2026-06-14
Status: Approved (pending spec review)

## Goal

Transform the existing colorful React/Vite/Tailwind portfolio into a monochrome
("black & white") experience where color is revealed only around the cursor,
replace the custom react-three-fiber background with the Spline robot scene,
apply a refined "liquid glass" treatment to all surfaces, rebuild the projects
section as a pinned scroll-driven fan-out, and create an animated contact form.

## Constraints & Stack

- Keep **JSX** (no TypeScript / shadcn) to match the existing codebase and user
  preference. The integration prompts referenced shadcn/TS; we adapt to the repo.
- React 19, Vite 6, Tailwind v4 (`@theme` tokens in `src/index.css`).
- `framer-motion` and `lenis` are already installed. Add
  `@splinetool/react-spline` + `@splinetool/runtime` and `lucide-react`.
- Existing R3F deps (`three`, `@react-three/*`) stay installed but become unused
  in the background. Removal is out of scope.
- Cannot be browser-verified in this sandbox (no Chrome/sudo; Spline loads
  remotely at runtime). User verifies visually.
- Accessibility: respect `prefers-reduced-motion`, keep keyboard focus rings,
  maintain contrast. Color is never the sole carrier of meaning.

## Feature 1 — Global monochrome + cursor color torch

**Behavior:** The page renders in its real colors. A single fixed, full-viewport
overlay sits above content (`pointer-events: none`) applying
`backdrop-filter: grayscale(1)` to everything behind it. A radial `mask-image`
punches a soft-edged hole that follows the cursor, so a circle of true color
appears around the pointer. Because the cursor is on whatever the user hovers,
"touch to reveal" and "move behind them" are the same mechanism.

**Implementation:**
- New `useCursorTorch` hook tracks pointer position; values are spring-eased
  (framer-motion `useSpring`) and written to CSS custom properties
  (`--torch-x`, `--torch-y`, `--torch-r`) on the overlay element via a motion
  value subscription (no React re-render per mouse move).
- New `<CursorTorch />` component renders the overlay. Mask:
  `radial-gradient(circle var(--torch-r) at var(--torch-x) var(--torch-y),
  transparent 0%, transparent 55%, black 100%)`.
- Reveal radius ~220px desktop. Hidden entirely (overlay not rendered) when
  `prefers-reduced-motion` is set or on touch/coarse pointers (`@media
  (hover: none)`), leaving the site in full color in those cases.
- Reveal colors are the existing accent palette already in `@theme`
  (electric blue / cyan / purple) — no new palette needed.

**Boundary:** One component + one hook. Input: pointer events. Output: a visual
overlay. No dependency on other features.

## Feature 2 — Spline robot hero background

**Behavior:** Replace the R3F `Scene` background with the Spline robot, fixed
behind all content, mouse-reactive (native to Spline). Remove the hero photo
frame; hero text occupies the left/center over the scene.

**Implementation:**
- New `src/components/ui/SplineScene.jsx` (lazy-loaded `@splinetool/react-spline`
  with a Suspense loader spinner).
- New `src/components/ui/Spotlight.jsx` (the aceternity white SVG spotlight) and
  `animate-spotlight` keyframes added to CSS.
- `Hero.jsx`: delete the right-column photo block; render `SplineScene` (scene
  URL `https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode`) fixed in
  the background with `Spotlight` overlaid; keep eyebrow/headline/subtitle/CTAs.
- `App.jsx`: remove the lazy R3F `<Scene>` mount. The base background color
  `#05060d` already prevents flash while Spline loads.
- Reduced-motion: render a static dark gradient fallback instead of Spline.

**Boundary:** `SplineScene` and `Spotlight` are standalone presentational
components consumed by `Hero`. Background ownership moves from `App` to `Hero`.

## Feature 3 — Liquid glass surfaces

**Behavior:** All boxes (nav, cards, form fields, buttons) use a refined glass
matching the "Liquid Glass" pill reference: deep translucent black, strong blur,
gradient hairline border, soft outer bloom, inner top highlight.

**Implementation:**
- Replace `.glass` / `.glass-strong` in `src/index.css` with a `.liquid-glass`
  component utility (and keep a `.liquid-glass-pill` variant for the CTA button).
- `GlassCard.jsx` and `CTAButton.jsx` adopt the new classes; the primary CTA
  becomes the pill.
- Tokens: add radius/shadow/border CSS variables to `@theme` rather than
  hardcoding values in components.

**Boundary:** Pure CSS tokens + two component class swaps. No JS logic.

## Feature 4 — Projects: pinned scroll-driven fan-out

**Behavior:** The section pins to the viewport while scrolling; cards begin as a
tight liquid-glass stack and fan out (rotate + translate to per-card angles)
driven by scroll progress, then release.

**Implementation:**
- `Projects.jsx` wrapped in a tall (`~250vh`) container with a `sticky` inner
  viewport. `useScroll({ target, offset })` → `scrollYProgress`.
- Each card maps progress through `useTransform` to its own rotation/x/y/scale,
  interpolating from stacked (all near 0° center) to fanned (spread angles).
- Color blooms via the cursor torch (Feature 1) — no per-card color logic.
- Reduced-motion / `(hover: none)` / narrow viewports: render a plain vertical
  list of liquid-glass cards, no pin, no transforms.

**Boundary:** Self-contained section. Depends only on scroll progress and the
`projects` data array.

## Feature 5 — Creative animated contact form

**Behavior:** A liquid-glass form with floating labels, a focus glow that tracks
the active field, an animated submit button (idle → sending → sent ✓), inline
validation, and social links as glass pills.

**Implementation:**
- Rework `Contact.jsx`: controlled inputs with floating-label animation
  (label transforms on focus/filled). Track focused field in state to drive the
  glow. Local validation (required + email shape) shown inline.
- Submit button has three visual states via framer-motion; keeps the existing
  `mailto:` handoff (clearly marked swappable for Formspree/EmailJS/Django).
- `lucide-react` icons for fields/socials/send.

**Boundary:** Single section component with local state; no global state.

## Data Flow

- Scroll: Lenis → `useScrollStore` (existing) for the progress bar; framer-motion
  `useScroll` reads native scroll for the projects pin. Both already coexist.
- Pointer: `useCursorTorch` → CSS vars on the overlay only.
- Content: existing `src/data/*` (profile, projects, skills) unchanged in shape.

## Testing & Verification

- No automated UI tests exist; this is presentational. Verification is manual in
  the user's browser: (a) torch reveals color and follows cursor; (b) Spline
  robot loads and reacts to mouse; (c) glass surfaces match reference;
  (d) projects fan out on scroll and collapse on reverse; (e) contact form states
  animate and validate; (f) reduced-motion path shows full-color, no pinning,
  static fallback.
- `npm run lint` must pass. `npm run build` must succeed.

## Out of Scope

- Removing unused R3F/three dependencies.
- Wiring the contact form to a real backend.
- TypeScript / shadcn migration.
