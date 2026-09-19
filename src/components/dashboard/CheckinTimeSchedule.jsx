import { Check, Clock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getScheduleSettings, updateScheduleSettings } from '../../services/api'
import { wsClient } from '../../services/websocket'

const PRESETS = ['07:30', '08:00', '08:30', '09:00']

function computeLateCutoff(timeStr, graceMinutes = 30) {
  if (!timeStr) return '--:--'
  const [hStr, mStr] = timeStr.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  if (isNaN(h) || isNaN(m)) return '--:--'

  const totalMinutes = h * 60 + m + graceMinutes
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

export default function CheckinTimeSchedule() {
  const [checkinTime, setCheckinTime] = useState('08:00')
  const [savedTime, setSavedTime] = useState('08:00')
  const [graceMinutes, setGraceMinutes] = useState(30)
  const [savedGraceMinutes, setSavedGraceMinutes] = useState(30)
  const [saving, setSaving] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Keep live current time ticking every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load schedule on mount
  useEffect(() => {
    getScheduleSettings()
      .then((data) => {
        if (data?.checkin_time) {
          setCheckinTime(data.checkin_time)
          setSavedTime(data.checkin_time)
          setGraceMinutes(data.late_grace_minutes ?? 30)
          setSavedGraceMinutes(data.late_grace_minutes ?? 30)
        }
      })
      .catch((err) => {
        console.warn('Could not load schedule settings:', err.message)
      })

    const unsub = wsClient.on('schedule_updated', (data) => {
      if (data?.checkin_time) {
          setCheckinTime(data.checkin_time)
          setSavedTime(data.checkin_time)
          setGraceMinutes(data.late_grace_minutes ?? 30)
          setSavedGraceMinutes(data.late_grace_minutes ?? 30)
      }
    })

    return unsub
  }, [])

  // Determine current status preview
  const currentStatus = useMemo(() => {
    if (!savedTime) return 'present'
    const [h, m] = savedTime.split(':').map(Number)
    const target = new Date(currentTime)
    target.setHours(h, m, 0, 0)
    const lateCutoff = new Date(target.getTime() + savedGraceMinutes * 60 * 1000)

    if (currentTime > lateCutoff) return 'late'
    return 'present'
  }, [savedTime, savedGraceMinutes, currentTime])

  const lateCutoffText = useMemo(
    () => computeLateCutoff(savedTime, savedGraceMinutes),
    [savedTime, savedGraceMinutes]
  )

  const handleSave = async (timeToSave = checkinTime) => {
    setSaving(true)
    try {
      await updateScheduleSettings({
        checkin_time: timeToSave,
        late_grace_minutes: graceMinutes,
      })
      setSavedTime(timeToSave)
      setCheckinTime(timeToSave)
      setSavedGraceMinutes(graceMinutes)
      toast.success(`Check-in time set to ${format12Hour(timeToSave)}`)
    } catch (err) {
      toast.error(err.message || 'Failed to save check-in time')
    } finally {
      setSaving(false)
    }
  }

  const isDirty = checkinTime !== savedTime || graceMinutes !== savedGraceMinutes

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
                Active: {format12Hour(savedTime)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Students arriving early or up to {savedGraceMinutes} mins after are marked{' '}
              <span className="font-semibold text-emerald-400">Present</span>. Arrivals after{' '}
              <span className="font-semibold text-amber-300">{lateCutoffText}</span> are marked{' '}
              <span className="font-semibold text-amber-400">Late</span>.
            </p>
          </div>
        </div>

        {/* Middle / Right: Time controls & live status badge */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick presets */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[#2b3b51] bg-[#172235]/70 p-1">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setCheckinTime(preset)
                  handleSave(preset)
                }}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium transition-all ${
                  savedTime === preset
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Time Picker Input */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="time"
                value={checkinTime}
                onChange={(e) => setCheckinTime(e.target.value)}
                className="h-9 rounded-xl border border-[#2b3b51] bg-[#172235] px-3 font-mono text-xs text-white transition-colors focus:border-emerald-400/60 focus:outline-none"
              />
            </div>
            <label className="flex h-9 items-center gap-1.5 rounded-xl border border-[#2b3b51] bg-[#172235] px-2.5 text-[10px] text-slate-400">
              Grace
              <input
                type="number"
                min="0"
                max="180"
                value={graceMinutes}
                onChange={(e) => setGraceMinutes(Math.max(0, Math.min(180, Number(e.target.value))))}
                className="w-11 bg-transparent font-mono text-xs text-white focus:outline-none"
                aria-label="Late grace period in minutes"
              />
              min
            </label>

            {isDirty && (
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-emerald-500 px-3 text-xs font-semibold text-slate-950 shadow-md transition-all hover:bg-emerald-400 disabled:opacity-50"
              >
                <Check size={14} />
                <span>{saving ? 'Saving…' : 'Set time'}</span>
              </button>
            )}
          </div>

          {/* Live Check-in Status Preview */}
          <div className="flex items-center gap-2 rounded-xl border border-[#263449] bg-[#0d1521]/60 px-3 py-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Live Status:</span>
            {currentStatus === 'present' ? (
              <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Marking Present
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                Marking Late
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
