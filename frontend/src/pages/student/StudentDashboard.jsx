import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentLayout from '../../components/layouts/StudentLayout.jsx'
import SectionHeader from '../../components/student/SectionHeader.jsx'
import ReportItemForm from '../../components/student/ReportItemForm.jsx'
import RecentReportCard from '../../components/student/RecentReportCard.jsx'
import ReportDetailsModal from '../../components/student/ReportDetailsModal.jsx'
import GlassCard from '../../components/ui/GlassCard.jsx'
import Button from '../../components/ui/Button.jsx'
import usePublicReports from '../../hooks/usePublicReports.js'
import { useAuth } from '../../context/AuthContext.jsx'

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 p-3 w-56 rounded-xl2 bg-white/70 backdrop-blur-md border border-white/40 shadow-glass animate-pulse">
      <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2.5 w-14 bg-gray-200 rounded-full" />
        <div className="h-2 w-20 bg-gray-200 rounded" />
        <div className="h-2.5 w-16 bg-gray-200 rounded" />
      </div>
      <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
    </div>
  )
}

function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedReport, setSelectedReport] = useState(null)
  const { reports: publicReports, loading: publicLoading, error: publicError, refresh: refreshPublic } = usePublicReports({ status: 'pending', limit: 20 })

  const filteredPublicReports = useMemo(() => {
    if (!user) return publicReports
    const userId = user.id || user.student_id
    if (!userId) return publicReports
    return publicReports.filter((r) => r.student_id !== userId)
  }, [publicReports, user])

  return (
    <StudentLayout>
      <section className="mb-10">
        <SectionHeader title="Report New Item" />
        <ReportItemForm onSuccess={refreshPublic} />
      </section>

      <section>
        <SectionHeader title="Recently Reported By Others" showViewAll onViewAll={() => navigate('/student/browse')} />
        {publicLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : publicError ? (
          <GlassCard className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl2">
            <p className="text-sm text-gray-500">{publicError}</p>
            <Button variant="outline" onClick={refreshPublic}>Retry</Button>
          </GlassCard>
        ) : filteredPublicReports.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl2">
            <p className="text-sm font-medium text-gray-500">No recent reports</p>
            <p className="text-xs text-gray-400">Be the first student to report an item.</p>
          </GlassCard>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
            {filteredPublicReports.map((report) => (
              <RecentReportCard key={report.id || report.unique_code} {...report} onClick={() => setSelectedReport(report)} />
            ))}
          </div>
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

export default StudentDashboard
