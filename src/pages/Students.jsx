import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { assignableSections } from '../utils/constants'
import { useStudents } from '../hooks/useStudents'
import StudentList from '../components/students/StudentList'
import StudentForm from '../components/students/StudentForm'
import FaceEnrollment from '../components/students/FaceEnrollment'

export default function Students() {
  const { user } = useAuth()
  const { students, loading, addStudent, editStudent, removeStudent } = useStudents()
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
    if (editingStudent) {
      await editStudent(editingStudent.id, formData)
    } else {
      await addStudent(formData)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await removeStudent(id)
    }
  }

  const handleEnroll = (student) => {
    setEnrollStudent(student)
  }

  return (
    <div className="space-y-6">
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
