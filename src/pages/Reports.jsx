import { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import SummaryCards from '../components/reports/SummaryCards'
import TrendChart from '../components/reports/TrendChart'
import DistributionChart from '../components/reports/DistributionChart'
import ReportFilters from '../components/reports/ReportFilters'
import ReportTable from '../components/reports/ReportTable'
import SectionScopeNotice from '../components/common/SectionScopeNotice'
import { getReportsSummary, getReportsTrend, getReportRecords } from '../services/api'
import { toISODate, formatDate, formatTime, statusLabel } from '../utils/helpers'
import { yearLevelOfSection } from '../utils/constants'

const MOCK_SUMMARY = {
  avg_rate: 87.5,
  total_present: 142,
  total_late: 12,
  total_time_out: 3,
  total_students: 154,
}

const MOCK_TREND = [
  { date: 'Mon', rate: 82 },
  { date: 'Tue', rate: 89 },
  { date: 'Wed', rate: 85 },
  { date: 'Thu', rate: 91 },
  { date: 'Fri', rate: 88 },
  { date: 'Sat', rate: 79 },
  { date: 'Sun', rate: 86 },
]

const MOCK_RECORDS = [
  { id: 101, class_date: '2026-09-06', student_name: 'Maria Santos', section: '1st Year - Section A', status: 'present', check_in_time: '2026-09-06T07:45:00Z', check_out_time: '2026-09-06T16:05:00Z', confidence: 0.98 },
  { id: 102, class_date: '2026-09-06', student_name: 'Juan Dela Cruz', section: '1st Year - Section A', status: 'time_out', check_in_time: '2026-09-06T08:15:00Z', check_out_time: '2026-09-06T17:40:00Z', confidence: 0.92 },
  { id: 103, class_date: '2026-09-06', student_name: 'Carlos Mendoza', section: '2nd Year - Section B', status: 'present', check_in_time: '2026-09-06T07:50:00Z', confidence: 0.94 },
  { id: 104, class_date: '2026-09-06', student_name: 'Ana Reyes', section: '2nd Year - Section C', status: 'present', check_in_time: '2026-09-06T07:52:00Z', confidence: 0.95 },
  { id: 105, class_date: '2026-09-06', student_name: 'Miguel Torres', section: '3rd Year - Section C', status: 'present', check_in_time: '2026-09-06T07:55:00Z', confidence: 0.96 },
  { id: 106, class_date: '2026-09-06', student_name: 'Elena Garcia', section: '3rd Year - Section D', status: 'late', check_in_time: '2026-09-06T08:35:00Z', confidence: 0.91 },
  { id: 107, class_date: '2026-09-06', student_name: 'Sofia Ramos', section: '4th Year - Section A', status: 'present', check_in_time: '2026-09-06T07:40:00Z', confidence: 0.99 },
  { id: 108, class_date: '2026-09-06', student_name: 'Luis Bautista', section: '4th Year - Section E', status: 'late', check_in_time: '2026-09-06T08:10:00Z', confidence: 0.89 },
]

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const filterRecords = (records, filters) =>
  records.filter((record) => {
    const day = String(record.class_date || '').slice(0, 10)
    if (filters.dateFrom && day < filters.dateFrom) return false
    if (filters.dateTo && day > filters.dateTo) return false
    if (filters.section && record.section !== filters.section) return false
    if (filters.yearLevel && yearLevelOfSection(record.section) !== filters.yearLevel) return false
    return true
  })

export default function Reports() {
  const [filters, setFilters] = useState({
    dateFrom: toISODate(new Date(Date.now() - 7 * 86400000)),
    dateTo: toISODate(new Date()),
    yearLevel: '',
    section: '',
  })
  const [summary, setSummary] = useState(MOCK_SUMMARY)
  const [trend, setTrend] = useState(MOCK_TREND)
  const [rawRecords, setRawRecords] = useState(MOCK_RECORDS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [sumRes, trendRes, recordsRes] = await Promise.all([
          getReportsSummary(filters),
          getReportsTrend(filters),
          getReportRecords(filters),
        ])
        if (sumRes) setSummary(sumRes)
        if (trendRes) setTrend(trendRes)
        if (Array.isArray(recordsRes)) setRawRecords(recordsRes)
        else setRawRecords(MOCK_RECORDS)
      } catch (err) {
        setRawRecords(MOCK_RECORDS)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [filters])

  const records = useMemo(() => filterRecords(rawRecords, filters), [rawRecords, filters])

  const filterLabel = useMemo(() => {
    const parts = [`${formatDate(filters.dateFrom, { year: 'numeric', month: 'long', day: 'numeric' })} to ${formatDate(filters.dateTo, { year: 'numeric', month: 'long', day: 'numeric' })}`]
    if (filters.yearLevel) parts.push(filters.yearLevel)
    if (filters.section) parts.push(filters.section)
    return parts.join(' · ')
  }, [filters])

  const handleExportCSV = async () => {
    try {
      const headers = ['Date', 'Student ID', 'Student Name', 'Section', 'Status', 'Time In', 'Time Out', 'Confidence']
      const rows = records.map(r => [
        r.class_date,
        r.student_code || '',
        `"${r.student_name}"`,
        r.section,
        r.status,
        r.check_in_time || 'N/A',
        r.check_out_time || 'N/A',
        r.confidence ? `${(r.confidence * 100).toFixed(1)}%` : 'N/A'
      ])
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `attendance_report_${filters.dateFrom}_to_${filters.dateTo}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('CSV report exported.')
    } catch (err) {
      toast.error('Failed to export CSV')
    }
  }

  const handleExportPDF = () => {
    if (records.length === 0) {
      toast.error('No records to export for the selected filters.')
      return
    }
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      toast.error('Please allow pop-ups to export the PDF.')
      return
    }

    const rows = records.map((r) => `
      <tr>
        <td>${escapeHtml(r.class_date)}</td>
        <td>${escapeHtml(r.student_code || '')}</td>
        <td>${escapeHtml(r.student_name)}</td>
        <td>${escapeHtml(r.section)}</td>
        <td>${escapeHtml(statusLabel(r.status))}</td>
        <td>${escapeHtml(r.check_in_time ? formatTime(r.check_in_time) : '—')}</td>
        <td>${escapeHtml(r.check_out_time ? formatTime(r.check_out_time) : '—')}</td>
        <td>${r.confidence != null ? escapeHtml(`${(r.confidence * 100).toFixed(1)}%`) : '—'}</td>
      </tr>`).join('')

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Attendance Report</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; margin: 24px; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    .period { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
    .meta { font-size: 11px; color: #6b7280; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: left; }
    th { background: #f3f4f6; }
    tr:nth-child(even) td { background: #f9fafb; }
    .footer { margin-top: 16px; font-size: 10px; color: #9ca3af; }
    @media print { .footer { position: fixed; bottom: 0; } }
  </style>
</head>
<body>
  <h1>SmartCCTV · Attendance Report</h1>
  <p class="period">Filtered period: ${escapeHtml(filterLabel)}</p>
  <p class="meta">Generated on ${escapeHtml(new Date().toLocaleString())} · ${records.length} record${records.length === 1 ? '' : 's'}</p>
  <table>
    <thead>
      <tr><th>Date</th><th>Student ID</th><th>Student</th><th>Section</th><th>Status</th><th>Time in</th><th>Time out</th><th>Confidence</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="footer">SmartCCTV — AI Vision &amp; Attendance System</p>
  <script>window.onload = function () { setTimeout(function () { window.focus(); window.print(); }, 300); }</script>
</body>
</html>`)
    printWindow.document.close()
  }

  return (
    <div className="space-y-6">
      <SectionScopeNotice />

      <ReportFilters filters={filters} onChange={setFilters} />

      <SummaryCards summary={summary} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={trend} loading={loading} />
        <DistributionChart
          data={{
            present: summary.total_present,
            late: summary.total_late,
            time_out: summary.total_time_out,
          }}
          loading={loading}
        />
      </div>

      <ReportTable
        records={records}
        loading={loading}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
      />
    </div>
  )
}
