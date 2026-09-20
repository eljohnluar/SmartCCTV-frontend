import { useEffect, useState } from 'react'
import { Shield, Lock, LogOut, Radio, Cpu } from 'lucide-react'

/**
 * AuthLoadingScreen:
 * Displays a 3-second futuristic cyberpunk transition screen for login, register, and logout.
 * 
 * @param {Object} props
 * @param {'login' | 'logout' | 'register'} props.type
 * @param {string} [props.message]
 */
export default function AuthLoadingScreen({ type = 'login', message }) {
  const [progress, setProgress] = useState(0)
  const [countdown, setCountdown] = useState(3.0)

  useEffect(() => {
    const startTime = Date.now()
    const totalDuration = 3000 // 3 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min(100, Math.round((elapsed / totalDuration) * 100))
      const remainingSeconds = Math.max(0, (totalDuration - elapsed) / 1000)

      setProgress(currentProgress)
      setCountdown(parseFloat(remainingSeconds.toFixed(1)))

      if (elapsed >= totalDuration) {
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [])

  const isLogout = type === 'logout'

  const title = isLogout
    ? 'TERMINATING OPERATIONAL SESSION'
    : type === 'register'
    ? 'AUTHORIZING NEW OPERATOR'
    : 'AUTHENTICATING NEURAL INTERFACE'

  const subtitle = message || (isLogout
    ? 'Disconnecting RTSP stream, purging session cache, and returning to gateway...'
    : 'Establishing encrypted channel, synchronizing FaceNet vectors, and loading camera feed...')

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#040711] text-white font-sans select-none">
      {/* ── Cyber Background Gradients & Grid ─────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, ${isLogout ? 'rgba(239, 68, 68, 0.14)' : 'rgba(0, 240, 255, 0.15)'}, transparent 55%),
            linear-gradient(rgba(0, 240, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 36px 36px, 36px 36px',
        }}
      />

      {/* CRT Scanline Overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.02) 2px, rgba(0, 240, 255, 0.02) 4px)',
        }}
      />

      {/* Outer corner HUD brackets */}
      <div className="pointer-events-none absolute inset-6">
        <span className={`absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 ${isLogout ? 'border-red-500 shadow-[0_0_12px_#ef4444]' : 'border-cyan-400 shadow-[0_0_12px_#00f0ff]'}`} />
        <span className={`absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 ${isLogout ? 'border-red-500 shadow-[0_0_12px_#ef4444]' : 'border-cyan-400 shadow-[0_0_12px_#00f0ff]'}`} />
        <span className={`absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 ${isLogout ? 'border-red-500 shadow-[0_0_12px_#ef4444]' : 'border-cyan-400 shadow-[0_0_12px_#00f0ff]'}`} />
        <span className={`absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 ${isLogout ? 'border-red-500 shadow-[0_0_12px_#ef4444]' : 'border-cyan-400 shadow-[0_0_12px_#00f0ff]'}`} />
      </div>

      {/* Top telemetry badge */}
      <div className="relative z-10 mb-8 flex items-center gap-2 font-mono text-[11px] text-slate-400">
        <span className={`h-2 w-2 animate-ping rounded-full ${isLogout ? 'bg-red-400' : 'bg-cyan-400'}`} />
        <span className="uppercase tracking-widest text-slate-300">
          {isLogout ? 'SESSION DISENGAGEMENT' : 'SYSTEM AUTHORIZATION GATEWAY'}
        </span>
        <span className="text-slate-600">|</span>
        <span className={isLogout ? 'text-red-400 font-bold' : 'text-cyan-400 font-bold'}>
          {countdown.toFixed(1)}s REMAINING
        </span>
      </div>

      {/* ── Holographic Radar Spinner & Centerpiece ───────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8 flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
          {/* Rotating outer dotted ring */}
          <div
            className={`absolute inset-0 rounded-full border border-dashed ${isLogout ? 'border-red-500/40' : 'border-cyan-400/40'} animate-[spin_8s_linear_infinite]`}
          />

          {/* Reverse rotating notched ring */}
          <div
            className={`absolute -inset-2 rounded-full border-2 border-transparent ${isLogout ? 'border-t-red-500 border-b-red-400/40' : 'border-t-cyan-400 border-b-emerald-400/40'} animate-[spin_3s_linear_infinite_reverse]`}
          />

          {/* Pulsing ambient glow */}
          <div
            className={`absolute inset-2 rounded-full ${isLogout ? 'bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'bg-cyan-500/10 shadow-[0_0_40px_rgba(0,240,255,0.4)]'} animate-pulse`}
          />

          {/* Center Logo / Icon Frame */}
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-black/80 shadow-2xl">
            <img
              src="/logo-mark.jpg"
              alt="SmartCCTV"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            {/* Overlay icon if image doesn't render */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
              {isLogout ? (
                <LogOut size={28} className="text-red-400" />
              ) : (
                <Lock size={28} className="text-cyan-400 animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* ── Status Header & Message ────────────────────────────────────────── */}
        <div className="text-center max-w-lg px-4">
          <h2 className="font-mono text-base font-black tracking-widest text-white sm:text-lg">
            {title}
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            {subtitle}
          </p>
        </div>

        {/* ── High-Tech 3-Second Progress Bar ─────────────────────────────────── */}
        <div className="mt-8 w-72 sm:w-80">
          <div className="mb-2 flex items-center justify-between font-mono text-[11px]">
            <span className="text-slate-500 tracking-wider">
              {isLogout ? 'FLUSHING DATA' : 'LOADING MATRICES'}
            </span>
            <span className={`font-bold ${isLogout ? 'text-red-400' : 'text-cyan-400'}`}>
              {progress}%
            </span>
          </div>

          <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-slate-700 bg-slate-900/90 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                isLogout
                  ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 shadow-[0_0_15px_#ef4444]'
                  : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_0_15px_#00f0ff]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stepped progress indicators */}
          <div className="mt-3 flex justify-between font-mono text-[9px] text-slate-600">
            <span className={progress >= 25 ? (isLogout ? 'text-red-400' : 'text-cyan-400') : ''}>
              [01 // HANDSHAKE]
            </span>
            <span className={progress >= 50 ? (isLogout ? 'text-red-400' : 'text-cyan-400') : ''}>
              [02 // ENCRYPTION]
            </span>
            <span className={progress >= 75 ? (isLogout ? 'text-red-400' : 'text-cyan-400') : ''}>
              [03 // PIPELINE]
            </span>
            <span className={progress >= 100 ? (isLogout ? 'text-red-400' : 'text-cyan-400') : ''}>
              [04 // READY]
            </span>
          </div>
        </div>
      </div>

      {/* Bottom technical footer */}
      <div className="absolute bottom-6 z-10 flex items-center gap-4 font-mono text-[10px] text-slate-600">
        <span>SMART CCTV // SECURITY CORE</span>
        <span>&bull;</span>
        <span>TLS 1.3 ENCRYPTED</span>
        <span>&bull;</span>
        <span>TRANSITION: 3.0s</span>
      </div>
    </div>
  )
}
