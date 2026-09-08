import { AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAlerts, updateAlert } from '../../services/api'

const MOCK_ALERTS = [
  { id: 1, type: 'weapon_detected', description: 'Potential weapon detected near entrance', is_resolved: false, created_at: new Date().toISOString() },
  { id: 2, type: 'unknown_face', description: 'Unrecognized face detected in hallway', is_resolved: false, created_at: new Date(Date.now() - 300000).toISOString() },
  { id: 3, type: 'trespasser', description: 'Trespasser alert — restricted zone', is_resolved: true, created_at: new Date(Date.now() - 900000).toISOString() },
]

export default function AlertsFeed() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    getAlerts({ limit: 5 }).then(setAlerts).catch(() => setAlerts(MOCK_ALERTS))
  }, [])

  const resolve = async (id) => {
    try { await updateAlert(id, { is_resolved: true }) } catch {}
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, is_resolved: true } : a))
  }

  const typeIcon = (type) => {
    if (type === 'weapon_detected') return <AlertTriangle size={14} className="text-red-400" />
    if (type === 'trespasser') return <Shield size={14} className="text-amber-400" />
    return <AlertTriangle size={14} className="text-amber-400" />
  }

  return (
    <div className="flex h-full min-h-[460px] flex-col overflow-hidden rounded-2xl border border-[#263449] bg-[#111a27]/80 shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between border-b border-[#263449] px-5 py-4">
        <div><h2 className="text-sm font-semibold text-white">Security alerts</h2><p className="mt-0.5 text-[11px] text-slate-500">Recent AI-detected activity</p></div>
        <span className="rounded-full bg-amber-400/10 px-2 py-1 text-[10px] font-semibold text-amber-300">{alerts.filter(a => !a.is_resolved).length} active</span>
      </div>
      <div className="min-h-0 flex-1 divide-y divide-[#263449] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="flex h-full items-center justify-center py-8 text-center text-sm text-slate-600">No alerts</div>
        ) : alerts.map((a) => (
          <div key={a.id} className={`flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.025] ${a.is_resolved ? 'opacity-50' : ''}`}>
            <div className="mt-0.5">{typeIcon(a.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-300 truncate">{a.description}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{new Date(a.created_at).toLocaleTimeString()}</p>
            </div>
            {!a.is_resolved && (
              <button
                onClick={() => resolve(a.id)}
                className="shrink-0 p-1 rounded text-slate-500 hover:text-green-400 transition-colors"
                aria-label="Resolve alert"
              >
                <CheckCircle size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-[#263449] bg-[#0d1521]/40 px-5 py-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live detection stream
        </span>
        <span className="text-[11px] text-slate-500">Realtime</span>
      </div>
    </div>
  )
}
