export default function GlassCard({
  children,
  className = '',
  strong = false,
  padding = 'p-5',
}) {
  return (
    <div
      className={`glass-card ${strong ? 'glass-card-strong' : ''} ${padding} ${className}`}
    >
      {children}
    </div>
  )
}
