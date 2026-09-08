import { GRADE_LEVELS, SECTIONS } from '../../utils/constants'

export default function SectionManager({ section, gradeLevel, onSectionChange, onGradeLevelChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label className="block text-xs text-slate-400 mb-1.5">Section</label>
        <select
          value={section}
          onChange={(e) => onSectionChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50"
        >
          <option value="">All Sections</option>
          {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-xs text-slate-400 mb-1.5">Grade Level</label>
        <select
          value={gradeLevel}
          onChange={(e) => onGradeLevelChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50"
        >
          <option value="">All Grades</option>
          {GRADE_LEVELS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
    </div>
  )
}
