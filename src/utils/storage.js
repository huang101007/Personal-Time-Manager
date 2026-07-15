import { createDefaultState, createDefaultSchedule } from '../data/defaultData'
import { migrateStudyPlan } from './studyHours'

const STORAGE_KEY = 'time-manager-state-v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultState()
    const parsed = JSON.parse(raw)
    return mergeWithDefaults(parsed)
  } catch {
    return createDefaultState()
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function mergeWithDefaults(saved) {
  const defaults = createDefaultState()
  const subjectMap = new Map((saved.subjects || []).map((s) => [s.id, s]))
  const subjects = defaults.subjects.map((d) => {
    const merged = { ...d, ...(subjectMap.get(d.id) || {}) }
    const { chapters, resources, ...rest } = merged
    return {
      ...rest,
      studyPlan: migrateStudyPlan(merged.studyPlan),
    }
  })

  const schedule = {
    ...createDefaultSchedule(),
    ...(saved.schedule || {}),
  }
  if (!schedule.fixedSlots?.length && saved.weeklyBusySlots?.length) {
    schedule.fixedSlots = saved.weeklyBusySlots.map(({ day, hour }) => ({ day, hour }))
  }

  return {
    ...defaults,
    ...saved,
    subjects,
    schedule,
    motivationalQuotes: saved.motivationalQuotes?.length
      ? saved.motivationalQuotes
      : defaults.motivationalQuotes,
    jokes: saved.jokes?.length ? saved.jokes : defaults.jokes,
  }
}
