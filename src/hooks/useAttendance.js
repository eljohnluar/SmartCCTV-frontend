import { useCallback, useEffect, useState } from 'react'
import { getAttendanceByDate, getTodayAttendance, markAttendanceManual } from '../services/api'
import { toISODate } from '../utils/helpers'
import { wsClient } from '../services/websocket'

export function useAttendance(date = null) {
  const [attendance, setAttendance] = useState([])
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0, rate: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAttendance = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = date
        ? await getAttendanceByDate(toISODate(new Date(date)))
        : await getTodayAttendance()
      const records = data?.records ?? []
      setAttendance(records)
      setStats(computeStats(records))
    } catch (err) {
      console.warn('[useAttendance] Using mock data:', err.message)
      const mock = MOCK_ATTENDANCE
      setAttendance(mock)
      setStats(computeStats(mock))
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

  // The camera sends an event as soon as a face is confirmed. Update this view
  // directly so staff never need to refresh the dashboard to see a check-in.
  useEffect(() => {
    const unsubscribe = wsClient.on('attendance', (event) => {
      const record = {
        ...(event.record || {}),
        student_id: event.student_id,
        student_name: event.student_name,
        student_code: event.student_code,
        status: event.status || 'present',
        confidence: event.confidence,
        check_in_time: event.check_in_time || new Date().toISOString(),
        class_date: event.class_date,
      }
      setAttendance((previous) => {
        const existingIndex = previous.findIndex((item) => item.student_id === record.student_id)
        const next = existingIndex >= 0
          ? previous.map((item, index) => index === existingIndex ? { ...item, ...record } : item)
          : [record, ...previous]
        setStats(computeStats(next))
        return next
      })
    })
    return unsubscribe
  }, [])

  const markManual = useCallback(async (payload) => {
    const response = await markAttendanceManual(payload)
    const record = response.record || response
    setAttendance((prev) => {
      const idx = prev.findIndex((r) => r.student_id === record.student_id)
      let next
      if (idx >= 0) {
        next = [...prev]
        next[idx] = record
      } else {
        next = [record, ...prev]
      }
      setStats(computeStats(next))
      return next
    })
    return record
  }, [])

  return { attendance, stats, loading, error, refetch: fetchAttendance, markManual }
}

function computeStats(records) {
  const total = records.length
  const present = records.filter((r) => r.status === 'present').length
  const absent = records.filter((r) => r.status === 'absent').length
  const late = records.filter((r) => r.status === 'late').length
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0
  return { total, present, absent, late, rate }
}

const now = new Date().toISOString()

const MOCK_ATTENDANCE = [
  { id: 1, student_id: 1, student_name: 'Maria Santos', student_code: 'STU-001', section: 'Section A', status: 'present', check_in_time: now, confidence: 0.97 },
  { id: 2, student_id: 2, student_name: 'Juan Dela Cruz', student_code: 'STU-002', section: 'Section A', status: 'late', check_in_time: now, confidence: 0.91 },
  { id: 3, student_id: 3, student_name: 'Ana Reyes', student_code: 'STU-003', section: 'Section B', status: 'absent', check_in_time: null, confidence: null },
  { id: 4, student_id: 4, student_name: 'Carlos Mendoza', student_code: 'STU-004', section: 'Section B', status: 'present', check_in_time: now, confidence: 0.88 },
  { id: 5, student_id: 5, student_name: 'Elena Garcia', student_code: 'STU-005', section: 'Section C', status: 'absent', check_in_time: null, confidence: null },
  { id: 6, student_id: 6, student_name: 'Miguel Torres', student_code: 'STU-006', section: 'Section C', status: 'present', check_in_time: now, confidence: 0.95 },
  { id: 7, student_id: 7, student_name: 'Sofia Ramos', student_code: 'STU-007', section: 'Section A', status: 'present', check_in_time: now, confidence: 0.93 },
  { id: 8, student_id: 8, student_name: 'Luis Bautista', student_code: 'STU-008', section: 'Section D', status: 'late', check_in_time: now, confidence: 0.84 },
]

export default useAttendance
