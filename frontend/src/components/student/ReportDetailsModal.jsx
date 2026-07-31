import { useState, useEffect, useRef } from 'react'
import { FiX, FiCopy, FiCheck } from 'react-icons/fi'
import GlassCard from '../ui/GlassCard.jsx'
import StatusPill from '../ui/StatusPill.jsx'
import ItemImage from '../common/ItemImage.jsx'
import ImageLightbox from './ImageLightbox.jsx'

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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

function ReportDetailsModal({ report, isOpen, onClose, showReportedBy = true }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      document.body.style.overflow = 'hidden'
      setTimeout(() => modalRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false)
        } else {
          onClose()
        }
      }
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose, lightboxOpen])

  if (!isOpen || !report) return null

  const displayTitle = capitalize(report.category)
  const displayKind = report.report_kind === 'found' ? 'Found' : 'Lost'

  function handleCopy() {
    navigator.clipboard.writeText(report.unique_code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Report details"
          onClick={(e) => e.stopPropagation()}
          className={`relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-glass max-w-lg w-full max-h-[90vh] overflow-y-auto transition-all duration-200 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white shadow-sm transition-colors"
            aria-label="Close modal"
          >
            <FiX size={18} />
          </button>

          {/* Image */}
          <ItemImage
            imageUrl={report.image_url}
            alt={displayTitle}
            category={report.category}
            className="h-56 w-full"
            imgClassName="w-full h-full object-cover cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          />

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Badges row */}
            <div className="flex items-center gap-2">
              <StatusPill status={report.status} />
              <span className="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                {displayKind}
              </span>
            </div>

            {/* Unique Code + Copy */}
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400 font-mono">{report.unique_code}</p>
              <button
                onClick={handleCopy}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Copy unique code"
              >
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
              </button>
              {copied && (
                <span className="text-xs text-status-resolved font-medium">Copied!</span>
              )}
            </div>

            {/* Title and date */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{displayTitle}</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-400">{formatDate(report.created_at)}</p>
                <span className="text-gray-300">·</span>
                <p className="text-sm text-gray-400">{getRelativeTime(report.created_at)}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1.5">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {report.description || 'No description provided.'}
              </p>
            </div>

            {/* Reported by */}
            {showReportedBy && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1.5">Reported by</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {report.reporter_name
                    ? `${report.reporter_name}${report.reporter_roll_no ? ` (${report.reporter_roll_no})` : ''}`
                    : 'Anonymous'}
                </p>
              </div>
            )}

            {/* Handover note */}
            {report.report_kind === 'found' && report.handover_note && (
              <GlassCard className="p-4 rounded-xl bg-status-resolved-bg/30 border-status-resolved/30">
                <h3 className="text-sm font-medium text-status-resolved mb-1">Handover Note</h3>
                <p className="text-sm text-gray-600">{report.handover_note}</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          imageUrl={report.image_url}
          alt={displayTitle}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}

export default ReportDetailsModal
