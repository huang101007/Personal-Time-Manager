import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

export function useDailyQuote() {
  const { state } = useApp()
  const { emoValue } = state.mood
  const emoLow = emoValue < state.emoThreshold

  return useMemo(() => {
    const pool = emoLow ? state.jokes : state.motivationalQuotes
    if (!pool.length) {
      return emoLow
        ? '（笑話庫為空，請至語錄庫匯入）'
        : '（勵志語錄庫為空，請至語錄庫匯入）'
    }
    const dayIndex = Math.floor(Date.now() / 86400000) % pool.length
    return pool[dayIndex]
  }, [emoLow, state.jokes, state.motivationalQuotes, state.emoThreshold])
}
