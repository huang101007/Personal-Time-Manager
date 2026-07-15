import { Link } from 'react-router-dom'
import { BookMarked } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import { useApp } from '../context/AppContext'
import { STUDY_TYPE_LABELS } from '../config/schedule'
import {
  roundToHalfHour,
  splitStudyHours,
  subjectTotalFromWeights,
  sumStudyPlan,
} from '../utils/studyHours'

const TYPE_KEYS = ['lecture', 'notes', 'pastExam']

export default function StudyPlan() {
  const { state, weeklyAvailableHours, updateSubject, applyStudyPlansFromWeights } = useApp()
  const weightSum = state.subjects.reduce((s, x) => s + x.reviewWeight, 0) || 100

  const updatePlanField = (subjectId, field, rawValue) => {
    const num = roundToHalfHour(parseFloat(rawValue) || 0)
    const sub = state.subjects.find((s) => s.id === subjectId)
    if (!sub) return
    updateSubject(subjectId, {
      studyPlan: { ...sub.studyPlan, [field]: num, custom: true },
    })
  }

  const resetSubjectFromWeights = (subject) => {
    const total = subjectTotalFromWeights(weeklyAvailableHours, subject.reviewWeight, weightSum)
    updateSubject(subject.id, { studyPlan: splitStudyHours(total) })
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={BookMarked}
        title="讀書規劃"
        subtitle="依當週可讀書總時數 × 各科權重分配 · 三類複習預設 50% / 30% / 20%"
      />

      <GlassCard strong className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] text-[var(--color-muted)]">本週可運用讀書總時數</p>
          <p className="text-2xl font-bold text-[var(--color-accent)] tabular-nums">
            {weeklyAvailableHours} <span className="text-sm font-normal">小時</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <Link to="/schedule" className="text-xs text-[var(--color-accent)] hover:underline">
            前往當週時間表調整 →
          </Link>
          <button
            type="button"
            className="btn-primary"
            onClick={applyStudyPlansFromWeights}
            disabled={weeklyAvailableHours <= 0}
          >
            依權重重新分配（未自訂科目）
          </button>
        </div>
      </GlassCard>

      <p className="text-xs text-[var(--color-muted)]">
        時數僅顯示整數或 0.5；小數 &gt;0.5 進位，否則取 0.5。手動修改後該科標記為「已自訂」。
      </p>

      {state.subjects.map((s) => {
        const totalAlloc = subjectTotalFromWeights(weeklyAvailableHours, s.reviewWeight, weightSum)
        const planSum = sumStudyPlan(s.studyPlan)
        return (
          <GlassCard key={s.id}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-medium">{s.name}</h3>
                <p className="text-xs text-[var(--color-muted)]">
                  權重 {s.reviewWeight}% → 建議總計 {totalAlloc}h
                  {s.studyPlan?.custom && (
                    <span className="ml-2 text-[var(--color-warm)]">已自訂</span>
                  )}
                </p>
              </div>
              <button type="button" className="btn-ghost text-xs" onClick={() => resetSubjectFromWeights(s)}>
                重設此科
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {TYPE_KEYS.map((key) => (
                <label key={key} className="glass-card p-3 block">
                  <span className="text-xs text-[var(--color-muted)]">{STUDY_TYPE_LABELS[key]}</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      value={s.studyPlan[key] ?? 0}
                      onChange={(e) => updatePlanField(s.id, key, e.target.value)}
                      className="input-field w-20 text-lg font-semibold tabular-nums"
                    />
                    <span className="text-sm text-[var(--color-muted)]">h</span>
                  </div>
                  <span className="text-[10px] text-[var(--color-muted)]">
                    預設 {key === 'lecture' ? '50' : key === 'notes' ? '30' : '20'}%
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-[var(--color-muted)] mt-3 text-right">
              小計 {planSum}h
              {planSum !== totalAlloc && (
                <span className="text-[var(--color-warm)] ml-1">（與建議總計 {totalAlloc}h 不同）</span>
              )}
            </p>
          </GlassCard>
        )
      })}
    </div>
  )
}
