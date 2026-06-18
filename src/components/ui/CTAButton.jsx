const VARIANTS = {
  primary: 'liquid-glass-pill text-ink',
  ghost:
    'rounded-full border border-white/15 bg-white/0 text-ink transition-all duration-300 hover:bg-white/5 hover:border-white/30',
}

export function CTAButton({
  as = 'a',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const Tag = as
  return (
    <Tag
      className={[
        'inline-flex items-center justify-center gap-2 px-6 py-3',
        'font-display text-sm font-medium tracking-wide transition-all duration-300',
        VARIANTS[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Tag>
  )
}
