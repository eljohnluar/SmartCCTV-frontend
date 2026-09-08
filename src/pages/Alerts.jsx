import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle2, Filter, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAlerts, updateAlert } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

const MOCK_ALERTS = [
  {
    id: 1,
    type: 'weapon_detected',
    description: 'Potential weapon detected near Main Entrance',
    image_url: null,
    is_resolved: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    severity: 'high'
  },
  {
    id: 2,
    type: 'trespasser',
    description: 'Unidentified individual detected in Faculty Area',
    image_url: null,
    is_resolved: false,
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    severity: 'medium'
  },
  {
    id: 3,
    type: 'compliance_violation',
    description: 'Uniform dress code non-compliance detected',
    image_url: null,
    is_resolved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    severity: 'low'
  },
  {
    id: 4,
    type: 'unknown_face',
    description: 'Unrecognized student profile at Gate 2',
    image_url: null,
    is_resolved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    severity: 'low'
  }
]

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadAlerts() {
      setLoading(true)
      try {
        const data = await getAlerts()
        setAlerts(data && data.length > 0 ? data : MOCK_ALERTS)
      } catch (err) {
        setAlerts(MOCK_ALERTS)
      } finally {
        setLoading(false)
      }
    }
    loadAlerts()
  }, [])

  const handleResolve = async (id) => {
    try {
      await updateAlert(id, { is_resolved: true })
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_resolved: true } : a))
      toast.success('Alert marked as resolved')
    } catch (err) {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_resolved: true } : a))
      toast.success('Alert marked as resolved (offline)')
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = filterType === 'all' || alert.type === filterType
    const matchesStatus = filterStatus === 'all'
      ? true
      : filterStatus === 'active' ? !alert.is_resolved : alert.is_resolved
    const matchesSearch = alert.description.toLowerCase().includes(search.toLowerCase()) ||
      alert.type.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  const getAlertIcon = (type) => {
    switch (type) {
      case 'weapon_detected':
        return <AlertTriangle size={18} className="text-red-400" />
      case 'trespasser':
        return <Shield size={18} className="text-amber-400" />
      default:
        return <AlertTriangle size={18} className="text-amber-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#242836] border border-[#2d3148] rounded-lg text-slate-300 placeholder-slate-600 focus:outline-none focus:border-green-500/50"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-[#242836] border border-[#2d3148] rounded-lg px-2.5 py-1.5">
              <Filter size={13} className="text-slate-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-transparent text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#242836] border border-[#2d3148] rounded-lg text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Event Types</option>
              <option value="weapon_detected">Weapon Detected</option>
              <option value="trespasser">Trespasser</option>
              <option value="compliance_violation">Compliance Violation</option>
              <option value="unknown_face">Unknown Face</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Feed / List */}
      <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2d3148] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Security Incidents & Violations</h2>
          <span className="text-xs text-slate-400">
            {filteredAlerts.length} recorded
          </span>
        </div>

        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : filteredAlerts.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-600">No security incidents match the criteria</div>
        ) : (
          <div className="divide-y divide-[#2d3148]">
            {filteredAlerts.map(alert => (
              <div key={alert.id} className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-white/[0.01] ${alert.is_resolved ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${alert.type === 'weapon_detected' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">{alert.description}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold tracking-wider ${
                        alert.is_resolved
                          ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          : alert.type === 'weapon_detected'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {alert.is_resolved ? 'Resolved' : 'Active Alert'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Event: <span className="font-mono text-slate-400">{alert.type}</span> &bull; {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!alert.is_resolved && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors self-end sm:self-auto"
                  >
                    <CheckCircle2 size={14} />
                    Mark Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
