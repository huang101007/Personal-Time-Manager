import { RefreshCw } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import { useApp } from '../context/AppContext'
import { daysUntil, formatDate } from '../utils/dates'

export default function Overdue() {
  const { state, redistributeOverdue } = useApp()
  const today = new Date().toISOString().slice(0, 10)

  const overdue = state.reviewTasks.filter(
    (t) => !t.completed && t.dueDate < today,
  )

  const subjectName = (id) => state.subjects.find((s) => s.id === id)?.name || id

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={RefreshCw}
        title="逾期任務重新分配"
        subtitle="將逾期複習任務排入非忙碌時段"
      />

      <GlassCard>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-sm">
            共 <strong className="text-[var(--color-danger)]">{overdue.length}</strong> 項逾期
          </p>
          <button
            type="button"
            onClick={redistributeOverdue}
            disabled={overdue.length === 0}
            className="btn-primary disabled:opacity-50"
          >
            一鍵重新分配
          </button>
        </div>

        {overdue.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)] text-center py-6">目前沒有逾期任務</p>
        ) : (
          <ul className="space-y-2">
            {overdue.map((t) => (
              <li key={t.id} className="glass-card p-3 text-sm">
                <span className="font-medium">{t.title}</span>
                <span className="block text-xs text-[var(--color-muted)] mt-1">
                  {subjectName(t.subjectId)} · 原定 {formatDate(t.dueDate)} · 逾期 {Math.abs(daysUntil(t.dueDate))} 天
                </span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  )
}
