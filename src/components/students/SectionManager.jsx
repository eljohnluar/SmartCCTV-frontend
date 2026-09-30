import { useAuth } from '../../context/AuthContext'
import { assignableSections, COLLEGE_SECTIONS, YEAR_LEVELS } from '../../utils/constants'

export default function SectionManager({ section, gradeLevel, onSectionChange, onGradeLevelChange }) {
  const { user } = useAuth()
  const scopedSections = assignableSections(user?.year_levels, user?.sections)
  const allowed = scopedSections.length > 0 ? scopedSections : COLLEGE_SECTIONS
  const yearSections = gradeLevel ? allowed.filter((s) => s.startsWith(gradeLevel)) : allowed

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label className="block text-xs text-slate-400 mb-1.5">Year Level</label>
        <select
          value={gradeLevel}
          onChange={(e) => {
            onGradeLevelChange(e.target.value)
            if (section && section.startsWith(gradeLevel) && !section.startsWith(e.target.value)) {
              onSectionChange('')
            }
          }}
          className="w-full px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50"
        >
          <option value="">All Years</option>
          {YEAR_LEVELS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-xs text-slate-400 mb-1.5">Section</label>
        <select
          value={section}
          onChange={(e) => onSectionChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50"
        >
          <option value="">All Sections</option>
          {yearSections.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  )
}
