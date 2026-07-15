import { useState } from 'react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import { GraduationCap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { daysUntil, formatDate } from '../utils/dates'

export default function ExamSchedule() {
  const { state, updateSubject, addCalendarEvent, removeCalendarEvent } = useApp()
  const [evtTitle, setEvtTitle] = useState('')
  const [evtDate, setEvtDate] = useState('')

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={GraduationCap}
        title="考試排程"
        subtitle="依課程設定各科期末／期中考日期"
      />

      <GlassCard>
        <div className="space-y-4">
          {state.subjects.map((s) => {
            const days = daysUntil(s.examDate)
            return (
              <div
                key={s.id}
                className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{s.name}</p>
                  {s.examDate && (
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">
                      {formatDate(s.examDate)}
                      {days !== null && (
                        <span className={days <= 7 ? ' text-[var(--color-danger)] ml-2' : ' ml-2'}>
                          · {days <= 0 ? '今天考試' : `${days} 天後`}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-xs text-[var(--color-muted)]">
                    考試日期
                    <input
                      type="date"
                      value={s.examDate || ''}
                      onChange={(e) => updateSubject(s.id, { examDate: e.target.value || null })}
                      className="input-field mt-1 block"
                    />
                  </label>
                  <label className="text-xs text-[var(--color-muted)]">
                    目標成績
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={s.targetGrade}
                      onChange={(e) =>
                        updateSubject(s.id, { targetGrade: Number(e.target.value) })
                      }
                      className="input-field mt-1 w-20 block"
                    />
                  </label>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-[var(--color-muted)] mt-4">
          設定後會顯示於首頁「考試倒數」與行事曆
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="text-sm font-medium mb-3">自訂行事曆事件</h3>
        <form
          className="flex flex-wrap gap-3 items-end"
          onSubmit={(e) => {
            e.preventDefault()
            if (!evtTitle.trim() || !evtDate) return
            addCalendarEvent({ title: evtTitle.trim(), date: evtDate, type: 'custom' })
            setEvtTitle('')
            setEvtDate('')
          }}
        >
          <label className="text-xs text-[var(--color-muted)] flex-1 min-w-[140px]">
            事件名稱
            <input value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} className="input-field mt-1 w-full" />
          </label>
          <label className="text-xs text-[var(--color-muted)]">
            日期
            <input type="date" value={evtDate} onChange={(e) => setEvtDate(e.target.value)} className="input-field mt-1" />
          </label>
          <button type="submit" className="btn-primary">新增</button>
        </form>
        {state.calendarEvents.length > 0 && (
          <ul className="mt-4 space-y-2">
            {state.calendarEvents.map((ev) => (
              <li key={ev.id} className="glass-card px-3 py-2 text-sm flex justify-between items-center">
                <span>{ev.title} · {formatDate(ev.date)}</span>
                <button type="button" onClick={() => removeCalendarEvent(ev.id)} className="text-[var(--color-danger)] text-xs">刪除</button>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  )
}
