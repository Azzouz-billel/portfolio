# Light Mode + About & Skills Redesign — Design

Date: 2026-06-15
Status: Approved by user ("approved, go to work")

## Goal

Add a muted light theme with a navbar toggle, rebuild the About section
(borderless feathered photo on the left, oversized-numeral + flowing-bio layout
on the right), and convert the Skills section into vertical auto-scrolling
marquee columns. Keep the existing monochrome cursor-torch behavior intact in
both themes.

## Constraints & Stack

- JSX, React 19, Vite 6, Tailwind v4 (`@theme` CSS variables in `src/index.css`).
- No new npm dependencies. The skills marquee uses CSS keyframes (not the
  prompt's `motion` package, and not framer-motion) — lighter and gives free
  hover-pause + reduced-motion handling.
- `lucide-react` v1.18 (already installed) provides `Sun`, `Moon`, `Server`,
  `Sigma`, `Boxes` — all verified present.
- Theme is driven purely by an `html.light` class toggling CSS-variable
  overrides; components stay theme-agnostic.
- Accessibility: toggle is a real `<button>` with `aria-label`/`aria-pressed`;
  reduced-motion freezes the marquee; light theme keeps text contrast ≥ 4.5:1.

## Feature 1 — Muted light theme + navbar toggle

**Behavior:** Site loads dark. A sun/moon button in the navbar flips the theme;
the choice persists in `localStorage` under key `theme`. An inline script in
`index.html` applies the saved class before React mounts (no flash).

**Implementation:**
- `index.html`: add a tiny head script that reads `localStorage.theme` and adds
  `class="light"` to `<html>` when stored value is `light`.
- New `src/hooks/useTheme.js`: state seeded from the current `<html>` class;
  an effect toggles the class and writes `localStorage`. Returns `{ theme,
  toggle }`.
- `Navbar.jsx`: a `ThemeToggle` button (desktop bar + mobile menu) using `Sun`/
  `Moon`.
- `src/index.css`: `html.light { ... }` overrides for the `@theme` color tokens
  (`--color-base`, `--color-surface`, `--color-ink`, `--color-muted`, and
  slightly deeper accents for contrast). Plus `html.light` overrides for
  `.glass`, `.glass-strong`, `.liquid-glass`, `.liquid-glass-pill` (white frosted
  fills, dark hairline borders, softer shadows).
- `<meta name="color-scheme">`/`theme-color` left as-is (dark default is fine).

**Torch interaction:** The cursor-torch overlay (`backdrop-filter: grayscale(1)`
+ radial mask) is theme-independent and unchanged — grayscale of the muted light
palette reads as light grey, color blooms at the pointer exactly as in dark.

**Boundary:** One hook + one button + CSS overrides. No other component changes.

## Feature 2 — About: borderless feathered photo (left)

**Behavior:** The photo sits on the left with no frame; its edges dissolve into
the page via a radial mask. Monochrome by default, color under the torch.

**Implementation:**
- `src/index.css`: `.feather-mask` utility (radial `mask-image` with `-webkit-`
  prefix) that fades the image edges to transparent.
- `About.jsx`: left column renders `profile.photo` with `.feather-mask`, no
  card/border. Placeholder (`/profile-placeholder.svg`) until the user drops a
  real PNG into `/public` and points `profile.photo` at it.

## Feature 3 — About: oversized stats + flowing bio (right)

**Behavior:** No cards. Large translucent outlined numerals/word-marks sit behind
the bio; bio text flows with highlighted keywords; content reveals on scroll.

**Implementation:**
- `src/index.css`: `.ghost-figure` utility (display font, transparent fill,
  `-webkit-text-stroke` in a theme-aware `color-mix` of `--color-ink`) and a
  `.kw` keyword-highlight class (accent color + subtle underline).
- `About.jsx`: right column is a relative container with absolutely-positioned
  ghost figures (`04`, plus "Django"/"Python" word-marks) behind the bio
  paragraphs; the three `GlassCard` stat boxes are removed. Existing `Reveal`
  drives scroll-in.

**Boundary:** Self-contained section rewrite; depends only on `profile` and CSS
utilities.

## Feature 4 — Skills: vertical marquee columns

**Behavior:** On md+ screens, three columns of skill cards scroll upward at
different speeds with a top/bottom fade mask, pausing on hover. On small screens,
a static grid of all skill cards (nothing hidden).

**Implementation:**
- `src/index.css`: `@keyframes marquee-up` (translateY 0 → -50%), `.skill-track`
  (`animation: marquee-up linear infinite`, `:hover` → `animation-play-state:
  paused`), and `.marquee-fade` (linear-gradient mask, both prefixes). Global
  reduced-motion rule already freezes the animation.
- New `src/components/ui/SkillMarqueeColumn.jsx`: renders a `.skill-track` div
  containing the column's cards duplicated twice (for seamless loop); accepts
  `skills`, `duration`, `className`. Includes a `SkillCard` (liquid-glass, icon
  circle tinted with the group accent + name + category).
- `Skills.jsx`: maps `skillGroups` → one column per group (icon per group:
  backend→`Server`, simulation→`Sigma`, frontend→`Boxes`), each with a distinct
  duration. Renders marquee columns inside a `.marquee-fade` flex container on
  md+ and a static `SkillCard` grid on mobile.

**Boundary:** Column component is presentational; Skills owns the data mapping.

## Data Flow

- Theme: `useTheme` ↔ `<html>` class ↔ CSS variables. No global store.
- Skills: existing `skillGroups` data, mapped to cards in `Skills.jsx`.
- Pointer/torch: unchanged from the prior redesign.

## Testing & Verification

No test runner; deliverables are visual. Verify with `npm run lint` + `npm run
build`, then manual browser checks: (a) toggle flips theme and persists across
reload with no flash; (b) light theme is muted, text readable, glass adapts;
(c) torch still reveals color in both themes; (d) About photo has no frame and
fades at edges; (e) About right shows ghost numerals + flowing bio, no boxes;
(f) Skills columns scroll, pause on hover, fade top/bottom, and degrade to a
static grid on mobile / reduced-motion.

## Out of Scope

- Replacing the placeholder photo (user provides the PNG).
- Per-skill brand icons (lucide has none; category icons used instead).
- Removing unused `three`/R3F deps.
