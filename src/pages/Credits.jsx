import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Shield,
  ArrowLeft,
  GraduationCap,
  Cpu,
  Camera,
  Code2,
  Server,
  Database,
  Radio,
  Sparkles,
  ExternalLink,
  Award,
  Layers,
  Terminal
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Team members list with photo filenames and roles
const TEAM_MEMBERS = [
  {
    id: 'rebano',
    name: 'Rebaño, Eljohn L.',
    role: 'Lead Developer & AI System Architect',
    subRole: 'Neural Networks & Full-Stack Integration',
    slugs: ['rebano', 'rebano_eljohn', 'eljohn_rebano'],
    initials: 'ER',
    specialty: 'Computer Vision & Deep Learning Pipeline',
    badge: 'CORE // ARCHITECT',
  },
  {
    id: 'pablo',
    name: 'Pablo, Christian F.',
    role: 'AI Model & Computer Vision Engineer',
    subRole: 'YOLOv8 Threat Sentry & Frame Processor',
    slugs: ['pablo', 'pablo_christian', 'christian_pablo'],
    initials: 'CP',
    specialty: 'Object Detection & Threat Heuristics',
    badge: 'AI // HEURISTICS',
  },
  {
    id: 'dasig',
    name: 'Dasig, Charles Aivan M.',
    role: 'Backend Systems & API Engineer',
    subRole: 'FastAPI, RTSP Streaming & WebSockets',
    slugs: ['dasig', 'dasig_charles', 'charles_dasig'],
    initials: 'CD',
    specialty: 'Async Stream Ingestion & Microservices',
    badge: 'BACKEND // ENGINE',
  },
  {
    id: 'ortega',
    name: 'Ortega, Jerold C.',
    role: 'Database & Security Engineer',
    subRole: 'Supabase PostgreSQL & Embedding Storage',
    slugs: ['ortega', 'ortega_jerold', 'jerold_ortega'],
    initials: 'JO',
    specialty: 'Vector Database & Data Security',
    badge: 'DATABASE // OPS',
  },
  {
    id: 'rustia',
    name: 'Rustia, Reynielle N.',
    role: 'Cyberpunk UI/UX & Frontend Developer',
    subRole: 'React 19, Tailwind HUD & Real-Time Feeds',
    slugs: ['rustia', 'rustia_reynielle', 'reynielle_rustia'],
    initials: 'RR',
    specialty: 'Dynamic Interactive Dashboards',
    badge: 'FRONTEND // UI/UX',
  },
  {
    id: 'borres',
    name: 'Borres, Earlwyn Kyle T.',
    role: 'Biometric Analytics & QA Engineer',
    subRole: 'Face Matching Accuracy & Dress Code Sentry',
    slugs: ['borres', 'borres_earlwyn', 'earlwyn_borres'],
    initials: 'EB',
    specialty: 'Model Benchmarking & Quality Assurance',
    badge: 'QA // VALIDATION',
  },
  {
    id: 'limpag',
    name: 'Limpag, John Laurence A.',
    role: 'Hardware Integration & Systems Support',
    subRole: 'Camera Feed Ingestion & Network Protocol',
    slugs: ['limpag', 'limpag_john', 'john_limpag'],
    initials: 'JL',
    specialty: 'CCTV Hardware Calibration & Deployment',
    badge: 'HARDWARE // I/O',
  },
]

const ADVISER = {
  name: 'Prof. Joel Almazan',
  title: 'Project Adviser & Technopreneurship Mentor',
  department: 'College of Computer Studies',
  institution: 'Bestlink College of the Philippines',
  slugs: ['almazan', 'prof_almazan', 'joel_almazan', 'almazan_joel'],
  initials: 'JA',
  message:
    'Guiding the research, technical architecture, and implementation of the Smart CCTV Automated Biometric Attendance & Security Sentry System.',
}

/**
 * MemberPhoto Component:
 * Tries loading photos from /photos/credits_name/<slug>.jpg (or .png, .webp).
 * Falls back to a high-tech cyberpunk placeholder avatar with initials if the photo is not found.
 */
function MemberPhoto({ slugs = [], initials = '?', name = '' }) {
  const [candidateIndex, setCandidateIndex] = useState(0)
  const [loadError, setLoadError] = useState(false)

  // Generate candidate paths from slugs
  const candidateExtensions = ['jpg', 'png', 'jpeg', 'webp']
  const candidates = slugs.flatMap((slug) =>
    candidateExtensions.map((ext) => `/photos/credits_name/${slug}.${ext}`)
  )

  const currentSrc = candidates[candidateIndex]

  const handleImgError = () => {
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex((prev) => prev + 1)
    } else {
      setLoadError(true)
    }
  }

  if (loadError || !currentSrc) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1426] via-[#060b16] to-[#040810]">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 240, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.2) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Outer pulsing ring */}
        <div className="absolute h-24 w-24 rounded-full border border-cyan-500/30 animate-pulse" />
        <div className="absolute h-28 w-28 rounded-full border border-dashed border-cyan-500/20" />

        {/* Initials & Cyber Badge */}
        <div className="relative flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-black tracking-widest text-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.6)] sm:text-3xl">
            {initials}
          </span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-cyan-500/80">
            PHOTO PENDING
          </span>
        </div>

        {/* Corner HUD markers */}
        <span className="absolute left-1 top-1 h-2 w-2 border-l border-t border-cyan-400" />
        <span className="absolute right-1 top-1 h-2 w-2 border-r border-t border-cyan-400" />
        <span className="absolute bottom-1 left-1 h-2 w-2 border-b border-l border-cyan-400" />
        <span className="absolute bottom-1 right-1 h-2 w-2 border-b border-r border-cyan-400" />
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={name}
      onError={handleImgError}
      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
    />
  )
}

export default function Credits() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Ticking 24-hour clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const time24 = currentTime.toLocaleTimeString('en-GB', { hour12: false })

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

      {/* CRT Scanline Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.015) 2px, rgba(0, 240, 255, 0.015) 4px)',
        }}
      />

      {/* ── Cyber Top Navigation HUD Bar ───────────────────────────────────────── */}
      <header className="relative z-20 border-b border-cyan-500/20 bg-[#080d19]/85 backdrop-blur-xl px-4 py-3.5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo & System Identity */}
          <div className="flex items-center gap-3.5">
            <Link
              to="/"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/40 bg-black/60 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-transform hover:scale-105"
            >
              <img
                src="/logo-mark.jpg"
                alt="SmartCCTV Logo"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <span className="absolute inset-0 border border-cyan-400/30 rounded-xl" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-extrabold tracking-wider text-white sm:text-lg">
                  SMART<span className="text-cyan-400">CCTV</span>
                </span>
                <span className="rounded border border-cyan-400/40 bg-cyan-500/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-cyan-300">
                  SYSTEM CREDITS
                </span>
              </div>
              <p className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
                Bestlink College of the Philippines
              </p>
            </div>
          </div>

          {/* Navigation Controls Right */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden font-mono text-xs sm:block text-slate-400">
              <span className="text-cyan-400 mr-1.5">SYS_TIME //</span>
              <span className="text-cyan-200">{time24}</span>
            </div>

            <button
              onClick={() => navigate(user ? '/' : '/login')}
              className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 font-mono text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all hover:bg-cyan-500/20 hover:text-cyan-100 hover:shadow-[0_0_25px_rgba(0,240,255,0.3)]"
            >
              <ArrowLeft size={14} />
              <span>{user ? 'RETURN TO CONSOLE' : 'BACK TO PORTAL'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ────────────────────────────────────────────── */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        {/* ── Institutional Banner: Bestlink College of the Philippines ────────── */}
        <section className="relative mb-12 overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#071124] via-[#091730] to-[#060e1d] p-6 shadow-[0_0_40px_rgba(0,240,255,0.12)] sm:p-10">
          {/* Cyberpunk corner accents */}
          <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-cyan-400" />
          <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-cyan-400" />
          <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-cyan-400" />
          <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-cyan-400" />

          <div className="flex flex-col items-center text-center">
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/60 px-3.5 py-1 text-xs text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)] mb-4">
              <GraduationCap size={15} className="text-cyan-400" />
              <span className="font-mono text-[11px] font-bold tracking-widest uppercase">
                ACADEMIC RESEARCH &amp; DEVELOPMENT
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-wide text-white sm:text-4xl lg:text-5xl">
              BESTLINK COLLEGE OF THE PHILIPPINES
            </h1>

            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-cyan-300 sm:text-sm">
              College of Computer Studies // Information Technology
            </p>

            <div className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-300 sm:text-sm">
              <p>
                The <span className="font-bold text-white">SmartCCTV: CCTV with AI-Powered and Automated Attendance System</span> was
                researched, architected, and engineered by students and faculty at{' '}
                <span className="font-semibold text-cyan-300">Bestlink College of the Philippines</span>. The system integrates
                real-time computer vision, FaceNet deep biometric vectors, YOLOv8 threat heuristics, and automated uniform compliance.
              </p>
            </div>

            {/* Telemetry Tags */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 font-mono text-[10px]">
              <span className="rounded-lg border border-cyan-500/30 bg-black/40 px-3 py-1 text-cyan-300">
                CAMPUS: NOVALICHES, QUEZON CITY
              </span>
              <span className="rounded-lg border border-emerald-500/30 bg-black/40 px-3 py-1 text-emerald-300">
                ACADEMIC YEAR: 2025–2026
              </span>
              <span className="rounded-lg border border-purple-500/30 bg-black/40 px-3 py-1 text-purple-300">
                TECHNOPRENEURSHIP PROJECT &bull; SYSTEM VERSION: 2.6
              </span>
            </div>
          </div>
        </section>

        {/* ── Project Adviser Section: Prof. Joel Almazan ─────────────────────── */}
        <section className="mb-14">
          <div className="mb-6 flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-cyan-400" />
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-300">
                // PROJECT ADVISER &amp; MENTOR
              </h2>
            </div>
            <span className="font-mono text-[10px] text-slate-500">FACULTY GUIDANCE</span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-[#091428] to-[#070e1c] p-6 shadow-[0_0_35px_rgba(0,240,255,0.15)] sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
              {/* Photo Frame */}
              <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl border-2 border-cyan-400/80 bg-black shadow-[0_0_25px_rgba(0,240,255,0.35)] sm:h-40 sm:w-40">
                <MemberPhoto
                  slugs={ADVISER.slugs}
                  initials={ADVISER.initials}
                  name={ADVISER.name}
                />
                {/* Holographic border shine */}
                <div className="pointer-events-none absolute inset-0 border border-cyan-400/40 rounded-2xl" />
              </div>

              {/* Adviser Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300 mb-2">
                  <Sparkles size={11} className="text-emerald-400" />
                  <span>PROJECT ADVISER</span>
                </div>

                <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                  {ADVISER.name}
                </h3>

                <p className="mt-1 font-mono text-xs text-cyan-300">
                  {ADVISER.title} &bull; {ADVISER.department}
                </p>

                <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                  {ADVISER.institution}
                </p>

                <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-300">
                  {ADVISER.message}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="rounded-md border border-cyan-500/20 bg-cyan-950/30 px-2.5 py-1 font-mono text-[10px] text-cyan-300">
                    ADVISER CODE: ADVISER-BCP
                  </span>
                  <span className="rounded-md border border-slate-700 bg-slate-900/50 px-2.5 py-1 font-mono text-[10px] text-slate-400">
                    TECHNOPRENEURSHIP ADVISORY COUNCIL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Development Team Section: 7 Core Members ───────────────────────── */}
        <section className="mb-14">
          <div className="mb-6 flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-cyan-400" />
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-300">
                // DEVELOPMENT &amp; RESEARCH TEAM
              </h2>
            </div>
            <span className="font-mono text-[10px] text-slate-500">
              7 VERIFIED OPERATORS
            </span>
          </div>

          {/* Grid of Team Members */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEAM_MEMBERS.map((member, index) => (
              <div
                key={member.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-b from-[#091222] to-[#060a15] p-5 shadow-[0_0_20px_rgba(0,240,255,0.06)] transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(0,240,255,0.22)]"
              >
                {/* Cyber corner brackets on hover */}
                <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-cyan-400 opacity-60 transition-opacity group-hover:opacity-100" />
                <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-cyan-400 opacity-60 transition-opacity group-hover:opacity-100" />
                <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-cyan-400 opacity-60 transition-opacity group-hover:opacity-100" />
                <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-cyan-400 opacity-60 transition-opacity group-hover:opacity-100" />

                {/* Index tag & Badge */}
                <div className="mb-3.5 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-cyan-400/80 font-bold">
                    0{index + 1} // ENG
                  </span>
                  <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-cyan-300 font-bold border border-cyan-500/20">
                    {member.badge}
                  </span>
                </div>

                {/* Photo Box */}
                <div className="relative mx-auto mb-4 h-44 w-full overflow-hidden rounded-xl border border-cyan-500/40 bg-black shadow-inner">
                  <MemberPhoto
                    slugs={member.slugs}
                    initials={member.initials}
                    name={member.name}
                  />
                  {/* Glowing bottom gradient */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                {/* Member Details */}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white tracking-wide group-hover:text-cyan-200 transition-colors">
                    {member.name}
                  </h3>

                  <p className="mt-1 font-mono text-xs font-semibold text-cyan-400">
                    {member.role}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">
                    {member.subRole}
                  </p>

                  <div className="mt-3 rounded-lg border border-slate-800 bg-[#040810]/70 p-2 font-mono text-[10px] text-slate-400">
                    <span className="text-cyan-400 font-bold">SPECIALTY: </span>
                    {member.specialty}
                  </div>
                </div>

                {/* Status Bar */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 font-mono text-[10px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    VERIFIED
                  </span>
                  <span className="text-slate-500">BCP-STUDENT</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── System Architecture & Core Stack ───────────────────────────────── */}
        <section className="mb-14 rounded-2xl border border-cyan-500/20 bg-[#080d19]/80 p-6 sm:p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-cyan-400" />
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-300">
                // SYSTEM ARCHITECTURE &amp; TECHNOLOGIES
              </h2>
            </div>
            <span className="font-mono text-[10px] text-slate-500">
              HIGH-PERFORMANCE STACK
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
            <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Cpu size={15} />
                <span>Deep Learning Biometrics</span>
              </div>
              <p className="mt-2 text-[11px] font-sans text-slate-400">
                OpenCV YuNet &amp; FaceNet model producing 128-dimensional cosine vector embeddings for instantaneous student recognition.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Radio size={15} />
                <span>YOLOv8 Threat Sentry</span>
              </div>
              <p className="mt-2 text-[11px] font-sans text-slate-400">
                Ultralytics YOLOv8 object detection scanning video frames 3x/sec for bladed weapons, firearms, and hazardous materials.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Camera size={15} />
                <span>HSV Uniform Policy Engine</span>
              </div>
              <p className="mt-2 text-[11px] font-sans text-slate-400">
                Autonomous torso crop analyzer mapping light/dark blue and light/dark red clothing against institutional dress regulations.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Server size={15} />
                <span>FastAPI Async Server</span>
              </div>
              <p className="mt-2 text-[11px] font-sans text-slate-400">
                High-throughput Python asynchronous web server handling OpenCV RTSP camera loops and MJPEG multi-client streaming.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
              <div className="flex items-center gap-2 text-teal-400 font-bold">
                <Database size={15} />
                <span>Supabase Realtime Cloud</span>
              </div>
              <p className="mt-2 text-[11px] font-sans text-slate-400">
                PostgreSQL database storing attendance logs, encrypted vector embeddings, and pushing live WebSocket state updates.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
              <div className="flex items-center gap-2 text-pink-400 font-bold">
                <Terminal size={15} />
                <span>Futuristic React HUD</span>
              </div>
              <p className="mt-2 text-[11px] font-sans text-slate-400">
                Next-gen responsive web portal with real-time video overlay feeds, audio announcer synthesis, and telemetry dashboards.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Minimalist Cyber Footer ────────────────────────────────────────── */}
      <footer className="relative z-20 border-t border-cyan-500/20 bg-[#040711]/95 px-4 py-6 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-slate-500 sm:justify-start">
            <span className="text-cyan-400">SMART CCTV</span>
            <span className="text-slate-700">|</span>
            <span>BESTLINK COLLEGE OF THE PHILIPPINES</span>
            <span className="text-slate-700">|</span>
            <span>RESEARCH TEAM &copy; {new Date().getFullYear()}</span>
          </div>

          {!user && (
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <Link
                to="/"
                className="text-slate-400 transition-colors hover:text-cyan-300"
              >
                Back to Portal
              </Link>
              <span className="text-slate-700">|</span>
              <Link
                to="/login"
                className="text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
              >
                Login Console
              </Link>
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}
