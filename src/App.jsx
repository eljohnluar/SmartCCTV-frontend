import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/common/Sidebar'
import Header from './components/common/Header'
import AdminSidebar from './components/common/AdminSidebar'
import AdminHeader from './components/common/AdminHeader'
import NotificationToast from './components/common/NotificationToast'

import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import LiveCamera from './pages/LiveCamera'
import Students from './pages/Students'
import Profile from './pages/Profile'
import Reports from './pages/Reports'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Credits from './pages/Credits'
import AdminDashboard from './pages/admin/AdminDashboard'
import TeacherManagement from './pages/admin/TeacherManagement'
import AdminStudents from './pages/admin/AdminStudents'
import AdminAttendance from './pages/admin/AdminAttendance'
import AuditLog from './pages/admin/AuditLog'
import AdminSettings from './pages/admin/AdminSettings'

const adminTitles = {
  '/admin': 'Administrator Dashboard',
  '/admin/teachers': 'Teacher Management',
  '/admin/students': 'Student Management',
  '/admin/attendance': 'Attendance Oversight',
  '/admin/audit': 'Audit Log',
  '/admin/settings': 'Administrator Settings',
  '/credits': 'System Credits & Research Team',
}

function AdminLayout() {
  const location = useLocation()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080d15] text-[#f1f5f9]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminHeader title={adminTitles[location.pathname] ?? 'SmartCCTV Administrator'} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/teachers" element={<TeacherManagement />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/admin/audit" element={<AuditLog />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function AppLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#050811] font-mono text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent shadow-[0_0_20px_#00f0ff]" />
          <span className="text-xs uppercase tracking-widest">Loading SmartCCTV…</span>
        </div>
      </div>
    )
  }

  // If user is not authenticated, display the Futuristic Cyberpunk Landing / Auth portal
  if (!user) {
    return <Landing />
  }

  if (user.role === 'admin') {
    return <AdminLayout />
  }

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Attendance Dashboard'
      case '/attendance':
        return 'Attendance'
      case '/live':
        return 'Live Camera Feed'
      case '/profile':
        return 'My Profile'
      case '/students':
        return 'Student Management'
      case '/reports':
        return 'Attendance Reports & Analytics'
      case '/alerts':
        return 'Security Alerts & Compliance'
      case '/settings':
        return 'System Settings'
      case '/credits':
        return 'System Credits & Research Team'
      default:
        return 'SmartCCTV'
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080d15] text-[#f1f5f9]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header title={getPageTitle(location.pathname)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/live" element={<LiveCamera />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/students" element={<Students />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NotificationToast />
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  )
}
