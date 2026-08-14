import { profile } from './profile'

// Mobile About: plain paragraphs rendered under the condensed "ABOUT" heading.
// Each paragraph is a list of segments; `kw: true` gets the accent highlight.
export const bio = [
  [
    { text: 'Billel is a ' },
    { text: 'full-stack Django developer', kw: true },
    { text: ' and 4th-year ' },
    { text: 'Modeling & Simulation', kw: true },
    { text: ' student based in Algeria.' },
  ],
  [
    { text: 'He builds backends the way he builds models — from clear first principles up to ' },
    { text: 'systems that stay correct as they scale', kw: true },
    { text: ': clean data models, solid APIs, and interfaces that feel alive.' },
  ],
  [
    { text: 'His simulation background means he reaches for the ' },
    { text: 'underlying math', kw: true },
    { text: ' and reasons about behavior before writing a line of code.' },
  ],
]

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
