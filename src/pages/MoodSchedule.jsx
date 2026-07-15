import { useState } from 'react'
import { Smile } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import { useApp } from '../context/AppContext'

const TAG_PRESETS = ['打工後', '考試前', '睡眠不足', '運動後', '社交後']

export default function MoodSchedule() {
  const { state, update, logEmo } = useApp()
  const [note, setNote] = useState('')
  const [tags, setTags] = useState([])

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const avgByTag = (tag) => {
    const entries = state.emoHistory.filter((e) => e.tags?.includes(tag))
    if (!entries.length) return null
    return Math.round(entries.reduce((s, e) => s + e.value, 0) / entries.length)
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Smile}
        title="心情導向排程"
        subtitle="記錄 EMO 與情境標籤，觀察歷史模式"
      />

      <GlassCard>
        <p className="text-sm mb-3">
          目前 EMO：<strong>{state.mood.emoValue}</strong> · 忙碌：{state.mood.busyLevel}%
        </p>
        <p className="text-xs text-[var(--color-muted)] mb-4">
          可在首頁直接調整滑桿；在此記錄情境供日後參考
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {TAG_PRESETS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                tags.includes(tag)
                  ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/40'
                  : 'bg-white/30 border-white/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="備註（選填）"
          className="input-field w-full mb-3"
        />
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            logEmo(note, tags)
            setNote('')
            setTags([])
          }}
        >
          記錄此刻心情
        </button>
      </GlassCard>

      <GlassCard>
        <h3 className="text-sm font-medium mb-3">標籤歷史平均 EMO</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {TAG_PRESETS.map((tag) => {
            const avg = avgByTag(tag)
            return (
              <div key={tag} className="glass-card px-3 py-2 text-sm flex justify-between">
                <span>{tag}</span>
                <span className="text-[var(--color-muted)]">
                  {avg !== null ? `平均 ${avg}` : '尚無資料'}
                </span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-[var(--color-muted)] mt-4">
          未來可依此模式自動建議休息或輕鬆排程（進階功能待實作）
        </p>
      </GlassCard>

      {state.emoHistory.length > 0 && (
        <GlassCard>
          <h3 className="text-sm font-medium mb-3">最近記錄</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {state.emoHistory.slice(0, 20).map((e) => (
              <li key={e.id} className="text-xs glass-card px-3 py-2">
                <span className="font-medium">{e.date}</span> · EMO {e.value}
                {e.tags?.length > 0 && (
                  <span className="text-[var(--color-muted)]"> · {e.tags.join('、')}</span>
                )}
                {e.note && <p className="mt-1 text-[var(--color-text-soft)]">{e.note}</p>}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  )
}
