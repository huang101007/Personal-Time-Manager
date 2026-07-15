import { Link } from 'react-router-dom'
import { Scale } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import { useApp } from '../context/AppContext'
import { subjectTotalFromWeights } from '../utils/studyHours'

const DIFFICULTIES = [
  { id: 'low', label: '低', weight: 10 },
  { id: 'medium', label: '中', weight: 14 },
  { id: 'high', label: '高', weight: 18 },
]

export default function Weights() {
  const { state, updateSubject, weeklyAvailableHours } = useApp()

  const totalWeight = state.subjects.reduce((s, x) => s + x.reviewWeight, 0)
  const weightSum = totalWeight || 100

  const normalizeWeights = () => {
    const sum = state.subjects.reduce((s, x) => s + x.reviewWeight, 0) || 1
    state.subjects.forEach((sub) => {
      updateSubject(sub.id, { reviewWeight: Math.round((sub.reviewWeight / sum) * 100) })
    })
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Scale}
        title="科目難易度 · 複習權重"
        subtitle="權重決定各科分配的本週讀書總時數"
      />

      <GlassCard strong>
        <p className="text-[10px] text-[var(--color-muted)]">本週可運用讀書總時數（來自當週時間表）</p>
        <p className="text-2xl font-bold text-[var(--color-accent)] tabular-nums">
          {weeklyAvailableHours} <span className="text-sm font-normal">小時</span>
        </p>
        <Link to="/schedule" className="text-xs text-[var(--color-accent)] mt-2 inline-block hover:underline">
          至當週時間表調整固定／臨時排程 →
        </Link>
      </GlassCard>

      <GlassCard>
        <p className="text-xs text-[var(--color-muted)] mb-4">
          權重總和：
          <span className={totalWeight === 100 ? 'text-[var(--color-success)]' : 'text-[var(--color-warm)]'}>
            {totalWeight}%
          </span>
          {totalWeight !== 100 && (
            <button type="button" onClick={normalizeWeights} className="ml-3 text-[var(--color-accent)] hover:underline">
              正規化為 100%
            </button>
          )}
        </p>

        <div className="space-y-4">
          {state.subjects.map((s) => {
            const hours = subjectTotalFromWeights(weeklyAvailableHours, s.reviewWeight, weightSum)
            return (
              <div key={s.id} className="glass-card p-4">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="font-medium text-sm w-28">{s.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] tabular-nums">
                    本週 {hours}h
                  </span>
                  <select
                    value={s.difficulty}
                    onChange={(e) => {
                      const d = DIFFICULTIES.find((x) => x.id === e.target.value)
                      updateSubject(s.id, {
                        difficulty: e.target.value,
                        reviewWeight: d?.weight ?? s.reviewWeight,
                      })
                    }}
                    className="input-field text-xs ml-auto"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d.id} value={d.id}>難度{d.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={5}
                    max={40}
                    value={s.reviewWeight}
                    onChange={(e) => updateSubject(s.id, { reviewWeight: Number(e.target.value) })}
                    className="flex-1 accent-[var(--color-accent)]"
                  />
                  <span className="text-sm tabular-nums w-10 text-right">{s.reviewWeight}%</span>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-[var(--color-muted)] mt-4">
          調整權重後，至「讀書規劃」點選「依權重重新分配」更新三類複習時數（已自訂科目不受影響）
        </p>
      </GlassCard>
    </div>
  )
}
