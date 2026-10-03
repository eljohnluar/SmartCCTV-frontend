import { PlusCircle, RefreshCw, RotateCcw, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function QuickActions({ onRefresh, onResetAttendance }) {
  const navigate = useNavigate()
  const [resettingAttendance, setResettingAttendance] = useState(false)

  const handleResetAttendance = async () => {
    const fn = onResetAttendance
    if (!fn) return

    setResettingAttendance(true)
    try {
      const done = await fn()
      if (done === false) return
      toast.success("Today's marked attendance has been reset")
    } catch (error) {
      toast.error(error.message || 'Failed to reset attendance')
    } finally {
      setResettingAttendance(false)
    }
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-[#263449] bg-[#111a27]/80 p-5 sm:p-6">
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">Quick actions</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
        </div>
      </div>
    </div>
  )
}
