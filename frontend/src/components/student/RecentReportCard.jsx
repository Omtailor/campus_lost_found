import { FiArrowRight } from 'react-icons/fi'
import GlassCard from '../ui/GlassCard.jsx'
import StatusPill from '../ui/StatusPill.jsx'
import ItemImage from '../common/ItemImage.jsx'

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getRelativeTime(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function RecentReportCard({ unique_code, category, report_kind, status, created_at, image_url, handover_note, onClick }) {
  const displayTitle = capitalize(category)

  return (
    <GlassCard className="flex-shrink-0 flex items-center gap-3 p-3 w-56 cursor-pointer" onClick={onClick}>
      <ItemImage
        imageUrl={image_url}
        alt={displayTitle}
        category={category}
        className="w-12 h-12 rounded-lg flex-shrink-0"
        compact
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          <StatusPill status={status} />
          {report_kind === 'found' && handover_note && (
            <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium bg-status-resolved-bg text-status-resolved">
              Handed
            </span>
          )}
        </div>
        <p className="text-[10px] text-gray-400 font-mono">{unique_code}</p>
        <h3 className="text-xs font-semibold text-gray-800 truncate">{displayTitle}</h3>
        <p className="text-[10px] text-gray-400 mt-0.5">{getRelativeTime(created_at)}</p>
      </div>
      <button className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
        <FiArrowRight size={12} />
      </button>
    </GlassCard>
  )
}

export default RecentReportCard
