import { CheckCircle2, Clock3, Users } from 'lucide-react'

function formatTime(timestamp) {
  if (!timestamp) return 'Just now'
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(timestamp))
}

export default function AttendanceLog({ records = [], loading = false }) {
  const markedRecords = records
    .filter((record) => record.status === 'present' || record.status === 'late')
    .sort((a, b) => new Date(b.check_in_time || 0) - new Date(a.check_in_time || 0))

  return (
    <section className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl border border-[#263449] bg-[#111a27] shadow-[0_20px_55px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between border-b border-[#263449] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Users size={17} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Attendance log</h2>
            <p className="text-[11px] text-slate-500">Marked by face recognition</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
          {markedRecords.length} today
        </span>
      </div>

      <div className="min-h-0 flex-1 divide-y divide-[#263449] overflow-y-auto px-5 sm:px-6">
        {loading && <p className="py-8 text-center text-xs text-slate-500">Loading attendance…</p>}
        {!loading && markedRecords.length === 0 && (
          <div className="flex h-full min-h-44 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <CheckCircle2 size={22} className="text-slate-600" />
            <p className="text-xs">Recognized attendees will appear here.</p>
          </div>
        )}
        {markedRecords.map((record) => (
          <div key={record.id || `${record.student_id}-${record.check_in_time}`} className="flex items-center gap-3 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-bold text-emerald-300">
              {(record.student_name || '?').slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-200">{record.student_name || 'Unknown student'}</p>
              <p className="truncate text-[10px] text-slate-500">{record.student_code || record.section || 'Face recognition'}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="flex items-center justify-end gap-1 text-[10px] font-medium text-emerald-300"><Clock3 size={11} /> {formatTime(record.check_in_time)}</p>
              {record.confidence != null && <p className="mt-0.5 text-[10px] text-slate-500">{Math.round(record.confidence * 100)}% match</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
