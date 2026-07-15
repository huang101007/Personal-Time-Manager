import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Menu, X, ChevronRight } from 'lucide-react'
import { NAV_ITEMS } from '../config/nav'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div className="app-bg" aria-hidden />

      <header className="sticky top-0 z-40 lg:hidden glass-card-strong border-b border-white/60 rounded-none px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          aria-label="開啟選單"
        >
          <Menu size={22} />
        </button>
        <span className="font-semibold text-sm tracking-wide">智慧時間管理器</span>
        <div className="w-10" />
      </header>

      <div className="flex min-h-screen">
        <aside
          className={`
            fixed lg:sticky top-0 left-0 z-50 h-screen w-64 shrink-0
            glass-card-strong border-r border-white/50
            transform transition-transform duration-300 ease-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="flex flex-col h-full p-5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Study Planner
                </p>
                <h1 className="text-lg font-semibold mt-0.5">智慧時間管理</h1>
              </div>
              <button
                type="button"
                className="lg:hidden p-1.5 rounded-lg hover:bg-white/50"
                onClick={() => setSidebarOpen(false)}
                aria-label="關閉選單"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-0.5 pr-1">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-medium'
                        : 'text-[var(--color-text-soft)] hover:bg-white/40'
                    }`
                  }
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span className="truncate">{label}</span>
                  <ChevronRight size={14} className="ml-auto opacity-40" />
                </NavLink>
              ))}
            </nav>

            <p className="text-[10px] text-[var(--color-muted)] mt-4 text-center">
              資料儲存於本機瀏覽器
            </p>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="關閉遮罩"
          />
        )}

        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl mx-auto pb-16">
          <Outlet />
        </main>
      </div>
    </>
  )
}
