import { AtSign, BadgeCheck, GraduationCap, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCurrentAccount } from '../services/api'
import { assignableSections } from '../utils/constants'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Profile() {
  const { user: localUser } = useAuth()
  const [account, setAccount] = useState(localUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getCurrentAccount()
      .then((fresh) => {
        if (!cancelled && fresh) setAccount(fresh)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading && !account) {
    return (
      <div className="py-20">
        <LoadingSpinner />
      </div>
    )
  }

  const user = account || localUser
  const initial = (user?.full_name || user?.username || 'T').slice(0, 1).toUpperCase()
  const sections = assignableSections(user?.year_levels ?? [], user?.sections ?? [])
  const yearLevels = user?.year_levels ?? []
  const letters = user?.sections ?? []

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <div className="overflow-hidden rounded-3xl border border-[#263449] bg-[#111a27]/80">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-emerald-500/25 via-emerald-400/10 to-transparent sm:h-28" />

        {/* Identity */}
        <div className="px-6 pb-8 sm:px-8">
          <div className="-mt-10 flex items-end justify-between">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-[#111a27] bg-emerald-400/20 text-3xl font-black text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              {initial}
            </div>
            <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              <BadgeCheck size={12} />
              {user?.role === 'admin' ? 'Administrator' : 'Teacher'}
            </span>
          </div>

          <h2 className="mt-4 text-xl font-bold text-white">{user?.full_name || 'Faculty Instructor'}</h2>
          <p className="mt-1 font-mono text-xs text-slate-500">@{user?.username || 'teacher'}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-[#2d3148] bg-[#172235] px-4 py-3">
              <Mail size={15} className="shrink-0 text-emerald-400" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Email</p>
                <p className="truncate text-sm text-slate-200">{user?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[#2d3148] bg-[#172235] px-4 py-3">
              <AtSign size={15} className="shrink-0 text-emerald-400" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Username</p>
                <p className="truncate font-mono text-sm text-slate-200">{user?.username || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching scope */}
      <div className="rounded-3xl border border-[#263449] bg-[#111a27]/80 p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
            <GraduationCap size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Classes handled</h3>
            <p className="text-xs text-slate-500">Attendance marking scope for this account</p>
          </div>
        </div>

        {sections.length === 0 ? (
          <p
            className={`rounded-xl px-4 py-3 text-sm ${
              user?.role === 'teacher'
                ? 'border border-amber-400/20 bg-amber-400/5 text-amber-200'
                : 'border border-emerald-400/20 bg-emerald-400/5 text-emerald-300'
            }`}
          >
            {user?.role === 'teacher'
              ? 'No sections are assigned to your account yet. Ask an administrator to assign your year levels and sections.'
              : 'Full access — this account can manage every year level and section.'}
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5">
              {yearLevels.map((year) => (
                <span key={year} className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                  {year}
                </span>
              ))}
              {letters.map((letter) => (
                <span key={letter} className="rounded-lg border border-[#2d3148] bg-[#172235] px-2.5 py-1 font-mono text-xs text-slate-300">
                  Section {letter}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              {sections.length} class{sections.length === 1 ? '' : 'es'} in scope: {sections.join(', ')}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
