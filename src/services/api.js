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

// ── System ────────────────────────────────────────────────────────────────────

export const getSystemStatus = () => api.get('/system/status')
export const setAttendanceRecording = (enabled) => api.post('/camera/attendance-recording', { enabled })

export default api
