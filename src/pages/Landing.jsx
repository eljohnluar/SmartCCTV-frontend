import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Cpu,
  Camera,
  Activity,
  AlertTriangle,
  ArrowRight,
  Fingerprint,
  Radio,
  Palette,
  Hand,
  LogIn
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/common/ThemeToggle'

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const time24 = currentTime.toLocaleTimeString('en-GB', { hour12: false })

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#050811] text-[#e2e8f0] font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background decor */}
      <div
        className="pointer-events-none fixed inset-0 z-0 cyber-bg"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.12), transparent 45%),
            radial-gradient(circle at 100% 70%, rgba(16, 185, 129, 0.08), transparent 40%),
            linear-gradient(rgba(0, 255, 200, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 200, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
        }}
      />

      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 cyber-bg"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.015) 2px, rgba(0, 240, 255, 0.015) 4px)',
        }}
      />

      {/* ── Top Navigation ───────────────────────────────────────── */}
      <header className="relative z-20 border-b border-cyan-500/20 bg-[#080d19]/80 backdrop-blur-xl px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo & System Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/40 bg-black/60 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
              <img
                src="/logo-mark.jpg"
                alt="SmartCCTV Logo"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <span className="absolute inset-0 border border-cyan-400/30 rounded-xl" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                  Smart<span className="text-cyan-400">CCTV</span>
                </span>
                <span className="rounded border border-emerald-400/40 bg-emerald-500/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-300">
                  v2.6
                </span>
              </div>
              <p className="text-[10px] tracking-wide text-slate-400">
                AI Vision &amp; Attendance System
              </p>
            </div>
          </div>

          {/* Status right */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden font-mono text-xs sm:block text-slate-400">
              <span className="text-cyan-400 mr-1.5">Time</span>
              <span className="text-cyan-200">{time24}</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-cyan-200">
                All systems active
              </span>
            </div>

            {!user && <ThemeToggle />}

            {user ? (
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/')}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-500/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
              >
                <span>Open dashboard</span>
                <ArrowRight size={13} />
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all hover:bg-cyan-500/25 hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
              >
                <LogIn size={13} />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </header>


      {/* ── Main Hero ─────────────────────────────── */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6">
            {/* Friendly tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/50 px-3 py-1 text-xs text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
              <span className="font-medium">
                Simple, secure attendance for your classroom
              </span>
            </div>

            {/* C7 Company Logo — above headline */}
            <div className="flex items-center gap-4 pt-1">
              <div className="relative flex items-center justify-center rounded-xl border border-cyan-400/25 bg-black/50 px-5 py-3 shadow-[0_0_28px_rgba(0,240,255,0.14),inset_0_0_16px_rgba(0,240,255,0.03)]">
                <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-cyan-400/50" />
                <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-cyan-400/50" />
                <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-cyan-400/50" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-cyan-400/50" />
                <img
                  src="/company-logo.png"
                  alt="C7 Company Logo"
                  className="h-9 w-auto max-w-[130px] object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              <div className="text-[10px] uppercase leading-relaxed tracking-widest text-slate-500">
                <p className="text-cyan-400/70">Powered by</p>
                <p className="text-white/60">C7</p>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                CCTV with {' '}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                  AI-powered 
                </span>
                {' '}  And Automated Attendance System
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                SmartCCTV recognizes your students on camera, marks attendance automatically,
                checks uniforms, and keeps an eye on safety — so you can focus on teaching.
              </p>
            </div>

            {/* Feature stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
              <div className="rounded-xl border border-cyan-500/20 bg-[#091122]/70 p-3 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
                <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] uppercase font-bold">
                  <Cpu size={12} /> Face Recognition
                </div>
                <div className="mt-1 text-base font-black text-white">Sub-second</div>
                <div className="text-[10px] text-slate-500">128-d matching</div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-[#091122]/70 p-3 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] uppercase font-bold">
                  <Radio size={12} /> Threat Detection
                </div>
                <div className="mt-1 text-base font-black text-white">41 objects</div>
                <div className="text-[10px] text-slate-500">Weapons &amp; objects</div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-[#091122]/70 p-3 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                <div className="flex items-center gap-1.5 text-amber-400 text-[10px] uppercase font-bold">
                  <Palette size={12} /> Uniform Check
                </div>
                <div className="mt-1 text-base font-black text-white">6 shades</div>
                <div className="text-[10px] text-slate-500">Light / dark blue &amp; red</div>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-[#091122]/70 p-3 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                <div className="flex items-center gap-1.5 text-purple-400 text-[10px] uppercase font-bold">
                  <Hand size={12} /> Palm Verification
                </div>
                <div className="mt-1 text-base font-black text-white">Anti-spoof</div>
                <div className="text-[10px] text-slate-500">Prevents proxy attendance</div>
              </div>
            </div>

            {/* Feature points */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#070d18]/70 p-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Fingerprint size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Face check-in in under a second</h2>
                  <p className="mt-0.5 text-xs text-slate-400">The camera recognizes your students and marks attendance automatically, based on your class schedule.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#070d18]/70 p-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Activity size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Automatic voice announcements</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Students hear attendance and uniform reminders through the classroom speaker.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Capabilities ──────────────────────────────────── */}
        <div className="mt-16 pt-10 border-t border-cyan-500/20">
          <div className="text-center mb-8">
            <h2 className="text-xs uppercase tracking-widest text-cyan-400 mb-1">
              Everything you need
            </h2>
            <p className="text-xl font-bold text-white">One system for attendance and campus safety</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="relative rounded-2xl border border-cyan-500/20 bg-[#080e1d]/80 p-5 backdrop-blur-sm transition-all hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4">
                <Camera size={19} />
              </div>
              <h3 className="text-sm font-bold text-white">
                Biometric attendance
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Face recognition matches students against their enrolled photos and records their attendance automatically.
              </p>
            </div>

            <div className="relative rounded-2xl border border-emerald-500/20 bg-[#080e1d]/80 p-5 backdrop-blur-sm transition-all hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4">
                <AlertTriangle size={19} />
              </div>
              <h3 className="text-sm font-bold text-white">
                Threat detection
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                AI vision scans live footage for bladed weapons, firearms, and other prohibited objects, and flags them instantly.
              </p>
            </div>

            <div className="relative rounded-2xl border border-amber-500/20 bg-[#080e1d]/80 p-5 backdrop-blur-sm transition-all hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-4">
                <Palette size={19} />
              </div>
              <h3 className="text-sm font-bold text-white">
                Uniform policy check
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Checks clothing colors against your allowed uniform shades and reminds students when they're out of compliance.
              </p>
            </div>

            <div className="relative rounded-2xl border border-purple-500/20 bg-[#080e1d]/80 p-5 backdrop-blur-sm transition-all hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-4">
                <Hand size={19} />
              </div>
              <h3 className="text-sm font-bold text-white">
                Palm verification
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Optional open-palm confirmation prevents proxy attendance and keeps check-ins honest.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="relative z-20 border-t border-cyan-500/15 bg-[#040711]/90 px-4 py-6 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 sm:justify-start">
            <span className="text-slate-400">SmartCCTV</span>
            <span className="text-slate-700">|</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link
              to="/credits"
              className="group inline-flex items-center gap-1.5 text-cyan-400 transition-colors hover:text-cyan-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 transition-transform group-hover:scale-125 group-hover:shadow-[0_0_8px_#00f0ff]" />
              <span className="tracking-wider uppercase underline underline-offset-4 decoration-cyan-500/40 group-hover:decoration-cyan-400">
                Credits
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
