# Portfolio — "The Assembly"

A premium, interactive 3D portfolio. Geometric shards scatter at the top of the page and
assemble — piece by piece, bound to scroll — into a glowing icosphere by the contact section.

Built with **Vite + React 19**, **React Three Fiber** + **drei**, **Lenis** smooth scroll,
**Framer Motion**, and **Tailwind CSS v4**.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # serve the production build
npm run lint
```

## Make it yours (edit these)

- `src/data/profile.js` — name, tagline, email, socials, photo, resume.
- `src/data/skills.js` — skill categories and items.
- `src/data/projects.js` — project cards.
- `public/profile-placeholder.svg` — replace with your photo, then point `profile.photo` at it.
- `public/resume.pdf` — add your resume.

## How the 3D mechanic works

- A fixed full-screen `<Canvas>` (`src/three/Scene.jsx`) sits behind normal scrollable HTML.
- `Lenis` reports a `progress` value (0→1) which `App.jsx` writes into a zustand store.
- `src/three/Assembly.jsx` reads that progress every frame and lerps each shard from a
  scattered position to its target on a Fibonacci sphere — with a per-shard delay for the
  "piece by piece" feel. `src/three/geometry.js` precomputes the scatter/target data.

Respects `prefers-reduced-motion`: smooth scroll is disabled and the object starts assembled.
