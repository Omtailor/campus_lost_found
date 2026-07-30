import { useMemo } from 'react'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import GlassCard from '../ui/GlassCard.jsx'
import Button from '../ui/Button.jsx'
import TableSkeleton from './TableSkeleton.jsx'
import EmptyReports from './EmptyReports.jsx'
import ReportTableRow from './ReportTableRow.jsx'

function Pagination({ page, totalPages, total, limit, onPageChange, onLimitChange }) {
  const pageNumbers = useMemo(() => {
    const delta = 2
    const range = []
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i)
    }
    if (totalPages > 2 && range[0] > 2) range.unshift('...')
    if (totalPages > 2 && range[range.length - 1] < totalPages - 1) range.push('...')
    range.unshift(1)
    if (totalPages > 1) range.push(totalPages)
    return range
  }, [page, totalPages])

  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-3 py-3.5 border-t border-gray-100">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          Showing {from}–{to} of {total} reports
        </span>
        <select
          value={limit}
          onChange={onLimitChange}
          className="rounded-lg border border-gray-200 bg-white/80 px-2 py-1.5 text-sm outline-none focus:border-primary"
          aria-label="Rows per page"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
        >
          <FiChevronsLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <FiChevronLeft size={16} />
        </button>

        {pageNumbers.map((num, i) =>
          num === '...' ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                num === page
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={`Page ${num}`}
              aria-current={num === page ? 'page' : undefined}
            >
              {num}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <FiChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Last page"
        >
          <FiChevronsRight size={16} />
        </button>
      </div>
    </div>
  )
}

const COLUMNS = ['Photo', 'Unique ID', 'Item Type', 'Category', 'Description', 'Reported By', 'Date & Time', 'Status', 'Action']

function ReportsTable({ reports, total, page, limit, loading, error, onRetry, onResolve, onPageChange, onLimitChange, totalPages }) {
  if (loading) {
    return (
      <GlassCard className="overflow-hidden rounded-xl2">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-white/50">
                {COLUMNS.map((col) => (
                  <th key={col} className="px-3 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <TableSkeleton />
          </table>
        </div>
      </GlassCard>
    )
  }

  if (error) {
    return (
      <GlassCard className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl2">
        <p className="text-sm text-gray-500">{error}</p>
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </GlassCard>
    )
  }

  if (reports.length === 0) {
    return (
      <GlassCard className="flex flex-col items-center justify-center gap-2 p-10 rounded-xl2">
        <p className="text-sm font-medium text-gray-500">No matching reports</p>
        <p className="text-xs text-gray-400">Try changing your search or filters.</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="overflow-hidden rounded-xl2">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-white/50">
              {COLUMNS.map((col) => (
                <th key={col} className="px-3 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <ReportTableRow key={report.id || report.unique_code} report={report} onResolve={onResolve} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </GlassCard>
  )
}

export default ReportsTable
