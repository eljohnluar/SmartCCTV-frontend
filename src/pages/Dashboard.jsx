import { useAttendance } from '../hooks/useAttendance'
import StatsCards from '../components/dashboard/StatsCards'
import AttendanceTable from '../components/dashboard/AttendanceTable'
import AIStatusIndicator from '../components/dashboard/AIStatusIndicator'
import QuickActions from '../components/dashboard/QuickActions'
import AlertsFeed from '../components/dashboard/AlertsFeed'
import LiveCameraFeed from '../components/dashboard/LiveCameraFeed'
import AttendanceLog from '../components/dashboard/AttendanceLog'
export default function Dashboard() {
  const { attendance, stats, loading, refetch } = useAttendance()

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-8">

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(350px,0.85fr)]">
        <LiveCameraFeed />
        <AttendanceLog records={attendance} loading={loading} />
      </div>

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
        <QuickActions onRefresh={refetch} />
      </div>
    </div>
  )
}
