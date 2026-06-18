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
