import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-500/10 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
              <path d="M15 10l4.553-2.069A1 1 0 0121 8.87V15a1 1 0 01-1.447.894L15 14" />
              <rect x="1" y="6" width="14" height="12" rx="2" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">SmartCCTV</h1>
          <p className="text-sm text-slate-500 mt-1">AI Attendance System</p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="admin@school.edu"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-green-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#242836] border border-[#2d3148] rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-green-500/50"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold bg-green-500 text-black rounded-lg hover:bg-green-400 disabled:opacity-60 transition-colors mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-slate-600 mt-4">
          SmartCCTV &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
