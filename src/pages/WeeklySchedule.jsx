import { useCallback, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import { useApp } from '../context/AppContext'
import {
  SCHEDULE_DAYS,
  SCHEDULE_HOURS,
  SCHEDULE_START_HOUR,
  SCHEDULE_END_HOUR,
} from '../config/schedule'

const MODES = [
  { id: 'all', label: '全部', desc: '檢視所有排程' },
  { id: 'fixed', label: '固定排程', desc: '每週固定有事時段' },
  { id: 'temp', label: '臨時排程', desc: '本週集會／活動' },
  { id: 'study', label: '讀書規劃', desc: '安排各科讀書時段' },
]

const SUBJECT_COLORS = [
  'bg-[#5b7c99]/50 border-[#5b7c99]/70',
  'bg-[#7ba88a]/50 border-[#7ba88a]/70',
  'bg-[#c4a882]/50 border-[#c4a882]/70',
  'bg-[#8fa8bc]/50 border-[#8fa8bc]/70',
  'bg-[#9b8aa8]/50 border-[#9b8aa8]/70',
  'bg-[#6b9090]/50 border-[#6b9090]/70',
  'bg-[#a89b7c]/50 border-[#a89b7c]/70',
]

export default function WeeklySchedule() {
  const {
    state,
    weeklyAvailableHours,
    toggleFixedSlot,
    addTempSlot,
    removeTempSlot,
    addStudySlot,
    moveStudySlot,
    removeStudySlot,
    weekStart,
  } = useApp()

  const [mode, setMode] = useState('all')
  const [dragAnchor, setDragAnchor] = useState(null)
  const [dragEnd, setDragEnd] = useState(null)
  const [movingStudyId, setMovingStudyId] = useState(null)
  const [pickSubjectId, setPickSubjectId] = useState(state.subjects[0]?.id || '')

  const { fixedSlots, tempSlots, studySlots } = state.schedule
  const weekTemps = tempSlots.filter((t) => t.weekStart === weekStart)

  const isFixed = (day, hour) => fixedSlots.some((s) => s.day === day && s.hour === hour)
  const getTemp = (day, hour) => weekTemps.find((t) => t.day === day && t.hour === hour)
  const getStudy = (day, hour) => studySlots.find((s) => s.day === day && s.hour === hour)

  const subjectColor = (subjectId) => {
    const idx = state.subjects.findIndex((s) => s.id === subjectId)
    return SUBJECT_COLORS[idx % SUBJECT_COLORS.length]
  }

  const subjectName = (id) => state.subjects.find((s) => s.id === id)?.name?.slice(0, 4) || '?'

  const inSelection = useCallback(
    (day, hour) => {
      if (!dragAnchor || !dragEnd) return false
      const minD = Math.min(dragAnchor.day, dragEnd.day)
      const maxD = Math.max(dragAnchor.day, dragEnd.day)
      const minH = Math.min(dragAnchor.hour, dragEnd.hour)
      const maxH = Math.max(dragAnchor.hour, dragEnd.hour)
      return day >= minD && day <= maxD && hour >= minH && hour <= maxH
    },
    [dragAnchor, dragEnd],
  )

  const applyPaint = (day, hour, add) => {
    if (mode === 'fixed') {
      if (add && !isFixed(day, hour)) toggleFixedSlot(day, hour)
      if (!add && isFixed(day, hour)) toggleFixedSlot(day, hour)
    } else if (mode === 'temp') {
      const t = getTemp(day, hour)
      if (add && !t && !isFixed(day, hour)) {
        addTempSlot(day, hour, '集會／活動')
      } else if (!add && t) {
        removeTempSlot(t.id)
      }
    }
  }

  const finishDrag = () => {
    if (!dragAnchor || !dragEnd || mode === 'study' || mode === 'all') {
      setDragAnchor(null)
      setDragEnd(null)
      return
    }
    const minD = Math.min(dragAnchor.day, dragEnd.day)
    const maxD = Math.max(dragAnchor.day, dragEnd.day)
    const minH = Math.min(dragAnchor.hour, dragEnd.hour)
    const maxH = Math.max(dragAnchor.hour, dragEnd.hour)

    const cells = []
    for (let d = minD; d <= maxD; d++) {
      for (let h = minH; h <= maxH; h++) cells.push({ day: d, hour: h })
    }
    const first = cells[0]
    if (mode === 'fixed') {
      const add = !isFixed(first.day, first.hour)
      cells.forEach(({ day, hour }) => applyPaint(day, hour, add))
    } else if (mode === 'temp') {
      const existing = getTemp(first.day, first.hour)
      if (existing) {
        cells.forEach(({ day, hour }) => {
          const t = getTemp(day, hour)
          if (t) removeTempSlot(t.id)
        })
      } else {
        const title = window.prompt('臨時行程名稱（套用到本次框選）', '集會／活動')
        if (title) {
          cells.forEach(({ day, hour }) => {
            if (!isFixed(day, hour) && !getTemp(day, hour)) addTempSlot(day, hour, title)
          })
        }
      }
    }

    setDragAnchor(null)
    setDragEnd(null)
  }

  const handleCellDown = (day, hour) => {
    if (mode === 'all') return

    if (mode === 'study') {
      const existing = getStudy(day, hour)
      if (movingStudyId) {
        moveStudySlot(movingStudyId, day, hour)
        setMovingStudyId(null)
        return
      }
      if (existing) {
        setMovingStudyId(existing.id)
        return
      }
      if (!isFixed(day, hour) && !getTemp(day, hour) && pickSubjectId) {
        addStudySlot(day, hour, pickSubjectId)
      }
      return
    }

    setDragAnchor({ day, hour })
    setDragEnd({ day, hour })
  }

  const handleCellEnter = (day, hour) => {
    if (dragAnchor && mode !== 'study' && mode !== 'all') {
      setDragEnd({ day, hour })
    }
  }

  const layerDim = (layer) => {
    if (mode === 'all') return ''
    if (mode === layer) return ''
    return 'opacity-[0.12] pointer-events-none'
  }

  return (
    <div className="space-y-6" onMouseUp={finishDrag} onMouseLeave={finishDrag}>
      <SectionHeader
        icon={CalendarClock}
        title="當週時間表"
        subtitle={`${SCHEDULE_START_HOUR}:00 – ${SCHEDULE_END_HOUR}:00 · 整點 · 週一起算 ${weekStart}`}
      />

      <GlassCard strong className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
            本週可運用讀書總時數
          </p>
          <p className="text-3xl font-bold text-[var(--color-accent)] tabular-nums">
            {weeklyAvailableHours}
            <span className="text-base font-normal text-[var(--color-muted)]"> 小時</span>
          </p>
          <p className="text-[10px] text-[var(--color-muted)] mt-1">
            已排讀書 {studySlots.length}h · 固定 {fixedSlots.length}h · 本週臨時 {weekTemps.length}h
          </p>
        </div>
        <p className="text-xs text-[var(--color-text-soft)] max-w-xs">
          ＝ 本週總格數 − 固定 − 臨時。供「複習權重」「讀書規劃」分配各科時數。
        </p>
      </GlassCard>

      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id)
              setMovingStudyId(null)
              setDragAnchor(null)
              setDragEnd(null)
            }}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              mode === m.id
                ? 'glass-card-strong font-medium text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30'
                : 'bg-white/25 text-[var(--color-text-soft)] hover:bg-white/40'
            }`}
            title={m.desc}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'study' && (
        <GlassCard className="flex flex-wrap items-center gap-3">
          <label className="text-xs text-[var(--color-muted)]">
            點空格新增 · 點已排格後再點目標格以移動 · 雙擊讀書格刪除
            <select
              value={pickSubjectId}
              onChange={(e) => setPickSubjectId(e.target.value)}
              className="input-field mt-1 block min-w-[140px]"
            >
              {state.subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          {movingStudyId && (
            <button type="button" className="btn-ghost text-xs" onClick={() => setMovingStudyId(null)}>
              取消移動
            </button>
          )}
        </GlassCard>
      )}

      {mode === 'fixed' && (
        <p className="text-xs text-[var(--color-muted)]">拖曳框選標記／取消每週固定忙碌（自動儲存）</p>
      )}
      {mode === 'temp' && (
        <p className="text-xs text-[var(--color-muted)]">拖曳框選本週臨時行程；框選空白區域可一次清除</p>
      )}

      <GlassCard>
        <div className="overflow-x-auto -mx-1 px-1 pb-2 select-none">
          <div
            className="inline-grid min-w-[680px]"
            style={{ gridTemplateColumns: `3.5rem repeat(7, 1fr)` }}
          >
            <div />
            {SCHEDULE_DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium py-2 text-[var(--color-text-soft)]">
                {d}
              </div>
            ))}

            {SCHEDULE_HOURS.map((hour) => (
              <div key={hour} className="contents">
                <div className="text-[10px] text-[var(--color-muted)] pr-2 text-right self-center tabular-nums">
                  {hour}:00
                </div>
                {SCHEDULE_DAYS.map((_, day) => {
                  const fixed = isFixed(day, hour)
                  const temp = getTemp(day, hour)
                  const study = getStudy(day, hour)
                  const selecting = dragAnchor && inSelection(day, hour)

                  return (
                    <div
                      key={`${day}-${hour}`}
                      onMouseDown={() => handleCellDown(day, hour)}
                      onMouseEnter={() => handleCellEnter(day, hour)}
                      className={`
                        m-0.5 min-h-[2rem] rounded-md border relative overflow-hidden
                        ${mode !== 'all' ? 'cursor-crosshair' : ''}
                        ${selecting ? 'ring-2 ring-[var(--color-accent)]/50 z-10' : ''}
                        ${movingStudyId === study?.id ? 'ring-2 ring-[var(--color-warm)] z-10' : ''}
                        bg-white/15 border-white/25
                      `}
                    >
                      {fixed && (
                        <div
                          className={`absolute inset-0 bg-[var(--color-warm)]/45 ${layerDim('fixed')}`}
                          title="固定"
                        />
                      )}
                      {temp && (
                        <div
                          className={`absolute inset-0 bg-[#9b8aa8]/40 flex items-center justify-center ${layerDim('temp')}`}
                          title={temp.title}
                        >
                          <span className="text-[8px] px-0.5 truncate">{temp.title.slice(0, 5)}</span>
                        </div>
                      )}
                      {study && (
                        <div
                          className={`absolute inset-0 flex items-center justify-center text-[9px] font-medium border ${subjectColor(study.subjectId)} ${layerDim('study')}`}
                          title={state.subjects.find((s) => s.id === study.subjectId)?.name}
                          onDoubleClick={(e) => {
                            e.stopPropagation()
                            removeStudySlot(study.id)
                          }}
                        >
                          {subjectName(study.subjectId)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-[10px] text-[var(--color-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[var(--color-warm)]/45" /> 固定
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#9b8aa8]/40" /> 臨時
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[var(--color-accent)]/40" /> 讀書
          </span>
        </div>
      </GlassCard>
    </div>
  )
}
