import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/common/Sidebar'
import Header from './components/common/Header'
import NotificationToast from './components/common/NotificationToast'

import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Reports from './pages/Reports'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import Landing from './pages/Landing'
import Credits from './pages/Credits'

function AppLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#050811] font-mono text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent shadow-[0_0_20px_#00f0ff]" />
          <span className="text-xs uppercase tracking-widest">// INITIALIZING SMART CCTV CORE...</span>
        </div>
      </div>
    )
  }

  // If user is not authenticated, display the Futuristic Cyberpunk Landing / Auth portal
  if (!user) {
    return <Landing />
  }

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Attendance Dashboard'
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
            <Route path="/students" element={<Students />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/credits" element={<Credits />} />
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
          <Route path="/login" element={<Landing />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  )
}
