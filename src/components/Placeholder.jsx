export default function Placeholder({ children, className = '', minHeight = 'min-h-24' }) {
  return (
    <div className={`placeholder-zone ${minHeight} ${className}`}>
      {children ?? '功能預留區 · 尚未實裝'}
    </div>
  )
}
