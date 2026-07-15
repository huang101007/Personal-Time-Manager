import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loadState, saveState } from '../utils/storage'
import { getCurrentWeekStart } from '../utils/week'
import {
  computeWeeklyAvailableHours,
  splitStudyHours,
  subjectTotalFromWeights,
} from '../utils/studyHours'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
  const weekStart = getCurrentWeekStart()

  useEffect(() => {
    saveState(state)
  }, [state])

  const weeklyAvailableHours = useMemo(
    () => computeWeeklyAvailableHours(state.schedule, weekStart),
    [state.schedule, weekStart],
  )

  const update = useCallback((patch) => {
    setState((prev) => ({ ...prev, ...patch }))
  }, [])

  const updateSubject = useCallback((id, patch) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  }, [])

  const updateSchedule = useCallback((patch) => {
    setState((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, ...patch },
    }))
  }, [])

  const setFixedSlots = useCallback((slots) => {
    updateSchedule({ fixedSlots: slots })
  }, [updateSchedule])

  const toggleFixedSlot = useCallback((day, hour) => {
    setState((prev) => {
      const slots = prev.schedule.fixedSlots
      const exists = slots.some((s) => s.day === day && s.hour === hour)
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          fixedSlots: exists
            ? slots.filter((s) => !(s.day === day && s.hour === hour))
            : [...slots, { day, hour }],
        },
      }
    })
  }, [])

  const addTempSlot = useCallback((day, hour, title) => {
    setState((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        tempSlots: [
          ...prev.schedule.tempSlots,
          {
            id: `tmp-${Date.now()}-${day}-${hour}`,
            day,
            hour,
            title: title || '臨時行程',
            weekStart: getCurrentWeekStart(),
          },
        ],
      },
    }))
  }, [])

  const removeTempSlot = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        tempSlots: prev.schedule.tempSlots.filter((t) => t.id !== id),
      },
    }))
  }, [])

  const addStudySlot = useCallback((day, hour, subjectId) => {
    setState((prev) => {
      const blocked = prev.schedule.fixedSlots.some((s) => s.day === day && s.hour === hour)
      const tempBlocked = prev.schedule.tempSlots.some(
        (t) => t.day === day && t.hour === hour && t.weekStart === getCurrentWeekStart(),
      )
      if (blocked || tempBlocked) return prev
      const exists = prev.schedule.studySlots.find((s) => s.day === day && s.hour === hour)
      if (exists) {
        return {
          ...prev,
          schedule: {
            ...prev.schedule,
            studySlots: prev.schedule.studySlots.map((s) =>
              s.day === day && s.hour === hour ? { ...s, subjectId } : s,
            ),
          },
        }
      }
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          studySlots: [
            ...prev.schedule.studySlots,
            { id: `stu-${Date.now()}`, day, hour, subjectId },
          ],
        },
      }
    })
  }, [])

  const moveStudySlot = useCallback((id, day, hour) => {
    setState((prev) => {
      const blocked = prev.schedule.fixedSlots.some((s) => s.day === day && s.hour === hour)
      const tempBlocked = prev.schedule.tempSlots.some(
        (t) => t.day === day && t.hour === hour && t.weekStart === getCurrentWeekStart(),
      )
      const occupied = prev.schedule.studySlots.some(
        (s) => s.day === day && s.hour === hour && s.id !== id,
      )
      if (blocked || tempBlocked || occupied) return prev
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          studySlots: prev.schedule.studySlots.map((s) =>
            s.id === id ? { ...s, day, hour } : s,
          ),
        },
      }
    })
  }, [])

  const removeStudySlot = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        studySlots: prev.schedule.studySlots.filter((s) => s.id !== id),
      },
    }))
  }, [])

  const applyStudyPlansFromWeights = useCallback(() => {
    setState((prev) => {
      const available = computeWeeklyAvailableHours(prev.schedule, getCurrentWeekStart())
      const weightSum = prev.subjects.reduce((s, x) => s + x.reviewWeight, 0) || 100
      return {
        ...prev,
        subjects: prev.subjects.map((sub) => {
          if (sub.studyPlan?.custom) return sub
          const total = subjectTotalFromWeights(available, sub.reviewWeight, weightSum)
          return { ...sub, studyPlan: splitStudyHours(total) }
        }),
      }
    })
  }, [])

  const completeReview = useCallback((taskId) => {
    setState((prev) => ({
      ...prev,
      reviewTasks: prev.reviewTasks.map((t) =>
        t.id === taskId ? { ...t, completed: true } : t,
      ),
    }))
  }, [])

  const addReviewTask = useCallback((subjectId, title, dueDate) => {
    setState((prev) => ({
      ...prev,
      reviewTasks: [
        ...prev.reviewTasks,
        {
          id: `rev-manual-${Date.now()}`,
          subjectId,
          title,
          dueDate,
          completed: false,
          type: 'manual',
        },
      ],
    }))
  }, [])

  const addCalendarEvent = useCallback((event) => {
    setState((prev) => ({
      ...prev,
      calendarEvents: [...prev.calendarEvents, { ...event, id: `evt-${Date.now()}` }],
    }))
  }, [])

  const removeCalendarEvent = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      calendarEvents: prev.calendarEvents.filter((e) => e.id !== id),
    }))
  }, [])

  const importLines = useCallback((field, text) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    if (!lines.length) return 0
    setState((prev) => ({
      ...prev,
      [field]: [...prev[field], ...lines],
    }))
    return lines.length
  }, [])

  const addQuizQuestion = useCallback((q) => {
    setState((prev) => ({
      ...prev,
      quizBank: [...prev.quizBank, { ...q, id: `quiz-${Date.now()}` }],
    }))
  }, [])

  const addExtraReviewHours = useCallback((subjectId, hours = 2) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? { ...s, extraReviewHours: (s.extraReviewHours || 0) + hours }
          : s,
      ),
    }))
  }, [])

  const logEmo = useCallback((note, tags = []) => {
    setState((prev) => ({
      ...prev,
      emoHistory: [
        {
          id: `emo-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          value: prev.mood.emoValue,
          note,
          tags,
        },
        ...prev.emoHistory,
      ].slice(0, 100),
    }))
  }, [])

  const redistributeOverdue = useCallback(() => {
    setState((prev) => {
      const today = new Date().toISOString().slice(0, 10)
      const busy = new Set(prev.schedule.fixedSlots.map((s) => `${s.day}-${s.hour}`))

      const updated = prev.reviewTasks.map((task) => {
        if (task.completed || task.dueDate >= today) return task
        let d = new Date(today + 'T00:00:00')
        for (let i = 0; i < 14; i++) {
          const dateStr = d.toISOString().slice(0, 10)
          const day = (d.getDay() + 6) % 7
          const hour = 19
          if (!busy.has(`${day}-${hour}`)) {
            return { ...task, dueDate: dateStr, redistributed: true }
          }
          d.setDate(d.getDate() + 1)
        }
        const nd = new Date(today + 'T00:00:00')
        nd.setDate(nd.getDate() + 1)
        return {
          ...task,
          dueDate: nd.toISOString().slice(0, 10),
          redistributed: true,
        }
      })
      return { ...prev, reviewTasks: updated }
    })
  }, [])

  const value = useMemo(
    () => ({
      state,
      weekStart,
      weeklyAvailableHours,
      update,
      updateSubject,
      updateSchedule,
      setFixedSlots,
      toggleFixedSlot,
      addTempSlot,
      removeTempSlot,
      addStudySlot,
      moveStudySlot,
      removeStudySlot,
      applyStudyPlansFromWeights,
      completeReview,
      addReviewTask,
      addCalendarEvent,
      removeCalendarEvent,
      importLines,
      addQuizQuestion,
      addExtraReviewHours,
      logEmo,
      redistributeOverdue,
    }),
    [
      state,
      weekStart,
      weeklyAvailableHours,
      update,
      updateSubject,
      updateSchedule,
      setFixedSlots,
      toggleFixedSlot,
      addTempSlot,
      removeTempSlot,
      addStudySlot,
      moveStudySlot,
      removeStudySlot,
      applyStudyPlansFromWeights,
      completeReview,
      addReviewTask,
      addCalendarEvent,
      removeCalendarEvent,
      importLines,
      addQuizQuestion,
      addExtraReviewHours,
      logEmo,
      redistributeOverdue,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
