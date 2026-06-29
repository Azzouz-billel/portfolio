import { Fragment } from 'react'

export function SkillCard({ name, blurb, icon: Icon, accent, compact = false }) {
  return (
    <div className={`liquid-glass flex w-full items-start ${compact ? 'gap-3 p-4' : 'gap-4 p-6'}`}>
      <span
        className={`grid shrink-0 place-items-center rounded-xl ${compact ? 'h-10 w-10' : 'h-12 w-12'}`}
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        <Icon size={compact ? 20 : 26} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className={`font-semibold leading-5 ${compact ? 'text-sm' : 'text-base'}`}>{name}</p>
        <p className={`mt-1.5 leading-snug text-muted ${compact ? 'text-[13px]' : 'text-sm'}`}>
          {blurb}
        </p>
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
