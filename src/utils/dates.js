export function parseDate(str) {
  if (!str) return null
  const d = new Date(str + 'T00:00:00')
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatDate(d) {
  if (!d) return ''
  const date = d instanceof Date ? d : parseDate(d)
  if (!date) return ''
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function daysUntil(dateStr) {
  const target = parseDate(dateStr)
  if (!target) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function toInputDate(d) {
  if (!d) return ''
  const date = d instanceof Date ? d : parseDate(d)
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(dateStr, days) {
  const d = parseDate(dateStr) || new Date()
  d.setDate(d.getDate() + days)
  return toInputDate(d)
}

export function startOfMonth(year, month) {
  return new Date(year, month, 1)
}

export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getMonthGrid(year, month) {
  const first = startOfMonth(year, month)
  const total = daysInMonth(year, month)
  const startPad = (first.getDay() + 6) % 7
  const cells = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= total; d++) {
    cells.push(toInputDate(new Date(year, month, d)))
  }
  return cells
}
