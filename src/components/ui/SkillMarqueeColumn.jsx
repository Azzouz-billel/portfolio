import { Fragment } from 'react'

export function SkillCard({ name, blurb, icon: Icon, accent }) {
  return (
    <div className="liquid-glass flex w-full items-start gap-4 p-6">
      <span
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        <Icon size={26} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-base font-semibold leading-5">{name}</p>
        <p className="mt-1.5 text-sm leading-snug text-muted">{blurb}</p>
      </div>
    </div>
  )
}

export function SkillMarqueeColumn({ cards, duration = 18, className = '' }) {
  return (
    <div className={className}>
      <div
        className="skill-track flex flex-col gap-5"
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {cards.map((card, index) => (
              <SkillCard key={`${copy}-${index}`} {...card} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
