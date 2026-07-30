import StudentSidebar from '../student/StudentSidebar.jsx'
import StudentTopbar from '../student/StudentTopbar.jsx'

function StudentLayout({ children }) {
  return (
    <div className="min-h-screen">
      <StudentSidebar />
      <StudentTopbar />
      <main className="ml-[260px] pt-16 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default StudentLayout
