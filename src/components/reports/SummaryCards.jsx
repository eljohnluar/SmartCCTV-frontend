import { TrendingDown, TrendingUp, UserCheck, UserMinus, Users } from 'lucide-react'

export default function SummaryCards({ summary, loading }) {
  const cards = [
    { label: 'Average Rate', value: `${summary?.avg_rate ?? 0}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Present', value: summary?.total_present ?? 0, icon: UserCheck, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Absent', value: summary?.total_absent ?? 0, icon: UserMinus, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Total Late', value: summary?.total_late ?? 0, icon: TrendingDown, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Students', value: summary?.total_students ?? 0, icon: Users, color: 'text-slate-400', bg: 'bg-slate-500/10' },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-4">
          <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
            <Icon size={16} className={color} />
          </div>
          {loading
            ? <div className="h-7 w-12 bg-[#2d3148] rounded animate-pulse mb-1" />
            : <p className="text-xl font-bold text-white">{value}</p>}
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  )
}
