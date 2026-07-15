import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import { useApp } from '../context/AppContext'

export default function Quiz() {
  const { state, addQuizQuestion, addExtraReviewHours, updateSubject } = useApp()
  const [subjectId, setSubjectId] = useState(state.subjects[0]?.id || '')
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)

  const subjectQuizzes = state.quizBank.filter((q) => q.subjectId === subjectId)

  const handleAddQuestion = (e) => {
    e.preventDefault()
    if (!question.trim() || options.some((o) => !o.trim())) return
    addQuizQuestion({
      subjectId,
      question: question.trim(),
      options: options.map((o) => o.trim()),
      correctIndex,
    })
    setQuestion('')
    setOptions(['', '', '', ''])
    setCorrectIndex(0)
  }

  const startQuiz = (subject) => {
    const pool = state.quizBank.filter((q) => q.subjectId === subject.id)
    if (!pool.length) {
      alert(`「${subject.name}」尚無測驗題，請先新增題目`)
      return
    }
    const q = pool[Math.floor(Math.random() * pool.length)]
    setActiveQuiz({ ...q, subject })
    setSelected(null)
    setResult(null)
  }

  const submitAnswer = (idx) => {
    if (result !== null) return
    setSelected(idx)
    const correct = idx === activeQuiz.correctIndex
    setResult(correct ? 'correct' : 'wrong')
    if (!correct) {
      addExtraReviewHours(activeQuiz.subject.id, 2)
    } else {
      updateSubject(activeQuiz.subject.id, {
        progress: Math.min(100, (activeQuiz.subject.progress || 0) + 5),
      })
    }
  }

  const closeQuiz = () => {
    setActiveQuiz(null)
    setSelected(null)
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={HelpCircle}
        title="理解確認測驗"
        subtitle="完成科目學習後測驗 · 答錯增加 2 小時複習權重"
      />

      <GlassCard>
        <h3 className="text-sm font-medium mb-3">新增題目</h3>
        <form onSubmit={handleAddQuestion} className="space-y-3">
          <label className="text-xs text-[var(--color-muted)] block">
            科目
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="input-field mt-1 w-full"
            >
              {state.subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-[var(--color-muted)] block">
            題目
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="input-field mt-1 w-full"
              placeholder="例：熱力學第一定律的核心概念是？"
            />
          </label>
          {options.map((opt, i) => (
            <label key={i} className="text-xs text-[var(--color-muted)] flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
              />
              選項 {String.fromCharCode(65 + i)}
              <input
                value={opt}
                onChange={(e) => {
                  const next = [...options]
                  next[i] = e.target.value
                  setOptions(next)
                }}
                className="input-field flex-1"
              />
            </label>
          ))}
          <button type="submit" className="btn-primary">加入題庫</button>
        </form>
        <p className="text-xs text-[var(--color-muted)] mt-3">
          目前此科共 {subjectQuizzes.length} 題
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="text-sm font-medium mb-3">標記科目完成並測驗</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {state.subjects.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => startQuiz(s)}
              className="glass-card p-3 text-left text-sm hover:bg-white/50 transition-colors"
            >
              <span className="font-medium">{s.name}</span>
              <span className="block text-xs text-[var(--color-muted)] mt-1">
                進度 {s.progress}% · 額外複習 +{s.extraReviewHours}h
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <GlassCard strong className="w-full max-w-md">
            <p className="text-xs text-[var(--color-muted)] mb-2">{activeQuiz.subject.name}</p>
            <p className="font-medium mb-4">{activeQuiz.question}</p>
            <div className="space-y-2">
              {activeQuiz.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => submitAnswer(i)}
                  disabled={result !== null}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                    selected === i
                      ? result === 'correct'
                        ? 'border-[var(--color-success)] bg-[var(--color-success)]/15'
                        : 'border-[var(--color-danger)] bg-[var(--color-danger)]/15'
                      : 'border-white/60 bg-white/30 hover:bg-white/50'
                  }`}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              ))}
            </div>
            {result && (
              <p className={`text-sm mt-4 text-center ${result === 'correct' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                {result === 'correct' ? '✓ 答對！進度 +5%' : '✗ 答錯，已為此科增加 2 小時複習權重'}
              </p>
            )}
            <button type="button" onClick={closeQuiz} className="btn-ghost w-full mt-4">
              關閉
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
