import { Filter } from 'lucide-react'
import { SECTIONS } from '../../utils/constants'
import { toISODate } from '../../utils/helpers'

export default function ReportFilters({ filters, onChange }) {
  const set = (k, v) => onChange({ ...filters, [k]: v })
  const today = toISODate(new Date())
  const sevenAgo = toISODate(new Date(Date.now() - 7 * 86400000))

  return (
    <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={14} className="text-slate-400" />
        <h2 className="text-sm font-semibold text-white">Filters</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">From</label>
          <input type="date" value={filters.dateFrom || sevenAgo} max={today}
            onChange={(e) => set('dateFrom', e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">To</label>
          <input type="date" value={filters.dateTo || today} max={today}
            onChange={(e) => set('dateTo', e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Section</label>
          <select value={filters.section || ''} onChange={(e) => set('section', e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50">
            <option value="">All Sections</option>
            {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
