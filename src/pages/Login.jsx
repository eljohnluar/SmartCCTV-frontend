import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Shield,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/common/ThemeToggle'

export default function Login() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()

  // Toggle between 'signin' and 'signup'
  const [authMode, setAuthMode] = useState('signin')

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

  // Already authenticated: go straight to the console
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true })
    }
  }, [user, navigate])

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
      const session = await login(username.trim(), password)
      const landingRoute = session?.user?.role === 'admin' ? '/admin' : '/'
      toast.success(`Session authenticated: Welcome, ${username}!`)
      navigate(landingRoute)
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
      toast.success('Administrator clearance granted! Entering control console...')
      navigate('/admin')
    } catch (err) {
      toast.error(err.message || 'Registration rejected.')
    } finally {
      setLoading(false)
    }
  }

  const quickDemoFill = (role = 'teacher') => {
    setUsername(role)
    setPassword('password123')
    toast(`${role === 'admin' ? 'Administrator' : 'Teacher'} demo credentials loaded`, { icon: '⚡' })
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#050811] text-[#e2e8f0] font-sans selection:bg-cyan-500 selection:text-black">
      {/* ── Background ───────────────────────────────── */}
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

      {/* CRT Scanline Horizontal Sweep Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 cyber-bg"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.015) 2px, rgba(0, 240, 255, 0.015) 4px)',
        }}
      />

      {/* ── Cyber Top Navigation HUD Bar ───────────────────────────────────────── */}
      <header className="relative z-20 border-b border-cyan-500/20 bg-[#080d19]/80 backdrop-blur-xl px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo & System Identity */}
          <Link to="/landing" className="flex items-center gap-3.5">
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
          </Link>

          {/* Telemetry Status Right */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Live 24-Hour UTC Clock */}
            <div className="hidden font-mono text-xs sm:block text-slate-400">
              <span className="text-cyan-400 mr-1.5">Time</span>
              <span className="text-cyan-200">{time24}</span>
            </div>

            {/* System Status Badge */}
            <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] font-semibold text-cyan-200">
                All systems active
              </span>
            </div>

            {/* Back to landing */}
            <Link
              to="/landing"
              className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20"
            >
              <ArrowLeft size={13} />
              <span>Back to home</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Auth Terminal ──────────────────────────────────────────────────────── */}
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-77px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-8">
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
            {/* Card Header Bar */}
            <div className="mb-6 flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                <span className="text-sm font-bold text-cyan-300">
                  {authMode === 'signin' ? 'Welcome back' : 'Create your account'}
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                Secure sign-in
              </span>
            </div>

            {/* ── Segmented Toggle Switch (Sign in vs Sign up) ──────────── */}
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-cyan-500/30 bg-[#050b17] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 font-bold tracking-wider transition-all ${
                  authMode === 'signin'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock size={13} />
                <span>Sign in</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 font-bold tracking-wider transition-all ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound size={13} />
                <span>Sign up</span>
              </button>
            </div>

            {/* Security Notice */}
            <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-2.5 text-[11px] text-emerald-300">
              <Shield size={14} className="shrink-0 text-emerald-400" />
              <div>
                <span className="font-bold">Secure access</span>
                <p className="text-[10px] text-emerald-400/80">Your institutional attendance and surveillance data is encrypted.</p>
              </div>
            </div>

            {/* ── Sign In Form ──────────────────────────────────────────────── */}
            {authMode === 'signin' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
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
                      className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
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
                      className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
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
                  className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-cyan-400 bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:brightness-110 disabled:opacity-60"
                >
                  <span className="relative z-10">
                    {loading ? 'Signing in...' : 'Sign in'}
                  </span>
                </button>

                {/* Quick Demo Credentials Button */}
                <div className="pt-2 flex items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-800">
                  <span>Demo credentials:</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => quickDemoFill('teacher')}
                      className="text-cyan-400 hover:underline hover:text-cyan-300"
                    >
                      Teacher
                    </button>
                    <button
                      type="button"
                      onClick={() => quickDemoFill('admin')}
                      className="text-emerald-400 hover:underline hover:text-emerald-300"
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ── Sign Up Form ───────────────────────────────────────────── */}
            {authMode === 'signup' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] px-3.5 py-2 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] px-3.5 py-2 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] px-3.5 py-2 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@institution.internal"
                    className="w-full rounded-xl border border-cyan-500/30 bg-[#080e1d] px-3.5 py-2 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Administrator Clearance Code (no code revealed in the UI) */}
                <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-3">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 mb-1">
                    <KeyRound size={13} className="text-amber-400" />
                    Administrator Clearance Code (required)
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationCode}
                    onChange={(e) => setRegistrationCode(e.target.value)}
                    placeholder="Enter administrator code"
                    className="w-full rounded-lg border border-amber-500/50 bg-[#070c18] px-3 py-2 text-xs uppercase tracking-widest text-amber-200 placeholder-amber-700/60 focus:border-amber-400 focus:outline-none"
                  />
                  <p className="mt-1 text-[10px] text-slate-400">
                    Only administrators register here. Ask an administrator to create a teacher account.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-emerald-400 bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:brightness-110 disabled:opacity-60"
                >
                  <span className="relative z-10">
                    {loading ? 'Creating account...' : 'Create administrator account'}
                  </span>
                </button>
              </form>
            )}

            {/* Footer stamp */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4 text-[10px] text-slate-500">
              <span>Encrypted connection · TLS</span>
              <span className="text-cyan-400/80">SmartCCTV © 2026</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
