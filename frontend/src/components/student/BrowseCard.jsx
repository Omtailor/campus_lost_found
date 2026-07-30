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

function BrowseCard({ unique_code, category, report_kind, status, created_at, image_url, description, onClick }) {
  const imgSrc = buildImageUrl(image_url)
  const displayTitle = capitalize(category)
  const displayKind = report_kind === 'found' ? 'Found' : 'Lost'

  return (
    <GlassCard className="flex flex-col overflow-hidden cursor-pointer" onClick={onClick}>
      <div className="h-40 bg-background-start flex items-center justify-center overflow-hidden">
        {imgSrc ? (
          <img src={imgSrc} alt={displayTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-sm font-medium text-gray-400">{displayKind}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <StatusPill status={status} />
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary">
            {displayKind}
          </span>
        </div>
        <p className="text-xs text-gray-400 font-mono mb-1">{unique_code}</p>
        <h3 className="text-sm font-semibold text-gray-800 mb-1.5">{displayTitle}</h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
          {description || 'No description provided.'}
        </p>
        <p className="text-xs text-gray-400 mt-auto">{getRelativeTime(created_at)}</p>
      </div>
    </GlassCard>
  )
}

export default BrowseCard
