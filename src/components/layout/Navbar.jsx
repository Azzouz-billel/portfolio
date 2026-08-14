import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

import { useScrollStore } from '@/store/scroll'
import { useTheme } from '@/hooks/useTheme'
import { profile } from '@/data/profile'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export function Navbar() {
  const activeSection = useScrollStore((state) => state.section)
  const setSection = useScrollStore((state) => state.setSection)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const sections = ['hero', ...LINKS.map((link) => link.id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setSection(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [setSection])

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6">
      <nav className="relative mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-base/95 px-4 py-3 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.9)] backdrop-blur-md sm:px-6">
        {/* Mobile: hamburger left */}
        <button
          type="button"
          className="md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="block h-0.5 w-6 rounded bg-ink transition-transform" />
          <span className="mt-1.5 block h-0.5 w-6 rounded bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 rounded bg-ink" />
        </button>

        {/* Centered on mobile, left-aligned on desktop */}
        <a
          href="#top"
          className="absolute left-1/2 -translate-x-1/2 font-condensed text-lg uppercase tracking-[0.25em] md:static md:translate-x-0"
        >
          {profile.shortName}
          <span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={[
                  'rounded-full px-4 py-2 text-sm transition-colors duration-200',
                  activeSection === link.id
                    ? 'text-accent'
                    : 'text-muted hover:text-ink',
                ].join(' ')}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

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

        {/* Mobile: theme toggle right */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle light and dark theme"
          aria-pressed={theme === 'light'}
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-white/5 md:hidden"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-base/95 backdrop-blur-md md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex flex-col p-2">
              {LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm text-muted hover:bg-white/5 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
