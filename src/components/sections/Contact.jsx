import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, Mail, MessageSquare, Send, User } from 'lucide-react'

import { profile } from '@/data/profile'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

// lucide dropped brand glyphs, so GitHub/LinkedIn ship as inline SVGs here.
function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function LinkedinIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  )
}

const SOCIAL_ICONS = { GitHub: GithubIcon, LinkedIn: LinkedinIcon, Email: Mail }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Field({ id, label, icon: Icon, value, onChange, error, type = 'text', textarea = false }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div className="relative">
      <span
        className={`pointer-events-none absolute left-4 top-4 transition-colors ${focused ? 'text-accent' : 'text-muted'
          }`}
      >
        <Icon size={18} />
      </span>
      <Tag
        id={id}
        name={id}
        type={textarea ? undefined : type}
        rows={textarea ? 4 : undefined}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={Boolean(error)}
        className={`peer w-full rounded-xl border bg-white/5 pl-11 pr-4 pt-6 pb-2 text-ink outline-none transition-all ${textarea ? 'resize-none' : ''
          } ${error
            ? 'border-rose-400/60'
            : focused
              ? 'border-accent/60 shadow-[0_0_34px_-10px_rgba(56,189,248,0.55)]'
              : 'border-white/10'
          }`}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-11 transition-all ${active ? 'top-2 text-[11px] text-accent' : 'top-4 text-sm text-muted'
          }`}
      >
        {label}
      </label>
      {error && <p className="mt-1 pl-1 text-xs text-rose-300">{error}</p>}
    </div>
  )
}

const BUTTON_LABEL = {
  idle: (
    <>
      Send message <Send size={16} />
    </>
  ),
  sending: (
    <>
      Sending <Loader2 size={16} className="animate-spin" />
    </>
  ),
  sent: (
    <>
      Sent <Check size={16} />
    </>
  ),
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please tell me your name.'
    if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.message.trim().length < 10) next.message = 'A little more detail, please.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // EDIT: swap this mailto handoff for Formspree / EmailJS / your Django API.
  const handleSubmit = (event) => {
    event.preventDefault()
    if (status !== 'idle' || !validate()) return
    setStatus('sending')
    const subject = encodeURIComponent(`Portfolio message from ${form.name || 'someone'}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.setTimeout(() => {
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      setStatus('sent')
    }, 700)
  }

  return (
    <section id="contact" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something that holds together."
            description="Open to internships, junior roles and collaboration on backend or simulation projects."
          />

          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
            {profile.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.label] ?? Mail
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="liquid-glass-pill inline-flex items-center gap-2 px-5 py-3 text-sm text-ink"
                >
                  <Icon size={16} /> {social.label}
                </a>
              )
            })}
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <form onSubmit={handleSubmit} className="liquid-glass space-y-5 p-6 sm:p-8" noValidate>
            <Field
              id="name"
              label="Name"
              icon={User}
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Field
              id="email"
              label="Email"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Field
              id="message"
              label="Message"
              icon={MessageSquare}
              textarea
              value={form.message}
              onChange={handleChange}
              error={errors.message}
            />

            <motion.button
              type="submit"
              disabled={status !== 'idle'}
              whileTap={{ scale: 0.98 }}
              className="liquid-glass-pill flex w-full items-center justify-center gap-2 px-6 py-3 font-display text-sm font-medium text-ink disabled:opacity-80"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  className="inline-flex items-center gap-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {BUTTON_LABEL[status]}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
