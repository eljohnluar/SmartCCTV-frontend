import { Edit2, Scan, Search, Trash2, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getInitials } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

export default function StudentList({ students, loading, onAdd, onEdit, onDelete, onEnroll }) {
  const [search, setSearch] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')

  const sections = useMemo(() => [...new Set(students.map((s) => s.section).filter(Boolean))], [students])

  const filtered = useMemo(() => students.filter((s) => {
    const matchSearch = s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id?.toLowerCase().includes(search.toLowerCase())
    const matchSection = !sectionFilter || s.section === sectionFilter
    return matchSearch && matchSection
  }), [students, search, sectionFilter])

  return (
    <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-[#2d3148]">
        <p className="text-sm font-semibold text-white flex-1">{students.length} Students</p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#242836] border border-[#2d3148] rounded-lg text-slate-300 placeholder-slate-600 focus:outline-none focus:border-green-500/50 w-40" />
          </div>
          <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
            className="px-2 py-1.5 text-xs bg-[#242836] border border-[#2d3148] rounded-lg text-slate-300 focus:outline-none focus:border-green-500/50">
            <option value="">All Sections</option>
            {sections.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors">
            <UserPlus size={13} /> Add Student
          </button>
        </div>
      </div>

      {loading ? <div className="py-20"><LoadingSpinner /></div> : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2d3148]">
                {['Student', 'ID', 'Section', 'Grade', 'Face', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3148]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {s.photo_url
                        ? <img src={s.photo_url} alt={s.full_name} className="w-8 h-8 rounded-full object-cover" />
                        : <div className="w-8 h-8 rounded-full bg-[#2d3148] flex items-center justify-center text-xs font-medium text-slate-400">{getInitials(s.full_name)}</div>
                      }
                      <span className="text-sm text-white font-medium">{s.full_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-mono text-slate-500">{s.student_id}</td>
                  <td className="px-5 py-3 text-xs text-slate-400">{s.section || '—'}</td>
                  <td className="px-5 py-3 text-xs text-slate-400">{s.grade_level || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                      s.has_face
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.has_face ? 'bg-green-400' : 'bg-slate-600'}`} />
                      {s.has_face ? `Enrolled${s.gesture_enrolled ? ' · Palm' : ''}` : 'None'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onEnroll(s)} title="Enroll face"
                        className="p-1.5 rounded text-slate-500 hover:text-green-400 hover:bg-green-500/10 transition-colors">
                        <Scan size={14} />
                      </button>
                      <button onClick={() => onEdit(s)} title="Edit"
                        className="p-1.5 rounded text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => onDelete(s.id)} title="Delete"
                        className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-600">No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
