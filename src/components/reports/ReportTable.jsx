import { Download } from 'lucide-react'
import { useState } from 'react'
import { formatDate, formatTime } from '../../utils/helpers'
import Badge from '../common/Badge'
import LoadingSpinner from '../common/LoadingSpinner'

const PAGE_SIZE = 15

export default function ReportTable({ records, loading, onExportCSV }) {
  const [page, setPage] = useState(0)
  const total = records.length
  const pages = Math.ceil(total / PAGE_SIZE)
  const slice = records.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d3148]">
        <h2 className="text-sm font-semibold text-white">Detailed Records</h2>
        <button onClick={onExportCSV}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#242836] border border-[#2d3148] rounded-lg hover:border-green-500/30 hover:text-green-400 transition-colors">
          <Download size={13} /> Export CSV
        </button>
      </div>
      {loading ? <div className="py-16"><LoadingSpinner /></div> : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2d3148]">
                  {['Date', 'Student', 'Section', 'Status', 'Check-in Time', 'Confidence'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3148]">
                {slice.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-600">No records for selected filters</td></tr>
                ) : slice.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">{formatDate(r.class_date, { month: 'short', day: 'numeric' })}</td>
                    <td className="px-5 py-3 text-sm text-white font-medium">{r.student_name}</td>
                    <td className="px-5 py-3 text-xs text-slate-400">{r.section}</td>
                    <td className="px-5 py-3"><Badge status={r.status} /></td>
                    <td className="px-5 py-3 text-xs text-slate-400">{formatTime(r.check_in_time)}</td>
                    <td className="px-5 py-3 text-xs text-slate-400">{r.confidence != null ? `${(r.confidence * 100).toFixed(1)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#2d3148]">
              <span className="text-xs text-slate-500">{total} records</span>
              <div className="flex gap-2">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 text-xs rounded-lg bg-[#242836] text-slate-400 hover:text-white disabled:opacity-30 transition-colors">Prev</button>
                <span className="px-3 py-1 text-xs text-slate-400">{page + 1} / {pages}</span>
                <button disabled={page === pages - 1} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 text-xs rounded-lg bg-[#242836] text-slate-400 hover:text-white disabled:opacity-30 transition-colors">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
