export default function SectionHeader({ icon: Icon, title, subtitle, badge, action }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="section-title">{title}</h2>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-soft)] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {badge && <span className="badge badge-soon">{badge}</span>}
        {action}
      </div>
    </div>
  )
}
