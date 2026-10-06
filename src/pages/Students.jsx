import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { assignableSections } from '../utils/constants'
import { useStudents } from '../hooks/useStudents'
import { usePasswordConfirm } from '../hooks/usePasswordConfirm'
import StudentList from '../components/students/StudentList'
import StudentForm from '../components/students/StudentForm'
import FaceEnrollment from '../components/students/FaceEnrollment'
import SectionScopeNotice from '../components/common/SectionScopeNotice'

export default function Students() {
  const { user } = useAuth()
  const { students, loading, addStudent, editStudent, removeStudent } = useStudents()
  const { confirm, dialog } = usePasswordConfirm()
  const [formOpen, setFormOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [enrollStudent, setEnrollStudent] = useState(null)

  const scopedSections = assignableSections(user?.year_levels, user?.sections)
  const scopeSummary = scopedSections.length > 0
    ? user.year_levels.map((year) => `${year} ${user.sections.join(', ')}`).join(' · ')
    : ''

  const handleAdd = () => {
    setEditingStudent(null)
    setFormOpen(true)
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormOpen(true)
  }

  const handleSave = async (formData) => {
    if (editingStudent) return editStudent(editingStudent.id, formData)
    return confirm((password) => addStudent(formData, password), {
      title: 'Confirm new student',
      description: `Adding ${formData.full_name} (${formData.student_id}) to the roster requires your password.`,
      confirmLabel: 'Add student',
    })
  }

  const handleDelete = async (id) => {
    await confirm((password) => removeStudent(id, password), {
      title: 'Confirm student deletion',
      description: 'Removing a student also hides their attendance history. Enter your password to continue.',
      confirmLabel: 'Delete student',
    })
  }

  const handleEnroll = (student) => {
    setEnrollStudent(student)
  }

  return (
    <div className="space-y-6">
      {dialog}
      <SectionScopeNotice />
      {scopeSummary && (
        <p className="text-xs text-slate-500 -mb-3">Your sections: {scopeSummary}</p>
      )}
      <StudentList
        students={students}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onEnroll={handleEnroll}
      />

      {formOpen && (
        <StudentForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          student={editingStudent}
          onSave={handleSave}
        />
      )}

      {enrollStudent && (
        <FaceEnrollment
          open={!!enrollStudent}
          onClose={() => setEnrollStudent(null)}
          student={enrollStudent}
        />
      )}
    </div>
  )
}
