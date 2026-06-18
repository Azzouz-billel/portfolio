export function ProjectCard({ project }) {
  return (
    <div className="liquid-glass flex h-full flex-col overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden border-b border-white/10">
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.08] to-white/[0.02]"
          >
            <span className="eyebrow" style={{ letterSpacing: '0.22em' }}>
              {project.category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow mb-3" style={{ letterSpacing: '0.22em' }}>
          {project.category}
        </p>
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-4 text-sm">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-accent transition-opacity hover:opacity-80"
            >
              Code →
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-ink transition-opacity hover:opacity-80"
            >
              Live →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
