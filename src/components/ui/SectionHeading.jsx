import { Reveal } from './Reveal'

export function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const centered = align === 'center'
  return (
    <Reveal className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  )
}
