import { RefreshCw } from 'lucide-react'
import AttendanceTable from '../components/dashboard/AttendanceTable'
import StatsCards from '../components/dashboard/StatsCards'
import SectionScopeNotice from '../components/common/SectionScopeNotice'
import { useAttendance } from '../hooks/useAttendance'

export default function Attendance() {
  const { attendance, stats, loading, refetch } = useAttendance()

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
      <SectionScopeNotice />

      <div className="flex justify-end">
        <button
          onClick={refetch}
          className="flex min-h-11 items-center gap-2 rounded-xl bg-[#172235] px-4 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/5"
        >
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      <StatsCards stats={stats} loading={loading} />

      <AttendanceTable records={attendance} loading={loading} />
    </div>
  )
}
