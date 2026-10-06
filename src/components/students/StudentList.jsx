import { Download, Edit2, Printer, Scan, Search, Trash2, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useSectionScope } from '../../hooks/useSectionScope'
import { getInitials } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export default function StudentList({ students, loading, onAdd, onEdit, onDelete, onEnroll }) {
  const { assignedSections } = useSectionScope()
  const [search, setSearch] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')

  const sections = useMemo(() => {
    const legacy = [...new Set(students.map((s) => s.section).filter(Boolean))]
    if (assignedSections.length > 0) {
      return [...assignedSections, ...legacy.filter((s) => !assignedSections.includes(s))]
    }
    return legacy
  }, [students, assignedSections])

  const filtered = useMemo(() => students.filter((s) => {
    const matchSearch = s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id?.toLowerCase().includes(search.toLowerCase())
    const matchSection = !sectionFilter || s.section === sectionFilter
    return matchSearch && matchSection
  }), [students, search, sectionFilter])

  const exportScopeLabel = useMemo(() => {
    const parts = []
    if (sectionFilter) parts.push(`Section: ${sectionFilter}`)
    if (search.trim()) parts.push(`Search: "${search.trim()}"`)
    return parts.length ? parts.join(' · ') : 'All students'
  }, [sectionFilter, search])

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error('No students to export.')
      return
    }
    const headers = ['Name', 'Student ID', 'Section', 'Year Level', 'Face Enrollment']
    const rows = filtered.map((s) => [
      `"${String(s.full_name ?? '').replace(/"/g, '""')}"`,
      s.student_id || '',
      `"${String(s.section ?? '').replace(/"/g, '""')}"`,
      s.grade_level || '',
      s.has_face ? `Enrolled${s.gesture_enrolled ? ' (Palm)' : ''}` : 'None',
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csvContent))
    link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Student list exported as CSV.')
  }

  const handleExportPDF = () => {
    if (filtered.length === 0) {
      toast.error('No students to export.')
      return
    }
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      toast.error('Please allow pop-ups to export the PDF.')
      return
    }

    const rows = filtered.map((s) => `
      <tr>
        <td>${escapeHtml(s.full_name)}</td>
        <td>${escapeHtml(s.student_id)}</td>
        <td>${escapeHtml(s.section)}</td>
        <td>${escapeHtml(s.grade_level)}</td>
        <td>${escapeHtml(s.has_face ? `Enrolled${s.gesture_enrolled ? ' · Palm' : ''}` : 'None')}</td>
      </tr>`).join('')

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Student Roster</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; margin: 24px; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    .scope { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
    .meta { font-size: 11px; color: #6b7280; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: left; }
    th { background: #f3f4f6; }
    tr:nth-child(even) td { background: #f9fafb; }
    .footer { margin-top: 16px; font-size: 10px; color: #9ca3af; }
    @media print { .footer { position: fixed; bottom: 0; } }
  </style>
</head>
<body>
  <h1>SmartCCTV · Student Roster</h1>
  <p class="scope">${escapeHtml(exportScopeLabel)}</p>
  <p class="meta">Generated on ${escapeHtml(new Date().toLocaleString())} · ${filtered.length} student${filtered.length === 1 ? '' : 's'}</p>
  <table>
    <thead>
      <tr><th>Name</th><th>Student ID</th><th>Section</th><th>Year Level</th><th>Face Enrollment</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="footer">SmartCCTV — AI Vision &amp; Attendance System</p>
  <script>window.onload = function () { setTimeout(function () { window.focus(); window.print(); }, 300); }</script>
</body>
</html>`)
    printWindow.document.close()
  }

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
          <button onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#242836] border border-[#2d3148] rounded-lg text-slate-300 hover:border-green-500/30 hover:text-green-400 transition-colors">
            <Printer size={13} /> Export PDF
          </button>
          <button onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#242836] border border-[#2d3148] rounded-lg text-slate-300 hover:border-green-500/30 hover:text-green-400 transition-colors">
            <Download size={13} /> Export CSV
          </button>
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
                {['Student', 'ID', 'Section', 'Year Level', 'Face', 'Actions'].map((h) => (
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
