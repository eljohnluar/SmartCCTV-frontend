import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#22c55e', '#ef4444', '#f59e0b']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1d27] border border-[#2d3148] rounded-lg p-3 text-xs">
      <p className="text-slate-400">{payload[0].name}</p>
      <p className="text-white font-medium">{payload[0].value} students</p>
    </div>
  )
}

export default function DistributionChart({ data, loading }) {
  const chartData = [
    { name: 'Present', value: data?.present ?? 0 },
    { name: 'Absent', value: data?.absent ?? 0 },
    { name: 'Late', value: data?.late ?? 0 },
  ]
  if (loading) return (
    <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-5">
      <div className="h-4 w-32 bg-[#2d3148] rounded animate-pulse mb-4" />
      <div className="h-52 bg-[#2d3148] rounded-full w-52 mx-auto animate-pulse" />
    </div>
  )
  return (
    <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-5">
      <h2 className="text-sm font-semibold text-white mb-5">Distribution</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        {chartData.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
            <span className="text-xs text-slate-400">{d.name} ({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
