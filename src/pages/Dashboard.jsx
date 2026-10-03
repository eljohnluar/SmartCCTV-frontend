import { useAttendance } from '../hooks/useAttendance'
import { usePasswordConfirm } from '../hooks/usePasswordConfirm'
import StatsCards from '../components/dashboard/StatsCards'
import AttendanceTable from '../components/dashboard/AttendanceTable'
import QuickActions from '../components/dashboard/QuickActions'

export default function Dashboard() {
  const { attendance, stats, loading, refetch, resetToday } = useAttendance()
  const { confirm, dialog } = usePasswordConfirm()

  const handleReset = async () => {
    const done = await confirm((password) => resetToday(password), {
      title: 'Confirm attendance reset',
      description: 'This clears every check-in recorded today for all students.',
      confirmLabel: 'Reset attendance',
    })
    return done
  }

  return (
    <>
      {dialog}
      <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
        <StatsCards stats={stats} loading={loading} />

        <AttendanceTable records={attendance} loading={loading} />

        <QuickActions onRefresh={refetch} onResetAttendance={handleReset} />
      </div>
    </>
  )
}
