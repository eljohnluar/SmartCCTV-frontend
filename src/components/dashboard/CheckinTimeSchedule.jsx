import { Check, Clock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getScheduleSettings, updateScheduleSettings } from '../../services/api'
import { usePasswordConfirm } from '../../hooks/usePasswordConfirm'
import { wsClient } from '../../services/websocket'

const PRESETS = ['07:30', '08:00', '08:30', '09:00']

function computeCutoff(timeStr, minutesAfter = 30) {
  if (!timeStr) return '--:--'
  const [hStr, mStr] = timeStr.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  if (isNaN(h) || isNaN(m)) return '--:--'

  const totalMinutes = h * 60 + m + minutesAfter
  const newH = Math.floor((totalMinutes / 60) % 24)
  const newM = totalMinutes % 60
  const period = newH >= 12 ? 'PM' : 'AM'
  const displayH = newH % 12 || 12
  return `${displayH}:${String(newM).padStart(2, '0')} ${period}`
}

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

export default function CheckinTimeSchedule() {
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

  const lateCutoffText = useMemo(
    () => computeCutoff(savedTime, savedGraceMinutes),
    [savedTime, savedGraceMinutes]
  )

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
    if (timeoutMinsToSave < graceMinutes) {
      toast.error(
        `Time out (${format12Hour(timeoutTimeToSave)}) must be after the late grace window (${computeCutoff(timeToSave, graceMinutes)})`
      )
      return
    }

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

  const handlePresetSelect = (preset) => {
    setCheckinTime(preset)
    const newTimeoutTime = calculateTimeoutTimeStr(preset, timeoutMinutes)
    setTimeoutTime(newTimeoutTime)
    handleSave(preset, timeoutMinutes, newTimeoutTime)
  }

  const isDirty =
    checkinTime !== savedTime ||
    graceMinutes !== savedGraceMinutes ||
    timeoutTime !== savedTimeoutTime

  return (
    <div className="rounded-3xl border border-[#263449] bg-[#111a27]/90 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Heading & explanation */}
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
            <p className="mt-1 text-xs text-slate-400">
              Students arriving early or up to {savedGraceMinutes} mins after are marked{' '}
              <span className="font-semibold text-emerald-400">Present</span>. Arrivals after{' '}
              <span className="font-semibold text-amber-300">{lateCutoffText}</span> are marked{' '}
              <span className="font-semibold text-amber-400">Late</span> until{' '}
              <span className="font-semibold text-red-300">{format12Hour(savedTimeoutTime)}</span>, when check-in{' '}
              <span className="font-semibold text-red-400">times out</span> and no more attendance is accepted.
            </p>
          </div>
        </div>

        {/* Middle / Right: Time controls & live status badge */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick presets for check-in */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[#2b3b51] bg-[#172235]/70 p-1">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium transition-all ${
                  savedTime === preset
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {format12Hour(preset)}
              </button>
            ))}
          </div>

          {/* Time Picker Inputs */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Check-in time input */}
            <div className="flex h-9 items-center gap-2 rounded-xl border border-[#2b3b51] bg-[#172235] px-2.5 text-[10px] text-slate-400">
              <span className="font-medium text-slate-300">In:</span>
              <input
                type="time"
                value={checkinTime}
                onChange={(e) => handleCheckinChange(e.target.value)}
                className="bg-transparent font-mono text-xs text-white focus:outline-none"
                aria-label="Check-in time"
              />
              <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                {format12Hour(checkinTime)}
              </span>
            </div>

            {/* Grace period in minutes */}
            <label className="flex h-9 items-center gap-1.5 rounded-xl border border-[#2b3b51] bg-[#172235] px-2.5 text-[10px] text-slate-400">
              Grace
              <input
                type="number"
                min="0"
                max="180"
                value={graceMinutes}
                onChange={(e) => setGraceMinutes(Math.max(0, Math.min(180, Number(e.target.value) || 0)))}
                className="w-10 bg-transparent font-mono text-xs text-white focus:outline-none"
                aria-label="Late grace period in minutes"
              />
              min
            </label>

            {/* Time out in 12-hour time format (not minutes) */}
            <div className="flex h-9 items-center gap-2 rounded-xl border border-[#2b3b51] bg-[#172235] px-2.5 text-[10px] text-slate-400">
              <span className="font-medium text-slate-300">Time out:</span>
              <input
                type="time"
                value={timeoutTime}
                onChange={(e) => handleTimeoutChange(e.target.value)}
                className="bg-transparent font-mono text-xs text-white focus:outline-none"
                aria-label="Time out in 12-hour format"
              />
              <span className="rounded bg-red-400/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-red-300">
                {format12Hour(timeoutTime)}
              </span>
            </div>

            {isDirty && (
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-emerald-500 px-3 text-xs font-semibold text-slate-950 shadow-md transition-all hover:bg-emerald-400 disabled:opacity-50"
              >
                <Check size={14} />
                <span>{saving ? 'Saving…' : 'Set schedule'}</span>
              </button>
            )}
          </div>

          {/* Live Check-in Status Preview */}
          <div className="flex items-center gap-2 rounded-xl border border-[#263449] bg-[#0d1521]/60 px-3 py-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Live Status:</span>
            {currentStatus === 'present' && (
              <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Marking Present
              </span>
            )}
            {currentStatus === 'late' && (
              <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                Marking Late
              </span>
            )}
            {currentStatus === 'closed' && (
              <span
                className="flex items-center gap-1.5 font-mono text-xs font-semibold text-red-400"
                title={`Attendance closed at ${format12Hour(savedTimeoutTime)}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Check-in closed
              </span>
            )}
          </div>
        </div>
      </div>

      {dialog}
    </div>
  )
}
