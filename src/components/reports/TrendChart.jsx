import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1d27] border border-[#2d3148] rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-green-400 font-medium">{payload[0]?.value}% attendance</p>
    </div>
  )
}

export default function TrendChart({ data, loading }) {
  if (loading) return (
    <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-5">
      <div className="h-4 w-32 bg-[#2d3148] rounded animate-pulse mb-4" />
      <div className="h-52 bg-[#2d3148] rounded-lg animate-pulse" />
    </div>
  )
  return (
    <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-5">
      <h2 className="text-sm font-semibold text-white mb-5">Attendance Trend</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
