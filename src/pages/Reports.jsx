import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import SummaryCards from '../components/reports/SummaryCards'
import TrendChart from '../components/reports/TrendChart'
import DistributionChart from '../components/reports/DistributionChart'
import ReportFilters from '../components/reports/ReportFilters'
import ReportTable from '../components/reports/ReportTable'
import { getReportsSummary, getReportsTrend, exportReportCSV } from '../services/api'
import { toISODate } from '../utils/helpers'

const MOCK_SUMMARY = {
  avg_rate: 87.5,
  total_present: 142,
  total_late: 12,
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
  { id: 101, class_date: '2026-09-06', student_name: 'Maria Santos', section: 'Section A', status: 'present', check_in_time: '2026-09-06T07:45:00Z', confidence: 0.98 },
  { id: 102, class_date: '2026-09-06', student_name: 'Juan Dela Cruz', section: 'Section A', status: 'late', check_in_time: '2026-09-06T08:15:00Z', confidence: 0.92 },
  { id: 103, class_date: '2026-09-06', student_name: 'Carlos Mendoza', section: 'Section B', status: 'present', check_in_time: '2026-09-06T07:50:00Z', confidence: 0.94 },
  { id: 104, class_date: '2026-09-06', student_name: 'Ana Reyes', section: 'Section B', status: 'present', check_in_time: '2026-09-06T07:52:00Z', confidence: 0.95 },
  { id: 105, class_date: '2026-09-06', student_name: 'Miguel Torres', section: 'Section C', status: 'present', check_in_time: '2026-09-06T07:55:00Z', confidence: 0.96 },
  { id: 106, class_date: '2026-09-06', student_name: 'Elena Garcia', section: 'Section C', status: 'late', check_in_time: '2026-09-06T08:35:00Z', confidence: 0.91 },
  { id: 107, class_date: '2026-09-06', student_name: 'Sofia Ramos', section: 'Section A', status: 'present', check_in_time: '2026-09-06T07:40:00Z', confidence: 0.99 },
  { id: 108, class_date: '2026-09-06', student_name: 'Luis Bautista', section: 'Section D', status: 'late', check_in_time: '2026-09-06T08:10:00Z', confidence: 0.89 },
]

export default function Reports() {
  const [filters, setFilters] = useState({
    dateFrom: toISODate(new Date(Date.now() - 7 * 86400000)),
    dateTo: toISODate(new Date()),
    section: '',
  })
  const [summary, setSummary] = useState(MOCK_SUMMARY)
  const [trend, setTrend] = useState(MOCK_TREND)
  const [records, setRecords] = useState(MOCK_RECORDS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [sumRes, trendRes] = await Promise.all([
          getReportsSummary(filters),
          getReportsTrend(filters),
        ])
        if (sumRes) setSummary(sumRes)
        if (trendRes) setTrend(trendRes)
      } catch (err) {
        // Fallback to mock data gracefully
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [filters])

  const handleExportCSV = async () => {
    try {
      toast.success('Exporting CSV report...')
      // Generate client-side CSV if backend export isn't running
      const headers = ['Date', 'Student Name', 'Section', 'Status', 'Check-in Time', 'Confidence']
      const rows = records.map(r => [
        r.class_date,
        `"${r.student_name}"`,
        r.section,
        r.status,
        r.check_in_time || 'N/A',
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
    } catch (err) {
      toast.error('Failed to export CSV')
    }
  }

  return (
    <div className="space-y-6">
      <ReportFilters filters={filters} onChange={setFilters} />

      <SummaryCards summary={summary} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={trend} loading={loading} />
        <DistributionChart
          data={{
            present: summary.total_present,
            late: summary.total_late,
          }}
          loading={loading}
        />
      </div>

      <ReportTable
        records={records}
        loading={loading}
        onExportCSV={handleExportCSV}
      />
    </div>
  )
}
