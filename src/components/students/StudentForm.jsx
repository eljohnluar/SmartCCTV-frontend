import { Save } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { assignableSections, COLLEGE_SECTIONS, yearLevelOfSection } from '../../utils/constants'
import Modal from '../common/Modal'

const EMPTY = { student_id: '', full_name: '', section: '', grade_level: '', photo_url: '' }

export default function StudentForm({ open, onClose, student, onSave }) {
  const isEdit = !!student
  const { user } = useAuth()
  const [form, setForm] = useState(student ?? EMPTY)
  const [saving, setSaving] = useState(false)

  const scopedSections = assignableSections(user?.year_levels, user?.sections)
  const isRestricted = scopedSections.length > 0
  const allowedSections = isRestricted ? scopedSections : COLLEGE_SECTIONS
  const isOutsideScope = !!form.section && !allowedSections.includes(form.section)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.full_name.trim() || !form.student_id.trim()) {
      toast.error('Name and Student ID are required')
      return
    }
    setSaving(true)
    try {
      await onSave({ ...form, grade_level: yearLevelOfSection(form.section) || form.grade_level })
      toast.success(isEdit ? 'Student updated' : 'Student added')
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-green-500/50"
      />
    </div>
  )

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Student' : 'Add Student'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {field('Full Name', 'full_name', 'text', 'e.g. Maria Santos')}
          {field('Student ID', 'student_id', 'text', 'e.g. STU-001')}
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Section</label>
          <select value={form.section} onChange={(e) => set('section', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 focus:outline-none focus:border-green-500/50">
            <option value="">Select section</option>
            {allowedSections.map((s) => <option key={s} value={s}>{s}</option>)}
            {isOutsideScope && (
              <option value={form.section}>{`${form.section} (outside your sections)`}</option>
            )}
          </select>
          <p className="mt-1.5 text-xs text-slate-500">Year level is taken from the section.</p>
          {isRestricted && (
            <p className="mt-1 text-xs text-slate-600">Showing the sections assigned to your account.</p>
          )}
        </div>
        {field('Photo URL (optional)', 'photo_url', 'url', 'https://...')}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-500 text-black rounded-lg hover:bg-green-400 disabled:opacity-50 transition-colors">
            <Save size={14} />{saving ? 'Saving...' : 'Save Student'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
