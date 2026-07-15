import { useState } from 'react'
import { MessageSquareQuote } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import { useApp } from '../context/AppContext'

export default function Quotes() {
  const { state, importLines, update } = useApp()
  const [quoteText, setQuoteText] = useState('')
  const [jokeText, setJokeText] = useState('')
  const [msg, setMsg] = useState('')

  const handleImport = (field, text, setter) => {
    const n = importLines(field, text)
    if (n > 0) {
      setMsg(`已匯入 ${n} 則`)
      setter('')
    }
  }

  const removeItem = (field, index) => {
    update({ [field]: state[field].filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={MessageSquareQuote}
        title="勵志語錄與笑話庫"
        subtitle={`EMO 低於 ${state.emoThreshold} 時首頁改顯示笑話`}
      />

      <GlassCard>
        <label className="text-xs text-[var(--color-muted)]">
          EMO 切換笑話門檻
          <input
            type="number"
            min={0}
            max={100}
            value={state.emoThreshold}
            onChange={(e) => update({ emoThreshold: Number(e.target.value) })}
            className="input-field mt-1 w-24"
          />
        </label>
      </GlassCard>

      {msg && <p className="text-sm text-[var(--color-success)]">{msg}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-sm font-medium mb-3">勵志語錄庫（{state.motivationalQuotes.length} 則）</h3>
          <textarea
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            placeholder="每行一則語錄..."
            className="input-field w-full h-24 resize-none"
          />
          <button
            type="button"
            className="btn-primary mt-2"
            onClick={() => handleImport('motivationalQuotes', quoteText, setQuoteText)}
          >
            匯入語錄
          </button>
          <ul className="mt-4 space-y-1 max-h-48 overflow-y-auto">
            {state.motivationalQuotes.map((q, i) => (
              <li key={i} className="text-xs flex gap-2 glass-card px-2 py-1.5">
                <span className="flex-1">{q}</span>
                <button type="button" onClick={() => removeItem('motivationalQuotes', i)} className="text-[var(--color-danger)]">×</button>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-medium mb-3">笑話庫（{state.jokes.length} 則）</h3>
          <textarea
            value={jokeText}
            onChange={(e) => setJokeText(e.target.value)}
            placeholder="每行一則笑話..."
            className="input-field w-full h-24 resize-none"
          />
          <button
            type="button"
            className="btn-primary mt-2"
            onClick={() => handleImport('jokes', jokeText, setJokeText)}
          >
            匯入笑話
          </button>
          <ul className="mt-4 space-y-1 max-h-48 overflow-y-auto">
            {state.jokes.map((q, i) => (
              <li key={i} className="text-xs flex gap-2 glass-card px-2 py-1.5">
                <span className="flex-1">{q}</span>
                <button type="button" onClick={() => removeItem('jokes', i)} className="text-[var(--color-danger)]">×</button>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  )
}
