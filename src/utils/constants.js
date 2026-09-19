// API route constants
export const API_ROUTES = {
  // Students
  STUDENTS: '/students',
  STUDENT_BY_ID: (id) => `/students/${id}`,
  STUDENT_FACE_ENROLL: '/students/face-enroll',

  // Attendance
  ATTENDANCE_TODAY: '/attendance/today',
  ATTENDANCE_BY_DATE: (date) => `/attendance/date/${date}`,
  ATTENDANCE_MANUAL: '/attendance/manual',

  // Reports
  REPORTS_SUMMARY: '/reports/summary',
  REPORTS_TREND: '/reports/trend',
  REPORTS_EXPORT_PDF: '/reports/export/pdf',
  REPORTS_EXPORT_EXCEL: '/reports/export/excel',
  REPORTS_EXPORT_CSV: '/reports/export/csv',

  // Alerts
  ALERTS: '/alerts',
  ALERT_BY_ID: (id) => `/alerts/${id}`,

  // System
  SYSTEM_STATUS: '/system/status',
}

// Attendance status options
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  LATE: 'late',
}

// Section options
export const SECTIONS = [
  'Section A',
  'Section B',
  'Section C',
  'Section D',
  'Section E',
]

// Grade level options
export const GRADE_LEVELS = [
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
]

// Alert types
export const ALERT_TYPES = {
  WEAPON: 'weapon_detected',
  TRESPASSER: 'trespasser',
  COMPLIANCE: 'compliance_violation',
  UNKNOWN: 'unknown_face',
}

// System status options
export const SYSTEM_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  PROCESSING: 'processing',
  ERROR: 'error',
}

// Table pagination
export const PAGE_SIZES = [10, 25, 50, 100]
export const DEFAULT_PAGE_SIZE = 25

// Recognition confidence threshold display
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.90,
  MEDIUM: 0.75,
  LOW: 0.0,
}
