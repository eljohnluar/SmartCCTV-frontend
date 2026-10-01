import { useCallback, useEffect, useRef, useState } from 'react'
import { useAttendance } from '../hooks/useAttendance'
import { usePasswordConfirm } from '../hooks/usePasswordConfirm'
import StatsCards from '../components/dashboard/StatsCards'
import AttendanceTable from '../components/dashboard/AttendanceTable'
import AIStatusIndicator from '../components/dashboard/AIStatusIndicator'
import QuickActions from '../components/dashboard/QuickActions'
import AlertsFeed from '../components/dashboard/AlertsFeed'
import LiveCameraFeed from '../components/dashboard/LiveCameraFeed'
import AttendanceLog from '../components/dashboard/AttendanceLog'
import AttendanceRecognitionOverlay from '../components/dashboard/AttendanceRecognitionOverlay'
import CheckinTimeSchedule from '../components/dashboard/CheckinTimeSchedule'
import { wsClient } from '../services/websocket'
import { resetAlerts } from '../services/api'

export default function Dashboard() {
  const { attendance, stats, loading, refetch, resetToday } = useAttendance()
  const { confirm, dialog } = usePasswordConfirm()
  const [recognition, setRecognition] = useState(null)
  const [attendanceLogOpen, setAttendanceLogOpen] = useState(false)
  const dismissTimer = useRef(null)
  const displayedAttendance = useRef(new Set())

  const handleAttendanceLogToggle = useCallback((action) => {
    setAttendanceLogOpen(action === 'open')
  }, [])


  useEffect(() => {
    const unsubAttendance = wsClient.on('attendance', (event) => {
      const attendanceDate = event.class_date || event.record?.class_date || new Date().toISOString().slice(0, 10)
      const eventKey = `${event.student_id}:${attendanceDate}`
      if (displayedAttendance.current.has(eventKey)) return
      displayedAttendance.current.add(eventKey)
      clearTimeout(dismissTimer.current)
      setRecognition(event)
      dismissTimer.current = setTimeout(() => setRecognition(null), 2000)
    })
    const unsubReset = wsClient.on('attendance_reset', () => {
      displayedAttendance.current.clear()
      setRecognition(null)
    })
    return () => {
      unsubAttendance()
      unsubReset()
      clearTimeout(dismissTimer.current)
    }
  }, [])

  const handleReset = async () => {
    const done = await confirm((password) => resetToday(password), {
      title: 'Confirm attendance reset',
      description: 'This clears every check-in recorded today for all students.',
      confirmLabel: 'Reset attendance',
    })
    if (!done) return false
    displayedAttendance.current.clear()
    setRecognition(null)
    return true
  }

  const handleResetAlerts = () =>
    confirm((password) => resetAlerts(password), {
      title: 'Confirm alerts reset',
      description: 'This deletes every security alert on record and resets detection cooldowns.',
      confirmLabel: 'Reset alerts',
    })

  return (
    <>
      {dialog}
      <AttendanceRecognitionOverlay recognition={recognition} />
      <div className="mx-auto max-w-[1600px] space-y-6 pb-8">

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(350px,0.85fr)]">
        <LiveCameraFeed attendanceRecords={attendance} />
        <AttendanceLog
          records={attendance}
          loading={loading}
          open={attendanceLogOpen}
          onClose={handleAttendanceLogToggle}
        />
      </div>

      <CheckinTimeSchedule />

      <StatsCards stats={stats} loading={loading} />

      <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-3">
        <div className="flex flex-col xl:col-span-2">
          <AttendanceTable records={attendance} loading={loading} />
        </div>
        <div className="flex flex-col xl:col-span-1">
          <AlertsFeed />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <AIStatusIndicator />
        <QuickActions
          onRefresh={refetch}
          onResetAttendance={handleReset}
          onResetAlerts={handleResetAlerts}
        />
      </div>
      </div>
    </>
  )
}
