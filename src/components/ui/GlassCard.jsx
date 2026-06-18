export function GlassCard({ children, className = '', interactive = false }) {
  return (
    <div
      className={[
        'glass p-6 sm:p-7',
        interactive
          ? 'group relative overflow-hidden transition-colors duration-300 hover:border-accent/40'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {interactive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 0%, rgba(56,189,248,0.16), transparent 70%)',
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  )
}
