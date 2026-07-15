import { useRef } from 'react'
import { FileDown } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import { useApp } from '../context/AppContext'
import { daysUntil, formatDate } from '../utils/dates'

export default function ExportPdf() {
  const { state, weeklyAvailableHours } = useApp()
  const printRef = useRef(null)

  const pendingReviews = state.reviewTasks
    .filter((t) => !t.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return
    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html><html lang="zh-Hant"><head>
      <meta charset="utf-8"><title>學習排程</title>
      <style>
        body { font-family: "Noto Sans TC", sans-serif; padding: 24px; color: #2c3338; }
        h1 { font-size: 20px; } h2 { font-size: 14px; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background: #eef1f5; }
      </style></head><body>
      ${content.innerHTML}
      </body></html>`)
    win.document.close()
    win.focus()
    win.print()
  }

  return (
    <div className="space-y-6">
      <SectionHeader icon={FileDown} title="匯出 PDF" subtitle="列印本週排程與待辦" />

      <button type="button" onClick={handlePrint} className="btn-primary">
        開啟列印視窗（可另存 PDF）
      </button>

      <GlassCard>
        <div ref={printRef} className="print-preview text-sm space-y-4">
          <h1 className="text-lg font-semibold">智慧時間管理 · 排程表</h1>
          <p className="text-xs text-gray-500">匯出時間：{new Date().toLocaleString('zh-TW')}</p>

          <section>
            <h2 className="font-medium">考試一覽</h2>
            <table>
              <thead>
                <tr><th>科目</th><th>考試日</th><th>倒數</th><th>進度</th><th>目標</th></tr>
              </thead>
              <tbody>
                {state.subjects.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.examDate ? formatDate(s.examDate) : '未設定'}</td>
                    <td>{s.examDate ? `${daysUntil(s.examDate)} 天` : '—'}</td>
                    <td>{s.progress}%</td>
                    <td>{s.targetGrade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="font-medium">待複習任務</h2>
            {pendingReviews.length === 0 ? (
              <p className="text-xs text-gray-500">無</p>
            ) : (
              <table>
                <thead>
                  <tr><th>任務</th><th>科目</th><th>到期日</th></tr>
                </thead>
                <tbody>
                  {pendingReviews.map((t) => (
                    <tr key={t.id}>
                      <td>{t.title}</td>
                      <td>{state.subjects.find((s) => s.id === t.subjectId)?.name}</td>
                      <td>{formatDate(t.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section>
            <h2 className="font-medium">本週讀書規劃（可運用 {weeklyAvailableHours}h）</h2>
            <table>
              <thead>
                <tr><th>科目</th><th>講義</th><th>筆記</th><th>考古題</th><th>小計</th></tr>
              </thead>
              <tbody>
                {state.subjects.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.studyPlan?.lecture ?? 0}h</td>
                    <td>{s.studyPlan?.notes ?? 0}h</td>
                    <td>{s.studyPlan?.pastExam ?? 0}h</td>
                    <td>{(s.studyPlan?.lecture || 0) + (s.studyPlan?.notes || 0) + (s.studyPlan?.pastExam || 0)}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="font-medium">複習權重</h2>
            <ul className="text-xs list-disc pl-5">
              {state.subjects.map((s) => (
                <li key={s.id}>{s.name}：{s.reviewWeight}%（難度 {s.difficulty}）</li>
              ))}
            </ul>
          </section>
        </div>
      </GlassCard>
    </div>
  )
}
