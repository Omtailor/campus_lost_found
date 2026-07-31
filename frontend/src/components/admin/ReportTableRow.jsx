import { useState, memo } from 'react'
import { FiCheck } from 'react-icons/fi'
import StatusPill from '../ui/StatusPill.jsx'
import ImageLightbox from '../student/ImageLightbox.jsx'
import ItemImage from '../common/ItemImage.jsx'
import Button from '../ui/Button.jsx'
import ResolveDialog from './ResolveDialog.jsx'

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const ReportTableRow = memo(function ReportTableRow({ report, onResolve }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [resolving, setResolving] = useState(false)
  const displayKind = report.report_kind === 'found' ? 'Found' : 'Lost'

  async function handleConfirm() {
    setResolving(true)
    setDialogOpen(false)
    if (onResolve) {
      await onResolve(report.id || report.unique_code)
    }
    setResolving(false)
  }

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-white/50 transition-colors">
        {/* Photo */}
        <td className="px-3 py-3">
          <ItemImage
            imageUrl={report.image_url}
            alt={report.unique_code}
            category={report.category}
            className="w-12 h-12 rounded-lg"
            imgClassName="w-full h-full object-cover rounded-lg cursor-pointer"
            compact
            onClick={() => setLightboxOpen(true)}
          />
        </td>

        {/* Unique ID */}
        <td className="px-3 py-3">
          <span className="text-sm text-gray-400 font-mono">{report.unique_code}</span>
        </td>

        {/* Item Type */}
        <td className="px-3 py-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            report.report_kind === 'found'
              ? 'bg-status-resolved-bg text-status-resolved'
              : 'bg-status-pending-bg text-status-pending'
          }`}>
            {displayKind}
          </span>
        </td>

        {/* Category */}
        <td className="px-3 py-3">
          <span className="text-sm text-gray-800 font-medium">{capitalize(report.category)}</span>
        </td>

        {/* Description */}
        <td className="px-3 py-3 max-w-[200px]">
          <p className="text-sm text-gray-600 line-clamp-2">{report.description || '—'}</p>
          {report.report_kind === 'found' && report.handover_note && (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-status-resolved-bg text-status-resolved mt-1">
              Handed to Admin
            </span>
          )}
        </td>

        {/* Reported By */}
        <td className="px-3 py-3">
          <p className="text-sm text-gray-800 font-medium">
            {report.reporter_name || 'Unknown'}
          </p>
          <p className="text-xs text-gray-400">
            {report.reporter_roll_no ? `— ${report.reporter_roll_no}` : ''}
          </p>
        </td>

        {/* Date & Time */}
        <td className="px-3 py-3">
          <p className="text-sm text-gray-700">{formatDate(report.created_at)}</p>
          <p className="text-xs text-gray-400">{formatTime(report.created_at)}</p>
        </td>

        {/* Status */}
        <td className="px-3 py-3">
          <StatusPill status={report.status} />
        </td>

        {/* Action */}
        <td className="px-3 py-3">
          {report.status === 'resolved' ? (
            <Button disabled className="text-xs px-3 py-1.5 flex items-center gap-1.5">
              <FiCheck size={14} />
              Resolved
            </Button>
          ) : resolving ? (
            <Button disabled className="text-xs px-3 py-1.5">
              Resolving...
            </Button>
          ) : (
            <Button onClick={() => setDialogOpen(true)} className="text-xs px-3 py-1.5">
              Resolve
            </Button>
          )}
        </td>
      </tr>

      {lightboxOpen && report.image_url && (
        <ImageLightbox
          imageUrl={report.image_url}
          alt={report.unique_code}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <ResolveDialog
        isOpen={dialogOpen}
        report={report}
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  )
})

export default ReportTableRow
