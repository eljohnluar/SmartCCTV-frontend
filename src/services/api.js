import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global error handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)

// ── Authentication ────────────────────────────────────────────────────────────
export const loginUser = (data) => api.post('/auth/login', data)
export const registerUser = (data) => api.post('/auth/register', data)
export const getCurrentAccount = () => api.get('/auth/me')

// ── Administrator console ─────────────────────────────────────────────────────
export const getAdminSummary = () => api.get('/admin/summary')
export const getTeacherAccounts = (params) => api.get('/admin/teachers', { params })
export const createTeacherAccount = (data) => api.post('/admin/teachers', data)
export const updateTeacherAccount = (id, data, password) =>
  api.put(`/admin/teachers/${id}`, data, { headers: confirmHeaders(password) })
export const deleteTeacherAccount = (id, password) =>
  api.delete(`/admin/teachers/${id}`, { headers: confirmHeaders(password) })
export const getAttendanceOverview = (params) => api.get('/admin/attendance', { params })
export const getAuditLog = (params) => api.get('/admin/audit-log', { params })

// ── Students ──────────────────────────────────────────────────────────────────

// Destructive actions require the signed-in account's password again.
const confirmHeaders = (password) => (password ? { 'X-Confirm-Password': password } : {})

export const getStudents = (params) => api.get('/students', { params })
export const getStudentById = (id) => api.get(`/students/${id}`)
export const createStudent = (data, password) =>
  api.post('/students', data, { headers: confirmHeaders(password) })
export const updateStudent = (id, data) => api.put(`/students/${id}`, data)
export const deleteStudent = (id, password) =>
  api.delete(`/students/${id}`, { headers: confirmHeaders(password) })
export const enrollFace = (formData, password) =>
  api.post('/students/face-enroll', formData, {
    headers: { 'Content-Type': 'multipart/form-data', ...confirmHeaders(password) },
  })

// ── Attendance ────────────────────────────────────────────────────────────────

export const getTodayAttendance = () => api.get('/attendance/today')
export const getAttendanceByDate = (date) => api.get(`/attendance/date/${date}`)
export const markAttendanceManual = (data) => api.post('/attendance/manual', data)
export const resetAttendance = (password) =>
  api.post('/attendance/reset', null, { headers: confirmHeaders(password) })

// ── Reports ───────────────────────────────────────────────────────────────────

export const getReportsSummary = (params) => api.get('/reports/summary', { params })
export const getReportsTrend = (params) => api.get('/reports/trend', { params })
export const exportReportCSV = (params) =>
  api.get('/reports/export/csv', { params, responseType: 'blob' })
export const exportReportPDF = (params) =>
  api.get('/reports/export/pdf', { params, responseType: 'blob' })

// ── Alerts ────────────────────────────────────────────────────────────────────

export const getAlerts = (params) => api.get('/alerts', { params })
export const updateAlert = (id, data) => api.put(`/alerts/${id}`, data)
export const resetAlerts = (password) =>
  api.post('/alerts/reset', null, { headers: confirmHeaders(password) })

// ── System ────────────────────────────────────────────────────────────────────

export const getSystemStatus = () => api.get('/system/status')
export const setAttendanceRecording = (enabled) => api.post('/camera/attendance-recording', { enabled })
export const testVoiceAnnouncement = () => api.post('/camera/test-voice')
export const getUniformPolicy = () => api.get('/settings/uniform-policy')
export const updateUniformPolicy = (uniform_colors, password) =>
  api.put('/settings/uniform-policy', { uniform_colors }, { headers: confirmHeaders(password) })
export const getVoiceSettings = () => api.get('/settings/voice')
export const updateVoiceSettings = (voice_gender, password) =>
  api.put('/settings/voice', { voice_gender }, { headers: confirmHeaders(password) })
export const getGestureAttendanceSettings = () => api.get('/settings/gesture-attendance')
export const updateGestureAttendanceSettings = (gesture_attendance_enabled, password) =>
  api.put('/settings/gesture-attendance', { gesture_attendance_enabled }, { headers: confirmHeaders(password) })
export const getRuntimeControls = () => api.get('/settings/runtime-controls')
export const updateRuntimeControls = (data, password) =>
  api.put('/settings/runtime-controls', data, { headers: confirmHeaders(password) })
export const getScheduleSettings = () => api.get('/settings/schedule')
export const updateScheduleSettings = (data, password) =>
  api.put('/settings/schedule', data, { headers: confirmHeaders(password) })

export default api
