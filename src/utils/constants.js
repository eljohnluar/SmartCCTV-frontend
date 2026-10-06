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
  TIME_OUT: 'time_out',
}

// How each stored status reads on screen
export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Time in',
  [ATTENDANCE_STATUS.LATE]: 'Late',
  [ATTENDANCE_STATUS.TIME_OUT]: 'Time out',
  absent: 'Absent',
}

// College year levels
export const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

// Five lettered sections exist inside every year level
export const SECTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

export const sectionLabel = (yearLevel, letter) => `${yearLevel} - Section ${letter}`

// Every class the institution can have: 4 year levels x 5 sections
export const COLLEGE_SECTIONS = YEAR_LEVELS.flatMap((year) => SECTION_LETTERS.map((letter) => sectionLabel(year, letter)))

/**
 * Sections a teacher may assign students to, from their year levels and letters.
 * An empty result means the account has no section access yet, so a teacher with
 * a partial or missing assignment sees nothing until an administrator finishes it.
 */
export function assignableSections(yearLevels, letters) {
  if (!yearLevels?.length || !letters?.length) return []
  return yearLevels.flatMap((year) => letters.filter((letter) => SECTION_LETTERS.includes(letter)).map((letter) => sectionLabel(year, letter)))
}

/** Pull the year level back out of a year-scoped section label. */
export function yearLevelOfSection(section) {
  return YEAR_LEVELS.find((year) => (section || '').startsWith(year)) ?? ''
}

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
