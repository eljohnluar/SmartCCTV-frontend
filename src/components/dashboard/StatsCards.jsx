import { TrendingDown, TrendingUp, UserCheck, UserMinus, Users } from 'lucide-react'

const cards = [
  {
    key: 'rate',
    label: 'Attendance Rate',
    icon: TrendingUp,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    getValue: (s) => `${s.rate}%`,
    sub: (s) => s.rate >= 75 ? 'Above target' : 'Below target',
    subColor: (s) => s.rate >= 75 ? 'text-green-400' : 'text-red-400',
  },
  {
    key: 'present',
    label: 'Present Today',
    icon: UserCheck,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    getValue: (s) => s.present,
    sub: (s) => `${s.late} late`,
    subColor: () => 'text-amber-400',
  },
  {
    key: 'absent',
    label: 'Absent Today',
    icon: UserMinus,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    getValue: (s) => s.absent,
    sub: () => 'Unexcused',
    subColor: () => 'text-slate-500',
  },
  {
    key: 'total',
    label: 'Total Students',
    icon: Users,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    getValue: (s) => s.total,
    sub: () => 'Enrolled',
    subColor: () => 'text-slate-500',
  },
]

export default function StatsCards({ stats, loading }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color, bg, getValue, sub, subColor }) => (
        <div key={key} className="min-h-40 rounded-2xl border border-[#263449] bg-[#111a27]/80 p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#3b536f]">
          <div className="mb-4 flex items-start justify-between">
            <div className={`rounded-xl p-2.5 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <TrendingUp size={12} className="text-slate-600 mt-1" />
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-[#2d3148] rounded animate-pulse mb-1" />
          ) : (
            <p className="text-2xl font-semibold tracking-tight text-white">{getValue(stats)}</p>
          )}
          <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          {!loading && (
            <p className={`text-xs mt-2 font-medium ${subColor(stats)}`}>{sub(stats)}</p>
          )}
        </div>
      ))}
    </div>
  )
}
