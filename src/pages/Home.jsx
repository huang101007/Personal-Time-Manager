import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Flame, Heart, Calendar as CalIcon } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import ProgressRing from '../components/ProgressRing'
import { useApp } from '../context/AppContext'
import { useDailyQuote } from '../hooks/useDailyQuote'
import { daysUntil, getMonthGrid, formatDate } from '../utils/dates'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

export default function Home() {
  const { state, update, updateSubject } = useApp()
  const quote = useDailyQuote()
  const { emoValue, busyLevel } = state.mood
  const emoLow = emoValue < state.emoThreshold
  const busyHigh = busyLevel >= 70

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const examCountdowns = useMemo(() => {
    return state.subjects
      .map((s) => ({ ...s, days: daysUntil(s.examDate) }))
      .filter((s) => s.examDate && s.days !== null)
      .sort((a, b) => a.days - b.days)
  }, [state.subjects])

  const monthCells = getMonthGrid(viewYear, viewMonth)
  const todayStr = today.toISOString().slice(0, 10)

  const eventsByDate = useMemo(() => {
    const map = {}
    state.calendarEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    state.reviewTasks
      .filter((t) => !t.completed)
      .forEach((t) => {
        if (!map[t.dueDate]) map[t.dueDate] = []
        map[t.dueDate].push({ ...t, title: t.title, type: 'review' })
      })
    state.subjects.forEach((s) => {
      if (s.examDate) {
        if (!map[s.examDate]) map[s.examDate] = []
        map[s.examDate].push({ title: `${s.name} 考試`, type: 'exam' })
      }
    })
    return map
  }, [state.calendarEvents, state.reviewTasks, state.subjects])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[var(--color-muted)]">2026 春季學期</p>
        <h2 className="text-2xl font-semibold tracking-tight mt-0.5">學習總覽</h2>
      </div>

      {/* 考試倒數 */}
      <GlassCard strong padding="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">考試倒數</h3>
          {examCountdowns.length === 0 && (
            <Link to="/exam" className="text-xs text-[var(--color-accent)] hover:underline">
              前往設定考試日期 →
            </Link>
          )}
        </div>
        {examCountdowns.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)] py-4 text-center">
            尚未設定任何考試日期，請至「考試排程」頁面設定
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {examCountdowns.map((s) => (
              <div key={s.id} className="glass-card px-4 py-3 text-center min-w-[5.5rem]">
                <p className="text-[10px] text-[var(--color-muted)] truncate max-w-[5rem]">{s.name}</p>
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    s.days <= 7 ? 'text-[var(--color-danger)]' : 'text-[var(--color-accent)]'
                  }`}
                >
                  {s.days <= 0 ? '今天' : s.days}
                </p>
                <p className="text-[10px] text-[var(--color-muted)]">
                  {s.days <= 0 ? '考試日' : '天後考試'}
                </p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* 心情與忙碌 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <GlassCard className={busyHigh ? 'ring-2 ring-[var(--color-warm)]/40' : ''}>
          <div className="flex items-center gap-2 mb-3">
            <Flame size={18} className="text-[var(--color-warm)]" />
            <span className="text-sm font-medium">忙碌指數</span>
            <span className="ml-auto text-2xl font-bold tabular-nums text-[var(--color-warm)]">
              {busyLevel}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={busyLevel}
            onChange={(e) => update({ mood: { ...state.mood, busyLevel: Number(e.target.value) } })}
            className="w-full accent-[var(--color-warm)]"
          />
          {busyHigh && (
            <p className="text-xs text-[var(--color-warm)] flex items-center gap-1 mt-2">
              <AlertTriangle size={14} /> 忙碌偏高
            </p>
          )}
        </GlassCard>

        <GlassCard className={emoLow ? 'ring-2 ring-[var(--color-danger)]/35' : ''}>
          <div className="flex items-center gap-2 mb-3">
            <Heart size={18} className={emoLow ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'} />
            <span className="text-sm font-medium">心情 EMO</span>
            <span
              className={`ml-auto text-2xl font-bold tabular-nums ${
                emoLow ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'
              }`}
            >
              {emoValue}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={emoValue}
            onChange={(e) => update({ mood: { ...state.mood, emoValue: Number(e.target.value) } })}
            className="w-full accent-[var(--color-success)]"
          />
          {emoLow && (
            <p className="text-xs text-[var(--color-danger)] flex items-center gap-1 mt-2">
              <AlertTriangle size={14} /> 已切換笑話模式
            </p>
          )}
        </GlassCard>
      </div>

      {/* 完成進度 */}
      <GlassCard>
        <h3 className="section-title mb-4">各科完成進度</h3>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {state.subjects.map((s) => (
            <div key={s.id} className="glass-card p-3 flex flex-col items-center">
              <div className="relative">
                <ProgressRing percent={s.progress} size={64} />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                  {s.progress}%
                </span>
              </div>
              <p className="text-xs font-medium mt-2 text-center leading-tight">{s.name}</p>
              <input
                type="range"
                min={0}
                max={100}
                value={s.progress}
                onChange={(e) => updateSubject(s.id, { progress: Number(e.target.value) })}
                className="w-full mt-2 accent-[var(--color-accent)] h-1"
              />
              <p className="text-[10px] text-[var(--color-muted)] mt-1">目標 {s.targetGrade} 分</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 語錄 */}
      <GlassCard
        className={`border-l-4 ${emoLow ? 'border-[var(--color-warm)]' : 'border-[var(--color-accent)]'}`}
      >
        <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-2">
          {emoLow ? '😄 今日笑話' : '✨ 今日語錄'}
        </p>
        <p className="text-base font-medium leading-relaxed">{quote}</p>
        <Link to="/quotes" className="text-xs text-[var(--color-accent)] mt-3 inline-block hover:underline">
          管理語錄庫 →
        </Link>
      </GlassCard>

      {/* 行事曆 */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalIcon size={18} className="text-[var(--color-accent)]" />
            <h3 className="section-title">行事曆</h3>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={() => {
                const m = viewMonth === 0 ? 11 : viewMonth - 1
                setViewMonth(m)
                if (viewMonth === 0) setViewYear((y) => y - 1)
              }}
            >
              ‹
            </button>
            <span className="text-sm font-medium tabular-nums">
              {viewYear} / {viewMonth + 1}
            </span>
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={() => {
                const m = viewMonth === 11 ? 0 : viewMonth + 1
                setViewMonth(m)
                if (viewMonth === 11) setViewYear((y) => y + 1)
              }}
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[10px] text-[var(--color-muted)] py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthCells.map((dateStr, i) => {
            if (!dateStr) return <div key={`empty-${i}`} />
            const events = eventsByDate[dateStr] || []
            const isToday = dateStr === todayStr
            return (
              <div
                key={dateStr}
                className={`min-h-14 p-1 rounded-lg text-center ${
                  isToday ? 'bg-[var(--color-accent)]/15 ring-1 ring-[var(--color-accent)]/30' : 'bg-white/20'
                }`}
              >
                <span className={`text-[10px] ${isToday ? 'font-bold text-[var(--color-accent)]' : ''}`}>
                  {parseInt(dateStr.slice(8), 10)}
                </span>
                <div className="mt-0.5 space-y-0.5">
                  {events.slice(0, 2).map((e, j) => (
                    <div
                      key={j}
                      className={`text-[8px] truncate rounded px-0.5 ${
                        e.type === 'exam'
                          ? 'bg-[var(--color-danger)]/20 text-[var(--color-danger)]'
                          : e.type === 'review'
                            ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                            : 'bg-white/40 text-[var(--color-text-soft)]'
                      }`}
                      title={e.title}
                    >
                      {e.title}
                    </div>
                  ))}
                  {events.length > 2 && (
                    <span className="text-[8px] text-[var(--color-muted)]">+{events.length - 2}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-3 mt-4 text-[10px] text-[var(--color-muted)]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-[var(--color-danger)]/40" /> 考試
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-[var(--color-accent)]/40" /> 複習
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-white/50" /> 自訂事件
          </span>
        </div>
        <p className="text-xs text-[var(--color-muted)] mt-3">
          在「考試排程」設定考試日；「記憶曲線複習」任務與「當週時間表」讀書格也會顯示於此
        </p>
      </GlassCard>
    </div>
  )
}
