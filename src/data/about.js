import { profile } from './profile'

// EDIT: your About reel. Each entry = one featured photo + a line of text.
// To use more / different photos, drop them in /public and point `image` at
// each one (e.g. '/me-2.png'). Add or remove entries freely — the reel and the
// scroll mapping adapt to however many you list.
export const aboutReel = [
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
    image: '/1.png',
    alt: `Portrait of ${profile.name}`,
  },
  {
    quote:
      'I care about systems that stay correct as they scale — clean data models, solid APIs, and interfaces that feel alive.',
    author: 'The approach',
    image: '/2.png',
    alt: `Portrait of ${profile.name}`,
  },
]
