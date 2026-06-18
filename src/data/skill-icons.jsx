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
