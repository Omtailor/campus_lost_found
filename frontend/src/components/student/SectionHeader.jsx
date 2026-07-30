import Button from '../ui/Button.jsx'

function SectionHeader({ title, showViewAll = false, onViewAll }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {showViewAll && (
        <Button variant="outline" onClick={onViewAll}>
          View All
        </Button>
      )}
    </div>
  )
}

export default SectionHeader
