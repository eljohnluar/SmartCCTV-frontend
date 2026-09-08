import {
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useApp()

  return (
    <aside
      className={`
        relative flex flex-col h-screen border-r border-[#263449] bg-[#0d1521]/95 backdrop-blur-xl
        transition-all duration-300 ease-in-out shrink-0
        ${sidebarOpen ? 'w-60 max-lg:w-16' : 'w-16'}
      `}
    >
      {/* Logo */}
      <div className="flex min-h-[76px] items-center gap-3 border-b border-[#263449] px-4 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_0_22px_rgba(50,213,131,0.18)]" aria-hidden="true">
          <img
            src="/logo-mark.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden max-lg:hidden">
            <p className="whitespace-nowrap text-sm font-semibold leading-tight text-white">SmartCCTV</p>
            <p className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">Security operations</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-x-hidden overflow-y-auto px-2 py-5">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `
              flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
              transition-colors duration-150 group relative
              ${isActive
                ? 'bg-emerald-400/10 text-emerald-300 shadow-[inset_2px_0_0_#32d583]'
                : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={`shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {sidebarOpen && <span className="whitespace-nowrap max-lg:hidden">{label}</span>}
                {!sidebarOpen && (
                  <div className="
                    absolute left-full ml-2 px-2 py-1 rounded-md
                    border border-[#263449] bg-[#172235] text-xs text-white whitespace-nowrap
                    opacity-0 group-hover:opacity-100 pointer-events-none
                    transition-opacity z-50
                  ">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System badge */}
      {sidebarOpen && (
        <div className="border-t border-[#263449] px-4 py-4 max-lg:hidden">
          <div className="flex items-center gap-2 text-slate-500">
            <Shield size={12} />
            <span className="text-[10px] font-medium uppercase tracking-[0.1em]">Secure workspace</span>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        className="
          absolute -right-3 top-20
          flex items-center justify-center w-6 h-6
          rounded-full border border-[#3b536f] bg-[#172235]
          text-slate-400 hover:bg-[#263449] hover:text-white
          transition-colors z-10
        "
      >
        {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  )
}
