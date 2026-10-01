import { CheckCircle2, Clock3, Maximize2, Users, X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

function formatTime(timestamp) {
  if (!timestamp) return 'Just now'
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(timestamp))
}

function RecordRow({ record }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-bold text-emerald-300">
        {(record.student_name || '?').slice(0, 1).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-slate-200">{record.student_name || 'Unknown student'}</p>
        <p className="truncate text-[10px] text-slate-500" title={[record.student_code, record.section].filter(Boolean).join(' - ')}>
          {record.student_code && record.section
            ? `${record.student_code} · ${record.section}`
            : record.student_code || record.section || 'Face recognition'}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="flex items-center justify-end gap-1 text-[10px] font-medium text-emerald-300">
          <Clock3 size={11} /> {formatTime(record.check_in_time)}
        </p>
        {record.confidence != null && (
          <p className="mt-0.5 text-[10px] text-slate-500">{Math.round(record.confidence * 100)}% match</p>
        )}
      </div>
    </div>
  )
}

function AttendanceLogModal({ records, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'rgba(4, 9, 18, 0.75)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Glass panel */}
      <div
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
        style={{
          background: 'linear-gradient(135deg, rgba(17,26,39,0.85) 0%, rgba(10,18,30,0.92) 100%)',
          backdropFilter: 'blur(28px)',
        }}
      >
        {/* Subtle glass shine */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 rounded-full bg-emerald-400/5 blur-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <Users size={17} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Attendance log</h2>
              <p className="text-[11px] text-slate-400">Marked by face recognition</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              {records.length} today
            </span>
            <button
              onClick={onClose}
              aria-label="Close attendance log"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="min-h-0 flex-1 divide-y divide-white/6 overflow-y-auto px-6">
          {records.length === 0 && (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-center text-slate-500">
              <CheckCircle2 size={22} className="text-slate-600" />
              <p className="text-xs">Recognized attendees will appear here.</p>
            </div>
          )}
          {records.map((record) => (
            <RecordRow key={record.id || `${record.student_id}-${record.check_in_time}`} record={record} />
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 px-6 py-3 text-center">
          <p className="text-[10px] text-slate-600">Press <kbd className="rounded bg-white/8 px-1 py-0.5 font-mono text-slate-400">Esc</kbd> or click outside to close</p>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function AttendanceLog({ records = [], loading = false, open = false, onClose }) {
  const markedRecords = records
    .filter((record) => record.status === 'present' || record.status === 'late')
    .sort((a, b) => new Date(b.check_in_time || 0) - new Date(a.check_in_time || 0))

  return (
    <>
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
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              {markedRecords.length} today
            </span>
            {/* Expand / glass modal button */}
            {onClose && (
              <button
                onClick={() => onClose('open')}
                aria-label="Expand attendance log"
                title="Expand"
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Maximize2 size={15} />
              </button>
            )}
          </div>
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
            <RecordRow key={record.id || `${record.student_id}-${record.check_in_time}`} record={record} />
          ))}
        </div>
      </section>

      {/* Glass modal */}
      {open && (
        <AttendanceLogModal
          records={markedRecords}
          onClose={() => onClose('close')}
        />
      )}
    </>
  )
}
