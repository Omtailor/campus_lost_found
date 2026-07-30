import BrowseCard from './BrowseCard.jsx'

function BrowseGrid({ reports, onReportClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {reports.map((report) => (
        <BrowseCard
          key={report.id || report.unique_code}
          {...report}
          onClick={() => onReportClick?.(report)}
        />
      ))}
    </div>
  )
}

export default BrowseGrid
