import { PlusCircle, RefreshCw, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function QuickActions({ onRefresh }) {
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-[#263449] bg-[#111a27]/80 p-5 sm:p-6">
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">Quick actions</h2>
        <div className="grid grid-cols-3 gap-2">
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
        </div>
      </div>
    </div>
  )
}
