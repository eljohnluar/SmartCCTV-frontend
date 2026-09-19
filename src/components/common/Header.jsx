import { Bell, RefreshCw, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { todayLabel } from '../../utils/helpers'
import { SYSTEM_STATUS } from '../../utils/constants'

export default function Header({ title }) {
  const { systemStatus, cameraActive, aiActive, notifications, unreadCount, markRead, clearNotifications, refreshStatus } = useApp()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Format in strict 24-hour time (HH:MM:SS)
  const time24 = currentTime.toLocaleTimeString('en-GB', { hour12: false })

  const statusColor = {
    [SYSTEM_STATUS.ONLINE]: 'text-green-400',
    [SYSTEM_STATUS.PROCESSING]: 'text-amber-400',
    [SYSTEM_STATUS.OFFLINE]: 'text-slate-500',
    [SYSTEM_STATUS.ERROR]: 'text-red-400',
  }[systemStatus] ?? 'text-slate-500'

  const statusDot = {
    [SYSTEM_STATUS.ONLINE]: 'bg-green-400',
    [SYSTEM_STATUS.PROCESSING]: 'bg-amber-400 animate-pulse',
    [SYSTEM_STATUS.OFFLINE]: 'bg-slate-500',
    [SYSTEM_STATUS.ERROR]: 'bg-red-400',
  }[systemStatus] ?? 'bg-slate-500'

  return (
    <header className="flex min-h-[76px] items-center justify-between border-b border-[#263449] bg-[#080d15]/80 px-4 py-4 backdrop-blur-xl sm:px-6">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-0.5 text-xs text-slate-500">{todayLabel()}</p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* 24-Hour Time Clock */}
        <div className="flex items-center gap-1.5 rounded-full border border-[#263449] bg-[#111a27]/80 px-3 py-1.5 font-mono text-xs text-cyan-300 shadow-sm">
          <Clock size={13} className="text-cyan-400" />
          <span className="font-semibold tracking-wider">{time24}</span>
        </div>

        {/* System status */}
        <div className="hidden items-center gap-2 rounded-full border border-[#263449] bg-[#111a27]/80 px-3 py-1.5 sm:flex">
          <span className={`w-2 h-2 rounded-full ${statusDot}`} />
          <span className={`text-xs font-medium capitalize ${statusColor}`}>{systemStatus}</span>
          {cameraActive && <span className="text-[10px] text-slate-500 border-l border-[#2d3148] pl-2">Cam</span>}
          {aiActive && <span className="text-[10px] text-slate-500">AI</span>}
        </div>

        {/* Refresh */}
        <button
          onClick={refreshStatus}
          aria-label="Refresh status"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <RefreshCw size={16} />
        </button>

        {/* Notifications */}
        <div className="relative group">
          <button
            onClick={markRead}
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          <div className="
            absolute right-0 top-full mt-2 w-72
            border border-[#263449] bg-[#111a27] rounded-xl shadow-2xl
            opacity-0 group-focus-within:opacity-100 pointer-events-none group-focus-within:pointer-events-auto
            transition-opacity z-50
          ">
            <div className="flex items-center justify-between border-b border-[#263449] px-4 py-3">
              <span className="text-sm font-medium text-white">Notifications</span>
              {notifications.length > 0 && (
                <button onClick={clearNotifications} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  Clear all
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-slate-500">No notifications</div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <div key={n.id} className="border-b border-[#263449] px-4 py-3 last:border-0">
                    <p className="text-xs text-slate-300">{n.message}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {new Date(n.timestamp).toLocaleTimeString('en-GB', { hour12: false })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
