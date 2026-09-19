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

// ── Students ──────────────────────────────────────────────────────────────────

export const getStudents = (params) => api.get('/students', { params })
export const getStudentById = (id) => api.get(`/students/${id}`)
export const createStudent = (data) => api.post('/students', data)
export const updateStudent = (id, data) => api.put(`/students/${id}`, data)
export const deleteStudent = (id) => api.delete(`/students/${id}`)
export const enrollFace = (formData) =>
  api.post('/students/face-enroll', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// ── Attendance ────────────────────────────────────────────────────────────────

export const getTodayAttendance = () => api.get('/attendance/today')
export const getAttendanceByDate = (date) => api.get(`/attendance/date/${date}`)
export const markAttendanceManual = (data) => api.post('/attendance/manual', data)
export const resetAttendance = () => api.post('/attendance/reset')

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
export const resetAlerts = () => api.post('/alerts/reset')

// ── System ────────────────────────────────────────────────────────────────────

export const getSystemStatus = () => api.get('/system/status')
export const setAttendanceRecording = (enabled) => api.post('/camera/attendance-recording', { enabled })
export const testVoiceAnnouncement = () => api.post('/camera/test-voice')
export const getUniformPolicy = () => api.get('/settings/uniform-policy')
export const updateUniformPolicy = (uniform_colors) => api.put('/settings/uniform-policy', { uniform_colors })
export const getVoiceSettings = () => api.get('/settings/voice')
export const updateVoiceSettings = (voice_gender) => api.put('/settings/voice', { voice_gender })
export const getGestureAttendanceSettings = () => api.get('/settings/gesture-attendance')
export const updateGestureAttendanceSettings = (gesture_attendance_enabled) =>
  api.put('/settings/gesture-attendance', { gesture_attendance_enabled })
export const getRuntimeControls = () => api.get('/settings/runtime-controls')
export const updateRuntimeControls = (data) => api.put('/settings/runtime-controls', data)
export const getScheduleSettings = () => api.get('/settings/schedule')
export const updateScheduleSettings = (data) => api.put('/settings/schedule', data)

export default api
