import { profile } from '@/data/profile'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with React, R3F & Three.js.
        </p>
        <div className="flex items-center gap-5">
          {profile.socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-accent"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
