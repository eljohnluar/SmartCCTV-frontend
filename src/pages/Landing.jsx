import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Shield,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Cpu,
  Camera,
  Activity,
  AlertTriangle,
  ArrowRight,
  Fingerprint,
  Radio,
  Palette,
  Hand
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()

  // Toggle between 'login' and 'register'
  const [authMode, setAuthMode] = useState('login')

  // Form states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Registration specific
  const [fullName, setFullName] = useState('')
  const [registrationCode, setRegistrationCode] = useState('')
  const [email, setEmail] = useState('')

  // UI status
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Ticking 24-hour cyberpunk clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const time24 = currentTime.toLocaleTimeString('en-GB', { hour12: false })

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      toast.error('Please input username and password')
      return
    }

    setLoading(true)
    try {
      await login(username.trim(), password)
      toast.success(`Session authenticated: Welcome, ${username}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Authentication rejected. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      toast.error('Username and password are required.')
      return
    }

    if (!registrationCode.trim()) {
      toast.error('Registration code is required.')
      return
    }

    setLoading(true)
    try {
      await register({
        username: username.trim(),
        password,
        fullName: fullName.trim() || username.trim(),
        registrationCode: registrationCode.trim().toUpperCase(),
        email: email.trim() || `${username.trim().toLowerCase()}@institution.internal`,
      })
      toast.success('Registration authorized! Entering console...')
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Registration rejected.')
    } finally {
      setLoading(false)
    }
  }

  const quickDemoFill = () => {
    setUsername('teacher')
    setPassword('password123')
    toast('Demo credentials loaded', { icon: '⚡' })
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#050811] text-[#e2e8f0] font-sans selection:bg-cyan-500 selection:text-black">
      {/* ── Cyberpunk Scanline & Grid Background ───────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
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

      {/* CRT Scanline Horizontal Sweep Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.015) 2px, rgba(0, 240, 255, 0.015) 4px)',
        }}
      />

      {/* ── Cyber Top Navigation HUD Bar ───────────────────────────────────────── */}
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
                <span className="font-mono text-base font-extrabold tracking-wider text-white sm:text-lg">
                  SMART<span className="text-cyan-400">CCTV</span>
                </span>
                <span className="rounded border border-emerald-400/40 bg-emerald-500/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-300">
                  NEO-v2.6
                </span>
              </div>
              <p className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
                AI Vision &amp; Attendance Sentry System
              </p>
            </div>
          </div>

          {/* Telemetry Status Right */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Live 24-Hour UTC Clock */}
            <div className="hidden font-mono text-xs sm:block text-slate-400">
              <span className="text-cyan-400 mr-1.5">SYS_TIME //</span>
              <span className="text-cyan-200">{time24}</span>
            </div>

            {/* System Status Badge */}
            <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] font-semibold text-cyan-200">
                SYSTEM // ACTIVE
              </span>
            </div>

            {/* If user is logged in, show direct jump to dashboard */}
            {user && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-500/20 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-500/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
              >
                <span>OPEN CONSOLE</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Hero & Cyber Auth Console Section ─────────────────────────────── */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* ── Left Column: Cyberpunk Hero Presentation ──────────────────────── */}
          <div className="space-y-6 lg:col-span-7">
            {/* Mission Clearance Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/50 px-3 py-1 text-xs text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
              <span className="font-mono text-[11px] font-bold tracking-wider">
                INSPECTION READY // TERMINAL INTERFACE
              </span>
            </div>

            {/* Giant Futuristic Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                CCTV with{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                  AI-Powered
                </span>{' '}
                And Automated Attendance System
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                Biometric face recognition logging, real-time weapon &amp; threat neural sentry,
                student dress code compliance, and palm gesture authorization—built for automated
                institutional management.
              </p>
            </div>

            {/* Cyber Status Tickers */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
              <div className="rounded-xl border border-cyan-500/20 bg-[#091122]/70 p-3 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
                <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] uppercase font-bold">
                  <Cpu size={12} /> FaceNet 128D
                </div>
                <div className="mt-1 text-base font-black text-white">0.45 THRESH</div>
                <div className="text-[10px] text-slate-500">Cosine Matrix</div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-[#091122]/70 p-3 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] uppercase font-bold">
                  <Radio size={12} /> YOLOv8 Radar
                </div>
                <div className="mt-1 text-base font-black text-white">41 CLASSES</div>
                <div className="text-[10px] text-slate-500">Threat Sentry</div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-[#091122]/70 p-3 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                <div className="flex items-center gap-1.5 text-amber-400 text-[10px] uppercase font-bold">
                  <Palette size={12} /> Uniform HSV
                </div>
                <div className="mt-1 text-base font-black text-white">6 SHADES</div>
                <div className="text-[10px] text-slate-500">Light / Dark Blue &amp; Red</div>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-[#091122]/70 p-3 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                <div className="flex items-center gap-1.5 text-purple-400 text-[10px] uppercase font-bold">
                  <Hand size={12} /> Palm Lock
                </div>
                <div className="mt-1 text-base font-black text-white">ANTI-SPOOF</div>
                <div className="text-[10px] text-slate-500">Gesture Gate</div>
              </div>
            </div>

            {/* Detailed System Feature Points */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#070d18]/70 p-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Fingerprint size={16} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Sub-second Face Check-in</h2>
                  <p className="mt-0.5 text-[11px] text-slate-400">Live camera ingestion with automatic status determination based on class schedule.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#070d18]/70 p-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Activity size={16} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Automated Voice Feedback</h2>
                  <p className="mt-0.5 text-[11px] text-slate-400">Integrated text-to-speech speaker alerts students for attendance &amp; uniform compliance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Futuristic Cyberpunk Auth Terminal ──────────────── */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md">
              {/* Pulsing Outer HUD Brackets */}
              <div className="pointer-events-none absolute -inset-3.5 z-0">
                <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-cyan-400 shadow-[0_0_10px_#00f0ff]" />
                <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-cyan-400 shadow-[0_0_10px_#00f0ff]" />
                <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_10px_#00f0ff]" />
                <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_10px_#00f0ff]" />
              </div>

              {/* Main Card */}
              <div
                className="relative z-10 overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-[#0a1224] to-[#060a14] p-6 shadow-[0_0_50px_rgba(0,240,255,0.18)] backdrop-blur-2xl"
              >
                {/* Holographic Header Bar */}
                <div className="mb-6 flex items-center justify-between border-b border-cyan-500/20 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                      // AUTH_TERMINAL_GATE
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    CLEARANCE // SECURE
                  </span>
                </div>

                {/* ── Cyber Segmented Toggle Switch (Login vs Register) ──────────── */}
                <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-cyan-500/30 bg-[#050b17] p-1 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2.5 font-bold tracking-wider transition-all ${
                      authMode === 'login'
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Lock size={13} />
                    <span>LOGIN</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2.5 font-bold tracking-wider transition-all ${
                      authMode === 'register'
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <KeyRound size={13} />
                    <span>REGISTER</span>
                  </button>
                </div>

                {/* Operational Security Notice */}
                <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-2.5 font-mono text-[11px] text-emerald-300">
                  <Shield size={14} className="shrink-0 text-emerald-400" />
                  <div>
                    <span className="font-bold">SECURE OPERATIONAL ACCESS</span>
                    <p className="text-[10px] text-emerald-400/80">Encrypted institutional attendance and surveillance system.</p>
                  </div>
                </div>

                {/* ── Login Form ──────────────────────────────────────────────── */}
                {authMode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">
                        Username
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70" />
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                          className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] pl-10 pr-3 py-2.5 font-mono text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] pl-10 pr-10 py-2.5 font-mono text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-cyan-400 bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-mono text-xs font-extrabold uppercase tracking-widest text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:brightness-110 disabled:opacity-60"
                    >
                      <span className="relative z-10">
                        {loading ? 'AUTHENTICATING...' : 'INITIATE SESSION // ->'}
                      </span>
                    </button>

                    {/* Quick Demo Credentials Button */}
                    <div className="pt-2 flex items-center justify-between font-mono text-[11px] text-slate-500 border-t border-slate-800">
                      <span>Demo credentials:</span>
                      <button
                        type="button"
                        onClick={quickDemoFill}
                        className="text-cyan-400 hover:underline hover:text-cyan-300"
                      >
                        Auto-fill
                      </button>
                    </div>
                  </form>
                )}

                {/* ── Register Form ───────────────────────────────────────────── */}
                {authMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] px-3.5 py-2 font-mono text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                          Username *
                        </label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                          className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] px-3.5 py-2 font-mono text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] px-3.5 py-2 font-mono text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@institution.internal"
                        className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] px-3.5 py-2 font-mono text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* Registration Clearance Code (No hardcoded code shown in placeholder!) */}
                    <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-3">
                      <label className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1">
                        <KeyRound size={13} className="text-amber-400" />
                        Registration Code [Required]
                      </label>
                      <input
                        type="text"
                        required
                        value={registrationCode}
                        onChange={(e) => setRegistrationCode(e.target.value)}
                        placeholder="Enter registration code"
                        className="w-full rounded-lg border border-amber-500/50 bg-[#070c18] px-3 py-2 font-mono text-xs uppercase tracking-widest text-amber-200 placeholder-amber-700/60 focus:border-amber-400 focus:outline-none"
                      />
                      <p className="mt-1 text-[10px] font-mono text-slate-400">
                        Institutional authorization code required to register.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-emerald-400 bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 font-mono text-xs font-extrabold uppercase tracking-widest text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:brightness-110 disabled:opacity-60"
                    >
                      <span className="relative z-10">
                        {loading ? 'AUTHORIZING...' : 'AUTHORIZE & REGISTER // ->'}
                      </span>
                    </button>
                  </form>
                )}

                {/* Footer security stamp */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4 font-mono text-[10px] text-slate-500">
                  <span>TERMINAL: ENCRYPTED // TLS</span>
                  <span className="text-cyan-400/80">SMART CCTV © 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Feature Matrix Section ──────────────────────────────────── */}
        <div className="mt-16 pt-10 border-t border-cyan-500/20">
          <div className="text-center mb-8">
            <h2 className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-1">
              // INSTITUTIONAL CAPABILITIES
            </h2>
            <p className="text-xl font-bold text-white">Full-Spectrum Campus Neural Surveillance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="relative rounded-2xl border border-cyan-500/20 bg-[#080e1d]/80 p-5 backdrop-blur-sm transition-all hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4">
                <Camera size={19} />
              </div>
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wide">
                01 // Biometric Attendance
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                FaceNet-powered 128-dimensional embedding matching against pre-enrolled student facial vectors with 0.45 cosine threshold.
              </p>
            </div>

            <div className="relative rounded-2xl border border-emerald-500/20 bg-[#080e1d]/80 p-5 backdrop-blur-sm transition-all hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4">
                <AlertTriangle size={19} />
              </div>
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wide">
                02 // Threat Radar Sentry
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                YOLOv8 deep learning vision scans live frames 3 times/sec for bladed weapons, firearms, and contraband with persistent bounding boxes.
              </p>
            </div>

            <div className="relative rounded-2xl border border-amber-500/20 bg-[#080e1d]/80 p-5 backdrop-blur-sm transition-all hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-4">
                <Palette size={19} />
              </div>
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wide">
                03 // Uniform Policy Check
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Torso HSV color extraction classifies dark blue, light blue, dark red, and light red garments against allowed institutional uniform colors.
              </p>
            </div>

            <div className="relative rounded-2xl border border-purple-500/20 bg-[#080e1d]/80 p-5 backdrop-blur-sm transition-all hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-4">
                <Hand size={19} />
              </div>
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wide">
                04 // Palm Verification Gate
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Optional open-palm hand gesture biometric confirmation protocol to eliminate proxy attendance and spoofing.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Minimalist Cyber Footer ────────────────────────────────────────── */}
      <footer className="relative z-20 border-t border-cyan-500/15 bg-[#040711]/90 px-4 py-6 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-slate-500 sm:justify-start">
            <span className="text-slate-400">SMART CCTV</span>
            <span className="text-slate-700">|</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
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
