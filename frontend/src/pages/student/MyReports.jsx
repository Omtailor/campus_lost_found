import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import StudentLayout from '../../components/layouts/StudentLayout.jsx'
import ReportCard from '../../components/student/ReportCard.jsx'
import ReportDetailsModal from '../../components/student/ReportDetailsModal.jsx'
import GlassCard from '../../components/ui/GlassCard.jsx'
import Button from '../../components/ui/Button.jsx'
import useMyReports from '../../hooks/useMyReports.js'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'lost', label: 'Lost' },
  { key: 'found', label: 'Found' },
  { key: 'pending', label: 'Pending' },
  { key: 'resolved', label: 'Resolved' },
]

function SkeletonGrid() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex-shrink-0 flex items-center gap-4 p-4 w-72 rounded-xl2 bg-white/70 backdrop-blur-md border border-white/40 shadow-glass animate-pulse"
        >
          <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded-full" />
            <div className="h-2.5 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

function MyReports() {
  const navigate = useNavigate()
  const location = useLocation()
  const { reports, loading, error, refresh } = useMyReports()
  const [activeTab, setActiveTab] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const debounceRef = useRef(null)
  const hasRefreshed = useRef(false)

  useEffect(() => {
    if (location.state?.refresh && !hasRefreshed.current) {
      hasRefreshed.current = true
      refresh()
    }
  }, [location.state?.refresh, refresh])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchInput])

  const filteredReports = useMemo(() => {
    let filtered = reports

    if (activeTab === 'lost') {
      filtered = filtered.filter((r) => r.report_kind === 'lost')
    } else if (activeTab === 'found') {
      filtered = filtered.filter((r) => r.report_kind === 'found')
    } else if (activeTab === 'pending') {
      filtered = filtered.filter((r) => r.status === 'pending')
    } else if (activeTab === 'resolved') {
      filtered = filtered.filter((r) => r.status === 'resolved')
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      filtered = filtered.filter((r) => {
        return (
          (r.unique_code && r.unique_code.toLowerCase().includes(q)) ||
          (r.category && r.category.toLowerCase().includes(q)) ||
          (r.description && r.description.toLowerCase().includes(q))
        )
      })
    }

    return filtered
  }, [reports, activeTab, debouncedSearch])

  return (
    <StudentLayout>
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800">My Reports</h2>
        </div>

        <div className="relative mb-5">
          <FiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by unique code, category, or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl bg-white/70 border border-gray-200 pl-11 pr-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <div className="flex rounded-xl bg-gray-100 p-1 mb-6 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <GlassCard className="flex flex-col items-center justify-center gap-3 p-10 rounded-xl2">
            <p className="text-sm text-gray-500">{error}</p>
            <Button variant="outline" onClick={refresh}>
              Retry
            </Button>
          </GlassCard>
        ) : filteredReports.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center gap-3 p-10 rounded-xl2">
            <p className="text-sm font-medium text-gray-500">
              {debouncedSearch || activeTab !== 'all'
                ? 'No matching reports'
                : 'No reports yet'}
            </p>
            <p className="text-xs text-gray-400">
              {debouncedSearch || activeTab !== 'all'
                ? 'Try changing your search or filter.'
                : 'Submit your first Lost or Found report.'}
            </p>
            {!debouncedSearch && activeTab === 'all' && (
              <Button variant="outline" onClick={() => navigate('/student/dashboard')}>
                Go to Dashboard
              </Button>
            )}
          </GlassCard>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id || report.unique_code}
                {...report}
                onClick={() => setSelectedReport(report)}
              />
            ))}
          </div>
        )}
      </section>

      <ReportDetailsModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        showReportedBy={false}
      />
    </StudentLayout>
  )
}

export default MyReports
