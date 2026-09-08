import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/common/Sidebar'
import Header from './components/common/Header'
import NotificationToast from './components/common/NotificationToast'

import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Reports from './pages/Reports'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import Login from './pages/Login'

function AppLayout() {
  const location = useLocation()

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
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  )
}
