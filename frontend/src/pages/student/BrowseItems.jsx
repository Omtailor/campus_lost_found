import { useState, useMemo, useEffect } from 'react'
import ReportDetailsModal from '../../components/student/ReportDetailsModal.jsx'
import { useSearchParams } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import StudentLayout from '../../components/layouts/StudentLayout.jsx'
import BrowseFilters from '../../components/student/BrowseFilters.jsx'
import BrowseGrid from '../../components/student/BrowseGrid.jsx'
import GlassCard from '../../components/ui/GlassCard.jsx'
import Button from '../../components/ui/Button.jsx'
import SectionHeader from '../../components/student/SectionHeader.jsx'
import usePublicReports from '../../hooks/usePublicReports.js'

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="rounded-xl2 bg-white/70 backdrop-blur-md border border-white/40 shadow-glass animate-pulse overflow-hidden">
          <div className="h-40 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <div className="h-3 w-14 bg-gray-200 rounded-full" />
              <div className="h-3 w-10 bg-gray-200 rounded-full" />
            </div>
            <div className="h-2.5 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-gray-200 rounded" />
              <div className="h-2 w-3/4 bg-gray-200 rounded" />
            </div>
            <div className="h-2 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

function BrowseItems() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedReport, setSelectedReport] = useState(null)

  const { reports, loading, error, refresh } = usePublicReports({ limit: 100 })

  const typeFilter = searchParams.get('type') || 'all'
  const categoryFilter = searchParams.get('category') || 'all'
  const query = searchParams.get('search') || ''
  const [searchInput, setSearchInput] = useState(query)
  const [debouncedSearch, setDebouncedSearch] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const filteredReports = useMemo(() => {
    let filtered = reports

    if (typeFilter !== 'all') {
      filtered = filtered.filter((r) => r.report_kind === typeFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((r) => r.category === categoryFilter)
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      filtered = filtered.filter((r) => {
        return (
          (r.category && r.category.toLowerCase().includes(q)) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.unique_code && r.unique_code.toLowerCase().includes(q))
        )
      })
    }

    return filtered
  }, [reports, typeFilter, categoryFilter, debouncedSearch])

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams)
    if (value === 'all' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    setSearchParams(params, { replace: true })
  }

  function handleTypeChange(type) {
    updateParam('type', type)
  }

  function handleCategoryChange(category) {
    updateParam('category', category)
  }

  return (
    <StudentLayout>
      <section>
        <SectionHeader title="Browse Items" />

        {/* Search */}
        <div className="relative mb-5">
          <FiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search category, description, or unique code..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl bg-white/70 border border-gray-200 pl-11 pr-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <BrowseFilters
            typeFilter={typeFilter}
            categoryFilter={categoryFilter}
            onTypeChange={handleTypeChange}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Content */}
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
          <GlassCard className="flex flex-col items-center justify-center gap-2 p-10 rounded-xl2">
            <p className="text-sm font-medium text-gray-500">
              {debouncedSearch || typeFilter !== 'all' || categoryFilter !== 'all'
                ? 'No matching reports'
                : 'No reports found'}
            </p>
            <p className="text-xs text-gray-400">Try changing your search or filters.</p>
          </GlassCard>
        ) : (
          <BrowseGrid reports={filteredReports} onReportClick={setSelectedReport} />
        )}
      </section>

      <ReportDetailsModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </StudentLayout>
  )
}

export default BrowseItems
