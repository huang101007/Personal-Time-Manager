import { useState } from 'react'
import { Brain, Check } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import { useApp } from '../context/AppContext'
import { daysUntil, formatDate } from '../utils/dates'

export default function MemoryReview() {
  const { state, completeReview, addReviewTask } = useApp()
  const [filter, setFilter] = useState('pending')
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [subjectId, setSubjectId] = useState(state.subjects[0]?.id || '')

  const tasks = state.reviewTasks
    .filter((t) => {
      if (filter === 'pending') return !t.completed
      if (filter === 'done') return t.completed
      return true
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  const subjectName = (id) => state.subjects.find((s) => s.id === id)?.name || id

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Brain}
        title="記憶曲線複習"
        subtitle="手動新增複習任務並追蹤到期日"
      />

      <GlassCard>
        <form
          className="flex flex-wrap gap-3 items-end"
          onSubmit={(e) => {
            e.preventDefault()
            if (!title.trim() || !dueDate || !subjectId) return
            addReviewTask(subjectId, title.trim(), dueDate)
            setTitle('')
          }}
        >
          <label className="text-xs text-[var(--color-muted)] flex-1 min-w-[120px]">
            科目
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="input-field mt-1 w-full">
              {state.subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-[var(--color-muted)] flex-1 min-w-[140px]">
            任務
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field mt-1 w-full" placeholder="例：第3章複習" />
          </label>
          <label className="text-xs text-[var(--color-muted)]">
            到期日
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-field mt-1" required />
          </label>
          <button type="submit" className="btn-primary">新增</button>
        </form>
      </GlassCard>

      <div className="flex gap-2">
        {[
          { id: 'pending', label: '待複習' },
          { id: 'done', label: '已完成' },
          { id: 'all', label: '全部' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filter === f.id
                ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-medium'
                : 'bg-white/30 text-[var(--color-text-soft)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <GlassCard>
        {tasks.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)] text-center py-8">尚無複習任務</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => {
              const days = daysUntil(t.dueDate)
              const overdue = !t.completed && days !== null && days < 0
              return (
                <li
                  key={t.id}
                  className={`glass-card p-3 flex items-center gap-3 ${overdue ? 'ring-1 ring-[var(--color-danger)]/40' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => completeReview(t.id)}
                    disabled={t.completed}
                    className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                      t.completed
                        ? 'bg-[var(--color-success)]/20 border-[var(--color-success)] text-[var(--color-success)]'
                        : 'border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/10'
                    }`}
                    aria-label="標記完成"
                  >
                    {t.completed && <Check size={16} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${t.completed ? 'line-through opacity-60' : ''}`}>
                      {t.title}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {subjectName(t.subjectId)} · {formatDate(t.dueDate)}
                      {t.intervalDay && ` · 第 ${t.intervalDay} 天`}
                      {overdue && <span className="text-[var(--color-danger)] ml-1">（逾期）</span>}
                    </p>
                  </div>
                  {!t.completed && days !== null && days >= 0 && (
                    <span className="text-xs tabular-nums text-[var(--color-accent)]">{days} 天後</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </GlassCard>
    </div>
  )
}
