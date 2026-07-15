import {
  LayoutDashboard,
  Calendar,
  Brain,
  BookMarked,
  MessageSquareQuote,
  HelpCircle,
  Scale,
  Smile,
  RefreshCw,
  FileDown,
  CalendarClock,
} from 'lucide-react'

export const NAV_ITEMS = [
  { path: '/', label: '首頁', icon: LayoutDashboard },
  { path: '/schedule', label: '當週時間表', icon: CalendarClock },
  { path: '/exam', label: '考試排程', icon: Calendar },
  { path: '/memory', label: '記憶曲線複習', icon: Brain },
  { path: '/study-plan', label: '讀書規劃', icon: BookMarked },
  { path: '/quotes', label: '語錄庫', icon: MessageSquareQuote },
  { path: '/quiz', label: '理解測驗', icon: HelpCircle },
  { path: '/weights', label: '複習權重', icon: Scale },
  { path: '/mood-schedule', label: '心情排程', icon: Smile },
  { path: '/overdue', label: '逾期重分配', icon: RefreshCw },
  { path: '/export', label: '匯出 PDF', icon: FileDown },
]
