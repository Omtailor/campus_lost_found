const STATUS_MAP = {
  pending: { label: 'Pending', textColor: 'text-status-pending', bgColor: 'bg-status-pending-bg' },
  resolved: { label: 'Resolved', textColor: 'text-status-resolved', bgColor: 'bg-status-resolved-bg' },
}

function StatusPill({ status }) {
  const config = STATUS_MAP[status]
  if (!config) return null

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {config.label}
    </span>
  )
}

export default StatusPill
