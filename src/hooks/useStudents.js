import { useCallback, useEffect, useState } from 'react'
import { createStudent, deleteStudent, getStudents, updateStudent } from '../services/api'

export function useStudents(filters = {}) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getStudents(filters)
      setStudents(data ?? [])
    } catch (err) {
      console.warn('[useStudents] Using mock data:', err.message)
      // Fallback mock data when backend is not running
      setStudents(MOCK_STUDENTS)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const addStudent = useCallback(async (studentData) => {
    const created = await createStudent(studentData)
    setStudents((prev) => [created, ...prev])
    return created
  }, [])

  const editStudent = useCallback(async (id, studentData) => {
    const updated = await updateStudent(id, studentData)
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)))
    return updated
  }, [])

  const removeStudent = useCallback(async (id) => {
    await deleteStudent(id)
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return { students, loading, error, refetch: fetchStudents, addStudent, editStudent, removeStudent }
}

// Mock data for offline / no-backend mode
const MOCK_STUDENTS = [
  { id: 1, student_id: 'STU-001', full_name: 'Maria Santos', section: 'Section A', grade_level: 'Grade 10', has_face: true, photo_url: null },
  { id: 2, student_id: 'STU-002', full_name: 'Juan Dela Cruz', section: 'Section A', grade_level: 'Grade 10', has_face: true, photo_url: null },
  { id: 3, student_id: 'STU-003', full_name: 'Ana Reyes', section: 'Section B', grade_level: 'Grade 11', has_face: false, photo_url: null },
  { id: 4, student_id: 'STU-004', full_name: 'Carlos Mendoza', section: 'Section B', grade_level: 'Grade 11', has_face: true, photo_url: null },
  { id: 5, student_id: 'STU-005', full_name: 'Elena Garcia', section: 'Section C', grade_level: 'Grade 9', has_face: false, photo_url: null },
  { id: 6, student_id: 'STU-006', full_name: 'Miguel Torres', section: 'Section C', grade_level: 'Grade 9', has_face: true, photo_url: null },
  { id: 7, student_id: 'STU-007', full_name: 'Sofia Ramos', section: 'Section A', grade_level: 'Grade 10', has_face: true, photo_url: null },
  { id: 8, student_id: 'STU-008', full_name: 'Luis Bautista', section: 'Section D', grade_level: 'Grade 12', has_face: false, photo_url: null },
]

export default useStudents
