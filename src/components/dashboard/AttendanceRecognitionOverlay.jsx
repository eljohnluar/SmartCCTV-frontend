import { CheckCircle2, Clock3, Shield } from 'lucide-react'

function formatTime(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp || Date.now()))
}

export default function AttendanceRecognitionOverlay({ recognition }) {
  if (!recognition) return null

  const initial = (recognition.student_name || '?').slice(0, 1).toUpperCase()
  const confidence = recognition.confidence
    ? `${(recognition.confidence * 100).toFixed(1)}%`
    : null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-6 backdrop-blur-md"
      style={{ background: 'rgba(0, 8, 20, 0.94)' }}
      role="status"
      aria-live="assertive"
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 170, 0.015) 2px, rgba(0, 255, 170, 0.015) 4px)',
        }}
      />

      {/* Outer Card Container with Adaptive Cyberpunk Corner Brackets */}
      <div className="relative z-10 my-auto flex w-full max-w-[420px] flex-col items-center sm:max-w-[480px]">
        {/* Pulsing Corner Brackets */}
        <div className="pointer-events-none absolute -inset-3 sm:-inset-4">
          {/* Top-left */}
          <span
            className="absolute left-0 top-0 h-9 w-9 border-l-2 border-t-2 border-emerald-400"
            style={{ boxShadow: '0 0 10px #22c55e90' }}
          />
          {/* Top-right */}
          <span
            className="absolute right-0 top-0 h-9 w-9 border-r-2 border-t-2 border-emerald-400"
            style={{ boxShadow: '0 0 10px #22c55e90' }}
          />
          {/* Bottom-left */}
          <span
            className="absolute bottom-0 left-0 h-9 w-9 border-b-2 border-l-2 border-emerald-400"
            style={{ boxShadow: '0 0 10px #22c55e90' }}
          />
          {/* Bottom-right */}
          <span
            className="absolute bottom-0 right-0 h-9 w-9 border-b-2 border-r-2 border-emerald-400"
            style={{ boxShadow: '0 0 10px #22c55e90' }}
          />
        </div>

        {/* Card Body */}
        <div
          className="relative flex w-full flex-col items-center overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(160deg, #0b1a2e 0%, #071020 100%)',
            border: '1px solid rgba(34,197,94,0.35)',
            boxShadow:
              '0 0 60px rgba(34,197,94,0.14), 0 0 120px rgba(34,197,94,0.06), inset 0 1px 0 rgba(34,197,94,0.12)',
          }}
        >
          {/* Top status bar */}
          <div
            className="flex w-full items-center justify-between px-6 py-2.5"
            style={{
              background: 'rgba(34,197,94,0.08)',
              borderBottom: '1px solid rgba(34,197,94,0.16)',
            }}
          >
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-emerald-400" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
                Identity Verified
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"
                style={{ boxShadow: '0 0 6px #22c55e' }}
              />
              <span className="font-mono text-[9px] font-medium tracking-wider text-emerald-400/90">
                BIOMETRIC LIVE
              </span>
            </div>
          </div>

          {/* Photo section with HUD rings */}
          <div className="relative mt-8 flex items-center justify-center p-4 sm:mt-9">
            {/* Outer Cardinal HUD Ticks */}
            <span className="absolute -top-1 h-2.5 w-0.5 bg-emerald-400/70" />
            <span className="absolute -bottom-1 h-2.5 w-0.5 bg-emerald-400/70" />
            <span className="absolute -left-1 h-0.5 w-2.5 bg-emerald-400/70" />
            <span className="absolute -right-1 h-0.5 w-2.5 bg-emerald-400/70" />

            {/* Glowing Accent Ring */}
            <div
              className="absolute h-[256px] w-[256px] rounded-full sm:h-[304px] sm:w-[304px]"
              style={{
                boxShadow:
                  '0 0 0 2px rgba(34,197,94,0.45), 0 0 35px rgba(34,197,94,0.28), 0 0 70px rgba(34,197,94,0.1)',
              }}
            />

            {/* Spinning Dashed Ring */}
            <div
              className="absolute h-[280px] w-[280px] animate-spin rounded-full sm:h-[332px] sm:w-[332px]"
              style={{
                background: 'transparent',
                border: '1.5px dashed rgba(34,197,94,0.35)',
                animationDuration: '9s',
              }}
            />

            {/* Inner Counter-Spinning Ring */}
            <div
              className="absolute h-[304px] w-[304px] animate-spin rounded-full sm:h-[356px] sm:w-[356px]"
              style={{
                background: 'transparent',
                border: '1px solid transparent',
                borderTopColor: 'rgba(34,197,94,0.45)',
                borderRightColor: 'rgba(34,197,94,0.15)',
                borderBottomColor: 'rgba(34,197,94,0.3)',
                animationDuration: '3.5s',
                animationDirection: 'reverse',
              }}
            />

            {/* Enlarged Photo / Initial Frame */}
            <div
              className="relative h-60 w-60 overflow-hidden rounded-full sm:h-72 sm:w-72"
              style={{
                border: '2.5px solid rgba(34,197,94,0.7)',
                boxShadow: '0 0 28px rgba(34,197,94,0.25)',
              }}
            >
              <div className="flex h-full w-full items-center justify-center bg-[#0d221b] text-7xl font-bold text-emerald-300 sm:text-8xl">
                {initial}
              </div>
              {recognition.enrollment_photo_url && (
                <img
                  src={recognition.enrollment_photo_url}
                  alt={`${recognition.student_name}'s photo`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Scan line sweeping animation across photo */}
          <div className="relative mt-1 h-2 w-60 overflow-hidden sm:w-72">
            <div
              className="absolute inset-y-0 w-16"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(34,197,94,0.6), transparent)',
                animation: 'scanSlide 2s linear infinite',
              }}
            />
          </div>

          <style>{`
            @keyframes scanSlide {
              0% { left: -5rem; }
              100% { left: 19rem; }
            }
            @keyframes glitch {
              0%, 100% { text-shadow: none; transform: translate(0,0); }
              20% { text-shadow: -1px 0 rgba(34,197,94,0.8); transform: translate(-1px,0); }
              40% { text-shadow: 1px 0 rgba(16,185,129,0.8); transform: translate(1px,0); }
              60% { text-shadow: none; transform: translate(0,0); }
            }
          `}</style>

          {/* Details section */}
          <div className="flex w-full flex-col items-center px-6 pb-8 pt-4 sm:px-8">
            {/* Confirmed badge */}
            <div className="mb-3 flex items-center gap-2">
              {recognition.status === 'late' ? (
                <>
                  <Clock3 size={15} className="text-amber-400" />
                  <span
                    className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400"
                    style={{ textShadow: '0 0 10px rgba(245,158,11,0.65)' }}
                  >
                    Attendance Marked · Late
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span
                    className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-400"
                    style={{ textShadow: '0 0 10px rgba(34,197,94,0.65)' }}
                  >
                    Attendance Marked · Present
                  </span>
                </>
              )}
            </div>

            {/* Name */}
            <h2
              className="text-center text-2xl font-bold tracking-wide text-white sm:text-3xl"
              style={{
                textShadow: '0 0 20px rgba(34,197,94,0.3)',
                animation: 'glitch 4s ease-in-out infinite',
              }}
            >
              {recognition.student_name}
            </h2>

            {/* Student code */}
            {recognition.student_code && (
              <p className="mt-1 font-mono text-xs tracking-[0.18em] text-emerald-500/85">
                ID: {recognition.student_code}
              </p>
            )}

            {/* Futuristic divider */}
            <div
              className="my-5 h-px w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(34,197,94,0.45), transparent)',
              }}
            />

            {/* Time + Confidence row */}
            <div className="flex w-full items-center justify-between font-mono text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock3 size={13} className="text-emerald-400" />
                <span className="text-emerald-300/90">
                  {formatTime(recognition.check_in_time)}
                </span>
              </div>
              {confidence && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">
                    Match
                  </span>
                  <span className="font-semibold text-emerald-300">
                    {confidence}
                  </span>
                </div>
              )}
            </div>

            {/* Match confidence progress bar */}
            {recognition.confidence && (
              <div className="mt-3 w-full">
                <div className="h-[3.5px] w-full overflow-hidden rounded-full bg-slate-800/80">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(recognition.confidence * 100).toFixed(0)}%`,
                      background: 'linear-gradient(90deg, #10b981, #22c55e)',
                      boxShadow: '0 0 8px rgba(34,197,94,0.75)',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Auto-return hint */}
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
              Returning to dashboard…
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
