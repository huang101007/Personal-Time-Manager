export const SUBJECT_NAMES = [
  '熱力學',
  '程式設計',
  '機械材料',
  '電工學',
  '工程數學',
  '電腦網路概論',
  '線性代數',
]

const slug = (name) =>
  name
    .replace(/\s/g, '')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '')

export function createDefaultSubjects() {
  const weight = Math.floor(100 / SUBJECT_NAMES.length)
  return SUBJECT_NAMES.map((name, i) => ({
    id: slug(name) || `subject-${i}`,
    name,
    progress: 0,
    targetGrade: 80,
    examDate: null,
    difficulty: 'medium',
    reviewWeight: weight,
    extraReviewHours: 0,
    studyPlan: { lecture: 0, notes: 0, pastExam: 0, custom: false },
    completedAt: null,
  }))
}

export const DEFAULT_QUOTES = [
  '每一次推導，都是通往理解的一步。',
  '今天的小進度，是考試前的大優勢。',
  '專注當下這一題，比擔心全部更重要。',
]

export const DEFAULT_JOKES = [
  '為什麼物理書總是很憂鬱？因為它充滿了「問題」。',
  '工程師的最愛餐廳？麥當勞——因為有麥（max）和勞（load）。',
  '線性代數考完：我與矩陣，從此不再相交。',
]

export function createDefaultSchedule() {
  return {
    fixedSlots: [],
    tempSlots: [],
    studySlots: [],
  }
}

export function createDefaultState() {
  return {
    subjects: createDefaultSubjects(),
    mood: { emoValue: 70, busyLevel: 50 },
    emoThreshold: 50,
    emoHistory: [],
    motivationalQuotes: [...DEFAULT_QUOTES],
    jokes: [...DEFAULT_JOKES],
    calendarEvents: [],
    reviewTasks: [],
    schedule: createDefaultSchedule(),
    quizBank: [],
    version: 2,
  }
}
