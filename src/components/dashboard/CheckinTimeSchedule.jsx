import { Check, Clock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getScheduleSettings, updateScheduleSettings } from '../../services/api'
import { usePasswordConfirm } from '../../hooks/usePasswordConfirm'
import { wsClient } from '../../services/websocket'

function format12Hour(timeStr) {
  if (!timeStr) return '--:--'
  const [hStr, mStr] = timeStr.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  if (isNaN(h) || isNaN(m)) return timeStr
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`
}

function calculateTimeoutTimeStr(checkinStr, minutes) {
  if (!checkinStr) return '10:00'
  const [hStr, mStr] = checkinStr.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  if (isNaN(h) || isNaN(m)) return '10:00'
  const total = h * 60 + m + (minutes || 120)
  const norm = ((total % 1440) + 1440) % 1440
  const newH = Math.floor(norm / 60)
  const newM = norm % 60
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}

function calculateTimeoutMinutes(checkinStr, timeoutStr) {
  if (!checkinStr || !timeoutStr) return 120
  const [chH, chM] = checkinStr.split(':').map(Number)
  const [toH, toM] = timeoutStr.split(':').map(Number)
  let diff = (toH * 60 + toM) - (chH * 60 + chM)
  if (diff <= 0) {
    diff += 1440
  }
  return diff
}

const timeInputCls =
  'bg-transparent font-mono text-xs text-white focus:outline-none'
const chipCls =
  'flex h-9 items-center gap-2 rounded-xl border border-[#2b3b51] bg-[#172235] px-2.5 text-[10px] text-slate-400'
const overlayChipCls =
  'flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-2.5 text-[10px] text-slate-300'

function TimeInputs({ checkinTime, timeoutTime, onCheckinChange, onTimeoutChange, overlay = false }) {
  const chip = overlay ? overlayChipCls : chipCls
  return (
    <>
      <div className={chip}>
        <span className="font-medium text-slate-300">Time in:</span>
        <input
          type="time"
          value={checkinTime}
          onChange={(e) => onCheckinChange(e.target.value)}
          className={timeInputCls}
          aria-label="Time in"
        />
        <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
          {format12Hour(checkinTime)}
        </span>
      </div>

      <div className={chip}>
        <span className="font-medium text-slate-300">Time out:</span>
        <input
          type="time"
          value={timeoutTime}
          onChange={(e) => onTimeoutChange(e.target.value)}
          className={timeInputCls}
          aria-label="Time out"
        />
        <span className="rounded bg-red-400/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-red-300">
          {format12Hour(timeoutTime)}
        </span>
      </div>
    </>
  )
}

function LiveStatusBadge({ status, timeoutLabel }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#263449] bg-[#0d1521]/60 px-3 py-1.5">
      <span className="text-[10px] uppercase tracking-wider text-slate-500">Live Status:</span>
      {status === 'present' && (
        <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Marking Present
        </span>
      )}
      {status === 'late' && (
        <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          Marking Late
        </span>
      )}
      {status === 'closed' && (
        <span
          className="flex items-center gap-1.5 font-mono text-xs font-semibold text-red-400"
          title={`Attendance closed at ${timeoutLabel}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          Check-in closed
        </span>
      )}
    </div>
  )
}

export default function CheckinTimeSchedule({ overlay = false }) {
  const [checkinTime, setCheckinTime] = useState('08:00')
  const [savedTime, setSavedTime] = useState('08:00')
  const [graceMinutes, setGraceMinutes] = useState(30)
  const [savedGraceMinutes, setSavedGraceMinutes] = useState(30)
  const [timeoutMinutes, setTimeoutMinutes] = useState(120)
  const [savedTimeoutMinutes, setSavedTimeoutMinutes] = useState(120)
  const [timeoutTime, setTimeoutTime] = useState('10:00')
  const [savedTimeoutTime, setSavedTimeoutTime] = useState('10:00')
  const [saving, setSaving] = useState(false)
  const { confirm, dialog } = usePasswordConfirm()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Keep live current time ticking every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load schedule on mount
  useEffect(() => {
    const apply = (data) => {
      if (!data?.checkin_time) return
      const checkin = data.checkin_time
      const grace = data.late_grace_minutes ?? 30
      const timeout = Math.max(grace, data.attendance_timeout_minutes ?? 120)
      const toTime = calculateTimeoutTimeStr(checkin, timeout)

      setCheckinTime(checkin)
      setSavedTime(checkin)
      setGraceMinutes(grace)
      setSavedGraceMinutes(grace)
      setTimeoutMinutes(timeout)
      setSavedTimeoutMinutes(timeout)
      setTimeoutTime(toTime)
      setSavedTimeoutTime(toTime)
    }

    getScheduleSettings()
      .then(apply)
      .catch((err) => {
        console.warn('Could not load schedule settings:', err.message)
      })

    const unsub = wsClient.on('schedule_updated', apply)

    return unsub
  }, [])

  // Determine current status preview
  const currentStatus = useMemo(() => {
    if (!savedTime) return 'present'
    const [h, m] = savedTime.split(':').map(Number)
    const target = new Date(currentTime)
    target.setHours(h, m, 0, 0)
    const lateCutoff = new Date(target.getTime() + savedGraceMinutes * 60 * 1000)
    const attendanceCutoff = new Date(target.getTime() + savedTimeoutMinutes * 60 * 1000)

    if (currentTime > attendanceCutoff) return 'closed'
    if (currentTime > lateCutoff) return 'late'
    return 'present'
  }, [savedTime, savedGraceMinutes, savedTimeoutMinutes, currentTime])

  const handleCheckinChange = (newCheckin) => {
    setCheckinTime(newCheckin)
    if (newCheckin && timeoutTime) {
      const minutes = calculateTimeoutMinutes(newCheckin, timeoutTime)
      setTimeoutMinutes(minutes)
    }
  }

  const handleTimeoutChange = (newTimeout) => {
    setTimeoutTime(newTimeout)
    if (newTimeout && checkinTime) {
      const minutes = calculateTimeoutMinutes(checkinTime, newTimeout)
      setTimeoutMinutes(minutes)
    }
  }

  const handleSave = async (
    timeToSave = checkinTime,
    timeoutMinsToSave = timeoutMinutes,
    timeoutTimeToSave = timeoutTime
  ) => {
    setSaving(true)
    const saved = await confirm(
      async (password) => {
        await updateScheduleSettings(
          {
            checkin_time: timeToSave,
            late_grace_minutes: graceMinutes,
            attendance_timeout_minutes: timeoutMinsToSave,
          },
          password
        )
        setSavedTime(timeToSave)
        setCheckinTime(timeToSave)
        setSavedGraceMinutes(graceMinutes)
        setSavedTimeoutMinutes(timeoutMinsToSave)
        setSavedTimeoutTime(timeoutTimeToSave)
        setTimeoutTime(timeoutTimeToSave)
      },
      {
        title: 'Confirm check-in schedule',
        description: `Attendance will be accepted from ${format12Hour(timeToSave)} until ${format12Hour(timeoutTimeToSave)}. Enter your password to continue.`,
        confirmLabel: 'Save schedule',
      }
    )
    setSaving(false)
    if (!saved) return
    toast.success(`Schedule set: ${format12Hour(timeToSave)} to ${format12Hour(timeoutTimeToSave)}`)
  }

  const isDirty =
    checkinTime !== savedTime ||
    timeoutTime !== savedTimeoutTime

  const saveButton = (
    <button
      type="button"
      onClick={() => handleSave()}
      disabled={!isDirty || saving}
      title={isDirty ? 'Save the new schedule' : 'Edit Time in or Time out to enable'}
      className="flex h-9 items-center gap-1.5 rounded-xl bg-emerald-500 px-3 text-xs font-semibold text-slate-950 shadow-md transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-500"
    >
      <Check size={14} />
      <span>{saving ? 'Saving…' : 'Set schedule'}</span>
    </button>
  )

  const inputs = (
    <TimeInputs
      checkinTime={checkinTime}
      timeoutTime={timeoutTime}
      onCheckinChange={handleCheckinChange}
      onTimeoutChange={handleTimeoutChange}
      overlay={overlay}
    />
  )

  if (overlay) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        {inputs}
        {saveButton}
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
          <span className="text-[9px] uppercase tracking-wider text-slate-400">Live Status:</span>
          {currentStatus === 'present' && (
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Marking Present
            </span>
          )}
          {currentStatus === 'late' && (
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-amber-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              Marking Late
            </span>
          )}
          {currentStatus === 'closed' && (
            <span
              className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-red-300"
              title={`Attendance closed at ${format12Hour(savedTimeoutTime)}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              Check-in closed
            </span>
          )}
        </div>
        {dialog}
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-[#263449] bg-[#111a27]/90 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Heading */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400 shadow-inner">
            <Clock size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-semibold text-white">Target Check-in Schedule</h2>
              <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                Active: {format12Hour(savedTime)} – {format12Hour(savedTimeoutTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Middle / Right: Time controls & live status badge */}
        <div className="flex flex-wrap items-center gap-3">
          {inputs}
          {saveButton}
          <LiveStatusBadge status={currentStatus} timeoutLabel={format12Hour(savedTimeoutTime)} />
        </div>
      </div>

      {dialog}
    </div>
  )
}
