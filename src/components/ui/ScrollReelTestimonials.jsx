import * as React from 'react'

/* Counter-rotating scroll reel + per-character text rise.
 * Ported from the shadcn/TSX original to JSX + this project's tokens. */

const CELL = 162
const GAP = 12
const STEP = 3 * (CELL + GAP)

const EXIT_MS = 240
const SLIDE_MS = 800
const EASE_INOUT = 'cubic-bezier(0.65,0,0.35,1)'

const QUOTE_CLASSES =
  'm-0 text-xl font-medium leading-[1.3] tracking-[-0.02em] text-ink sm:text-[28px]'
const AUTHOR_CLASSES = 'm-0 text-sm font-medium leading-[1.3] text-muted'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Cell() {
  return <div aria-hidden="true" className="reel-cell" style={{ width: CELL, height: CELL }} />
}

function Featured({ src, alt }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-xl"
      style={{ width: CELL, height: CELL }}
    >
      <img
        src={src}
        alt={alt ?? ''}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
    </div>
  )
}

function Chars({ text, startIndex, staggerMs }) {
  let idx = startIndex
  const words = text.split(' ')
  return (
    <>
      {words.map((word, wi) => {
        const wordSpan = (
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs
              idx++
              return (
                <span key={ci} className="scroll-reel-char" style={{ animationDelay: `${delay}ms` }}>
                  {ch}
                </span>
              )
            })}
          </span>
        )
        if (wi < words.length - 1) idx++
        return (
          <React.Fragment key={wi}>
            {wordSpan}
            {wi < words.length - 1 ? ' ' : null}
          </React.Fragment>
        )
      })}
    </>
  )
}

export function ScrollReelTestimonials({ testimonials, activeIndex, charStaggerMs = 6, className }) {
  const [index, setIndex] = React.useState(0)
  const [displayIndex, setDisplayIndex] = React.useState(0)
  const [exiting, setExiting] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const animating = React.useRef(false)
  const timeouts = React.useRef([])

  const count = testimonials.length

  React.useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setMounted(true)),
    )
    const pending = timeouts.current
    return () => {
      cancelAnimationFrame(raf)
      pending.forEach(clearTimeout)
    }
  }, [])

  const paginate = React.useCallback(
    (dir) => {
      if (animating.current) return
      const next = index + dir
      if (next < 0 || next >= count) return
      animating.current = true

      setIndex(next)
      setExiting(true)

      timeouts.current.push(
        setTimeout(() => {
          setDisplayIndex(next)
          setExiting(false)
        }, EXIT_MS),
      )
      timeouts.current.push(
        setTimeout(() => {
          animating.current = false
        }, SLIDE_MS),
      )
    },
    [index, count],
  )

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      paginate(1)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      paginate(-1)
    }
  }

  // Controlled mode: when a parent passes activeIndex (e.g. scroll-driven),
  // run the same exit -> swap transition. Re-runs interrupt cleanly toward the
  // latest target; the SLIDE_MS lock is only used by the uncontrolled arrows.
  React.useEffect(() => {
    if (activeIndex == null || activeIndex === displayIndex) return undefined
    setIndex(activeIndex)
    setExiting(true)
    const t = setTimeout(() => {
      setDisplayIndex(activeIndex)
      setExiting(false)
    }, EXIT_MS)
    return () => clearTimeout(t)
  }, [activeIndex, displayIndex])

  const middleItems = React.useMemo(() => {
    const items = []
    for (let i = 0; i < 3; i++) items.push({ type: 'cell' })
    testimonials.forEach((_, i) => {
      items.push({ type: 'featured', i })
      if (i < count - 1) {
        items.push({ type: 'cell' }, { type: 'cell' })
      }
    })
    for (let i = 0; i < 3; i++) items.push({ type: 'cell' })
    return items
  }, [testimonials, count])

  const sideCellCount = 4 + 2 * count
  const centerIdx = (count - 1) / 2
  const middleY = (centerIdx - index) * STEP
  const sideY = -middleY

  const colStyle = (y) => ({
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE_INOUT}` : 'none',
  })

  const current = testimonials[displayIndex]

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="About me"
      tabIndex={0}
      onKeyDown={activeIndex == null ? onKeyDown : undefined}
      className={cn(
        'glass relative flex w-full max-w-[1320px] flex-col items-stretch gap-2.5 overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent md:min-h-[460px] md:flex-row',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="relative h-72 w-full shrink-0 self-stretch overflow-hidden md:h-auto md:w-[540px]"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>

          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(middleY)}
          >
            {middleItems.map((item, i) =>
              item.type === 'featured' ? (
                <Featured
                  key={i}
                  src={testimonials[item.i].image}
                  alt={testimonials[item.i].alt}
                />
              ) : (
                <Cell key={i} />
              ),
            )}
          </div>

          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch px-5 py-7 md:py-10">
        <div className="flex flex-col gap-[9px]">
          <svg
            className="block h-12 w-12 text-muted/40"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4.58 17.32C3.55 16.23 3 15 3 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18zm10 0C13.55 16.23 13 15 13 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18z" />
          </svg>

          <div className="relative w-full max-w-[480px] overflow-hidden" aria-live="polite">
            <div aria-hidden="true" className="invisible flex min-h-[150px] flex-col gap-[19px]">
              <p className={QUOTE_CLASSES}>{current.quote}</p>
              <p className={AUTHOR_CLASSES}>{current.author}</p>
            </div>
            <div
              key={displayIndex}
              className={cn(
                'absolute inset-x-0 top-0 flex flex-col gap-[19px] will-change-[transform,opacity]',
                exiting && 'scroll-reel-exit',
              )}
            >
              <p className={QUOTE_CLASSES}>
                <Chars text={current.quote} startIndex={0} staggerMs={charStaggerMs} />
              </p>
              <p className={AUTHOR_CLASSES}>
                <Chars
                  text={current.author}
                  startIndex={current.quote.length + 6}
                  staggerMs={charStaggerMs}
                />
              </p>
            </div>
          </div>
        </div>

        {activeIndex == null && (
        <div className="mt-6 flex items-center gap-1.5 md:mt-0">
          <button
            type="button"
            onClick={() => paginate(-1)}
            disabled={index === 0}
            aria-label="Previous"
            className="grid h-6 w-6 cursor-pointer place-items-center rounded-full border border-ink/15 bg-transparent p-0 text-ink transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:enabled:scale-[1.08] active:enabled:scale-[0.94] disabled:cursor-default disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg
              className="h-3 w-3 opacity-70"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.5 2.5 3.5 6l4 3.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            disabled={index === count - 1}
            aria-label="Next"
            className="grid h-6 w-6 cursor-pointer place-items-center rounded-full border border-ink/15 bg-transparent p-0 text-ink transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:enabled:scale-[1.08] active:enabled:scale-[0.94] disabled:cursor-default disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg
              className="h-3 w-3 opacity-70"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m4.5 2.5 4 3.5-4 3.5" />
            </svg>
          </button>
        </div>
        )}
      </div>
    </div>
  )
}
