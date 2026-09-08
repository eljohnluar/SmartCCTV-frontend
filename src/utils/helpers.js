import { ATTENDANCE_STATUS, CONFIDENCE_THRESHOLDS } from './constants'

/**
 * Format a date string to a readable format
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

/**
 * Format a date to ISO date string YYYY-MM-DD
 */
export const toISODate = (date) => {
  const d = date ? new Date(date) : new Date()
  return d.toISOString().split('T')[0]
}

/**
 * Format a time string (ISO or Date) to HH:MM AM/PM
 */
export const formatTime = (datetime) => {
  if (!datetime) return '—'
  const d = typeof datetime === 'string' ? new Date(datetime) : datetime
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Calculate percentage, returns a string like "85.4%"
 */
export const toPercent = (value, total, decimals = 1) => {
  if (!total || total === 0) return '0%'
  return `${((value / total) * 100).toFixed(decimals)}%`
}

/**
 * Return Tailwind color classes based on attendance status
 */
export const statusColors = (status) => {
  switch (status) {
    case ATTENDANCE_STATUS.PRESENT:
      return {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/30',
        dot: 'bg-green-400',
      }
    case ATTENDANCE_STATUS.ABSENT:
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30',
        dot: 'bg-red-400',
      }
    case ATTENDANCE_STATUS.LATE:
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400',
      }
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
      }
  }
}

/**
 * Return color class based on confidence score
 */
export const confidenceColor = (score) => {
  if (score >= CONFIDENCE_THRESHOLDS.HIGH) return 'text-green-400'
  if (score >= CONFIDENCE_THRESHOLDS.MEDIUM) return 'text-amber-400'
  return 'text-red-400'
}

/**
 * Truncate text to a max length with ellipsis
 */
export const truncate = (str, max = 30) => {
  if (!str) return ''
  return str.length > max ? `${str.slice(0, max)}…` : str
}

/**
 * Generate initials from a full name (up to 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Debounce a function by a delay in ms
 */
export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Format confidence score as a percentage string
 */
export const formatConfidence = (score) => {
  if (score === null || score === undefined) return '—'
  return `${(score * 100).toFixed(1)}%`
}

/**
 * Returns today's date as a readable string
 */
export const todayLabel = () =>
  new Date().toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
