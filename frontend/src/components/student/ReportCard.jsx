import { FiArrowRight } from 'react-icons/fi'
import GlassCard from '../ui/GlassCard.jsx'
import StatusPill from '../ui/StatusPill.jsx'

const API_BASE = import.meta.env.VITE_API_URL.replace(/\/+$/, '')

function buildImageUrl(imageUrl) {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  return `${API_BASE}${imageUrl}`
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ReportCard({ unique_code, category, report_kind, status, created_at, image_url, handover_note, onClick }) {
  const imgSrc = buildImageUrl(image_url)
  const displayTitle = capitalize(category)
  const displayKind = report_kind === 'found' ? 'Found' : 'Lost'

  return (
    <GlassCard className="flex-shrink-0 flex items-center gap-4 p-4 w-72 cursor-pointer" onClick={onClick}>
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-background-start flex items-center justify-center">
        {imgSrc ? (
          <img src={imgSrc} alt={displayTitle} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400 font-medium">{displayKind}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <StatusPill status={status} />
          {report_kind === 'found' && handover_note && (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-status-resolved-bg text-status-resolved">
              Handed to Admin
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 font-mono">{unique_code}</p>
        <h3 className="text-sm font-semibold text-gray-800 truncate">{displayTitle}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(created_at)}</p>
      </div>
      <button className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
        <FiArrowRight size={16} />
      </button>
    </GlassCard>
  )
}

export default ReportCard
