import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatTime } from '../../utils/helpers'
import Badge from '../common/Badge'
import LoadingSpinner from '../common/LoadingSpinner'

export default function AttendanceTable({ records, loading }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchSearch = r.student_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.student_code?.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [records, search, statusFilter])

  return (
    <div className="flex h-full min-h-[460px] flex-col overflow-hidden rounded-2xl border border-[#263449] bg-[#111a27]/80 shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-[#263449] px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex-1"><h2 className="text-sm font-semibold text-white">Today's attendance</h2><p className="mt-0.5 text-[11px] text-slate-500">Live check-ins and manual records</p></div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-44 rounded-lg border border-[#2b3b51] bg-[#172235] py-1.5 pl-8 pr-3 text-xs text-slate-300 placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-[#2b3b51] bg-[#172235] px-2 py-1.5">
            <SlidersHorizontal size={12} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center py-16"><LoadingSpinner /></div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#263449] bg-[#0d1521]/50">
                {['Student', 'ID', 'Section', 'Status', 'Check-in', 'Confidence'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263449]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-600">
                    No records found
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-emerald-400/[0.025]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#263449] text-xs font-medium text-slate-300">
                          {r.student_name?.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <span className="text-sm text-white font-medium">{r.student_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500 font-mono">{r.student_code}</td>
                    <td className="px-5 py-3 text-xs text-slate-400">{r.section}</td>
                    <td className="px-5 py-3"><Badge status={r.status} /></td>
                    <td className="px-5 py-3 text-xs text-slate-400">{formatTime(r.check_in_time)}</td>
                    <td className="px-5 py-3 text-xs text-slate-400">
                      {r.confidence != null ? `${(r.confidence * 100).toFixed(1)}%` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
