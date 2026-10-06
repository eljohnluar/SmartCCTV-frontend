import { Info } from 'lucide-react'
import { useSectionScope } from '../../hooks/useSectionScope'

/** Shown on teacher pages until an administrator assigns year levels and sections. */
export default function SectionScopeNotice() {
  const { needsAssignment } = useSectionScope()
  if (!needsAssignment) return null

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/5 px-4 py-3">
      <Info size={16} className="mt-0.5 shrink-0 text-amber-300" />
      <div>
        <p className="text-sm font-medium text-amber-200">No sections assigned yet</p>
        <p className="mt-0.5 text-xs text-slate-400">
          Ask an administrator to assign your year levels and sections. Students and attendance for your classes
          will appear here once they do.
        </p>
      </div>
    </div>
  )
}
