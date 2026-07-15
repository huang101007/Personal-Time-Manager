/** 當週時間表：8:00 起算，至 24:00（最後一格為 23:00–24:00） */
export const SCHEDULE_START_HOUR = 8
export const SCHEDULE_END_HOUR = 24
export const SCHEDULE_HOURS = Array.from(
  { length: SCHEDULE_END_HOUR - SCHEDULE_START_HOUR },
  (_, i) => SCHEDULE_START_HOUR + i,
)

export const SCHEDULE_DAYS = ['週一', '週二', '週三', '週四', '週五', '週六', '週日']

/** 複習內容預設比例 */
export const STUDY_TYPE_RATIO = {
  lecture: 0.5,
  notes: 0.3,
  pastExam: 0.2,
}

export const STUDY_TYPE_LABELS = {
  lecture: '上課講義複習',
  notes: '筆記整理',
  pastExam: '考古題練習',
}
