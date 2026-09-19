import { PlusCircle, RefreshCw, RotateCcw, ShieldAlert, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function QuickActions({ onRefresh, onReset, onResetAttendance, onResetAlerts }) {
  const navigate = useNavigate()
  const [resettingAttendance, setResettingAttendance] = useState(false)
  const [resettingAlerts, setResettingAlerts] = useState(false)

  const handleResetAttendance = async () => {
    const fn = onResetAttendance || onReset
    if (!fn) return
    const confirmed = window.confirm("Are you sure you want to reset today's marked attendance? All check-ins for today will be cleared.")
    if (!confirmed) return

    setResettingAttendance(true)
    try {
      await fn()
      toast.success("Today's marked attendance has been reset")
    } catch (error) {
      toast.error(error.message || 'Failed to reset attendance')
    } finally {
      setResettingAttendance(false)
    }
  }

  const handleResetAlerts = async () => {
    if (!onResetAlerts) return
    const confirmed = window.confirm("Are you sure you want to reset security alerts? All active security and threat alerts will be cleared.")
    if (!confirmed) return

    setResettingAlerts(true)
    try {
      await onResetAlerts()
      toast.success("Security alerts have been reset")
    } catch (error) {
      toast.error(error.message || 'Failed to reset security alerts')
    } finally {
      setResettingAlerts(false)
    }
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-[#263449] bg-[#111a27]/80 p-5 sm:p-6">
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">Quick actions</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          <button
            onClick={() => navigate('/students')}
            className="flex min-h-11 flex-col items-center justify-center gap-1.5 rounded-xl bg-emerald-400/10 px-2 py-3 text-center text-[11px] font-medium text-emerald-300 transition-colors hover:bg-emerald-400/20 sm:flex-row"
          >
            <PlusCircle size={16} />
            <span>Add student</span>
          </button>
          <button
            onClick={onRefresh}
            className="flex min-h-11 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#172235] px-2 py-3 text-center text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/5 sm:flex-row"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="flex min-h-11 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#172235] px-2 py-3 text-center text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/5 sm:flex-row"
          >
            <UserCheck size={16} />
            <span>Reports</span>
          </button>
          <button
            onClick={handleResetAttendance}
            disabled={resettingAttendance}
            title="Reset marked attendance for today"
            className="flex min-h-11 flex-col items-center justify-center gap-1.5 rounded-xl bg-red-400/10 px-2 py-3 text-center text-[11px] font-medium text-red-300 transition-colors hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-row"
          >
            <RotateCcw size={16} className={resettingAttendance ? 'animate-spin' : ''} />
            <span>{resettingAttendance ? 'Resetting…' : 'Reset attendance'}</span>
          </button>
          <button
            onClick={handleResetAlerts}
            disabled={resettingAlerts}
            title="Reset security and threat alerts"
            className="flex min-h-11 flex-col items-center justify-center gap-1.5 rounded-xl bg-amber-400/10 px-2 py-3 text-center text-[11px] font-medium text-amber-300 transition-colors hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-row"
          >
            <ShieldAlert size={16} className={resettingAlerts ? 'animate-spin' : ''} />
            <span>{resettingAlerts ? 'Resetting…' : 'Reset alerts'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
