import { STUDY_TYPE_RATIO } from '../config/schedule'
import { SCHEDULE_HOURS } from '../config/schedule'
import { getCurrentWeekStart } from './week'

/** 小數部分 >0.5 進位到整數；否則且有小數則為 .5 */
export function roundToHalfHour(hours) {
  if (hours <= 0) return 0
  const whole = Math.floor(hours)
  const frac = hours - whole
  if (frac < 1e-9) return whole
  if (frac > 0.5) return whole + 1
  return whole + 0.5
}

export function splitStudyHours(totalHours) {
  const lecture = roundToHalfHour(totalHours * STUDY_TYPE_RATIO.lecture)
  const notes = roundToHalfHour(totalHours * STUDY_TYPE_RATIO.notes)
  const pastExam = roundToHalfHour(totalHours * STUDY_TYPE_RATIO.pastExam)
  return { lecture, notes, pastExam, custom: false }
}

export function sumStudyPlan(plan) {
  if (!plan) return 0
  return (plan.lecture || 0) + (plan.notes || 0) + (plan.pastExam || 0)
}

export function computeWeeklyAvailableHours(schedule, weekStart) {
  const totalSlots = SCHEDULE_HOURS.length * 7
  const fixed = schedule?.fixedSlots?.length ?? 0
  const temp = (schedule?.tempSlots ?? []).filter((t) => t.weekStart === weekStart).length
  return Math.max(0, totalSlots - fixed - temp)
}

export function subjectTotalFromWeights(availableHours, weightPercent, weightsSum = 100) {
  const raw = availableHours * (weightPercent / weightsSum)
  return roundToHalfHour(raw)
}

export function migrateStudyPlan(old) {
  if (!old) return { lecture: 0, notes: 0, pastExam: 0, custom: false }
  if (old.lecture !== undefined) return { ...old, custom: old.custom ?? false }
  const total =
    (old.reading || 0) + (old.derivation || 0) + (old.exercises || 0)
  if (total <= 0) return { lecture: 0, notes: 0, pastExam: 0, custom: false }
  return { ...splitStudyHours(total), custom: false }
}
