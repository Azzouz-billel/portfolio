import { SectionHeading } from '@/components/ui/SectionHeading'
import { SkillCard, SkillMarqueeColumn } from '@/components/ui/SkillMarqueeColumn'
import { skillGroups } from '@/data/skills'
import { getSkillIcon } from '@/data/skill-icons'

const DURATIONS = [20, 26, 23]

// Build per-item cards carrying the brand/concept icon + group accent.
const columns = skillGroups.map((group) => ({
  id: group.id,
  title: group.title,
  cards: group.items.map((item) => ({
    name: item.name,
    blurb: item.blurb,
    icon: getSkillIcon(item.name),
    accent: group.accent,
  })),
}))

export function Skills() {
  return (
    <section id="skills" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Capabilities"
          title="A stack built on systems thinking."
          description="From the math models underneath to the interfaces on top."
          align="center"
        />

        {/* Marquee columns — md and up */}
        <div className="marquee-fade mt-14 hidden max-h-[680px] justify-center gap-6 overflow-hidden md:flex">
          {columns.map((column, index) => (
            <SkillMarqueeColumn
              key={column.id}
              cards={column.cards}
              duration={DURATIONS[index]}
              className={index === 2 ? 'hidden lg:block' : ''}
            />
          ))}
        </div>

        {/* Grouped compact list — mobile (nothing hidden, no scroll) */}
        <div className="mt-10 space-y-9 md:hidden">
          {columns.map((column) => (
            <div key={column.id}>
              <h3 className="mb-3 font-display text-xs uppercase tracking-[0.25em] text-muted">
                {column.title}
              </h3>
              <div className="grid gap-3">
                {column.cards.map((card, index) => (
                  <SkillCard key={`${column.id}-${index}`} {...card} compact />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
