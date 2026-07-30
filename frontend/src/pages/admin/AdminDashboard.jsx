import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFileText, FiClock, FiCheckCircle, FiUsers } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import StatsCard from '../../components/admin/StatsCard.jsx'
import FilterTabs from '../../components/admin/FilterTabs.jsx'
import ReportsTable from '../../components/admin/ReportsTable.jsx'
import Toast from '../../components/admin/Toast.jsx'
import GlassCard from '../../components/ui/GlassCard.jsx'
import Button from '../../components/ui/Button.jsx'
import SectionHeader from '../../components/student/SectionHeader.jsx'
import useAdminDashboardStats from '../../hooks/useAdminDashboardStats.js'
import useAdminReports from '../../hooks/useAdminReports.js'
import { resolveReport } from '../../services/reportService.js'

const STAT_CARDS = [
  { key: 'totalReports', title: 'Total Reports', icon: FiFileText },
  { key: 'pendingReports', title: 'Pending Reports', icon: FiClock },
  { key: 'resolvedThisWeek', title: 'Resolved This Week', icon: FiCheckCircle },
  { key: 'totalStudents', title: 'Total Students', icon: FiUsers },
]

const LIMIT_OPTIONS = [10, 20, 50, 100]

function paramsToTab(searchParams) {
  if (searchParams.get('status') === 'pending') return 'pending'
  if (searchParams.get('status') === 'resolved') return 'resolved'
  if (searchParams.get('type') === 'lost') return 'lost'
  if (searchParams.get('type') === 'found') return 'found'
  return 'all'
}

function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [toast, setToast] = useState(null)
  const [optimisticResolvedIds, setOptimisticResolvedIds] = useState(new Set())
  const debounceRef = useRef(null)

  const activeTab = paramsToTab(searchParams)
  const page = parseInt(searchParams.get('page'), 10) || 1
  const limit = parseInt(searchParams.get('limit'), 10) || 20
  const urlSearch = searchParams.get('search') || ''
  const [searchInput, setSearchInput] = useState(urlSearch)

  const { stats, loading: statsLoading, error: statsError, refresh: refreshStats } = useAdminDashboardStats()

  const reportParams = useMemo(() => {
    const params = { limit, offset: (page - 1) * limit }
    const tab = activeTab
    if (tab === 'lost' || tab === 'found') params.report_kind = tab
    else if (tab === 'pending' || tab === 'resolved') params.status = tab
    if (urlSearch) params.search = urlSearch
    return params
  }, [activeTab, page, limit, urlSearch])

  const { reports: fetchedReports, total, loading: reportsLoading, error: reportsError, refresh: refreshReports } = useAdminReports(reportParams)

  const displayReports = useMemo(() => {
    if (optimisticResolvedIds.size === 0) return fetchedReports
    return fetchedReports.map((r) => {
      const key = r.id || r.unique_code
      return optimisticResolvedIds.has(key) ? { ...r, status: 'resolved' } : r
    })
  }, [fetchedReports, optimisticResolvedIds])

  function updateParams(updates) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '' || value === 'all') {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      })
      return next
    }, { replace: true })
  }

  function showToast(type, message) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  function handleTabChange(tab) {
    const clear = {}
    if (tab === 'all') {
      clear.status = null
      clear.type = null
    } else if (tab === 'lost' || tab === 'found') {
      clear.status = null
      clear.type = tab
    } else {
      clear.type = null
      clear.status = tab
    }
    clear.page = null
    updateParams(clear)
  }

  function handleSearchInput(e) {
    const value = e.target.value
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParams({ search: value || null, page: null })
    }, 300)
  }

  function handlePageChange(newPage) {
    updateParams({ page: newPage > 1 ? newPage : null })
  }

  function handleLimitChange(e) {
    const newLimit = parseInt(e.target.value, 10)
    updateParams({ limit: newLimit !== 20 ? newLimit : null, page: null })
  }

  const handleResolve = useCallback(async (reportId) => {
    const key = reportId
    setOptimisticResolvedIds((prev) => {
      const next = new Set(prev)
      next.add(key)
      return next
    })

    try {
      await resolveReport(reportId)
      refreshStats()
      showToast('success', 'Report resolved successfully.')
    } catch (err) {
      setOptimisticResolvedIds((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to resolve report.'
      showToast('error', message)
    }
  }, [refreshStats])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <AdminLayout>
      <section>
        <SectionHeader title="Dashboard" />

        {statsError ? (
          <GlassCard className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl2 mb-6">
            <p className="text-sm text-gray-500">{statsError}</p>
            <Button variant="outline" onClick={refreshStats}>
              Retry
            </Button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {STAT_CARDS.map((card) => (
              <StatsCard
                key={card.key}
                title={card.title}
                value={stats[card.key]}
                icon={card.icon}
                loading={statsLoading}
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <FilterTabs activeTab={activeTab} onTabChange={handleTabChange} />
          <div className="relative w-72 ml-auto">
            <input
              type="text"
              placeholder="Search unique code, description, student..."
              value={searchInput}
              onChange={handleSearchInput}
              className="w-full rounded-xl bg-white/70 border border-gray-200 pl-4 pr-4 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>
        </div>

        <ReportsTable
          reports={displayReports}
          total={total}
          page={page}
          limit={limit}
          loading={reportsLoading}
          error={reportsError}
          onRetry={refreshReports}
          onResolve={handleResolve}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          totalPages={totalPages}
        />
      </section>

      <Toast type={toast?.type} message={toast?.message} />
    </AdminLayout>
  )
}

export default AdminDashboard
