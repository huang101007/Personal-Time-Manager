/** 艾賓浩斯複習間隔（天） */
export const MEMORY_INTERVALS = [1, 2, 4, 7, 15]

export function generateReviewTasks(subjectId, chapterTitle, baseDate) {
  const base = baseDate || toToday()
  return MEMORY_INTERVALS.map((days, i) => ({
    id: `rev-${subjectId}-${Date.now()}-${i}`,
    subjectId,
    title: `複習：${chapterTitle}`,
    dueDate: addDaysStr(base, days),
    completed: false,
    type: 'memory',
    intervalDay: days,
    createdAt: new Date().toISOString(),
  }))
}

function toToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDaysStr(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
