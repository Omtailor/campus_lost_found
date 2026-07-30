import AdminSidebar from './AdminSidebar.jsx'
import AdminTopbar from './AdminTopbar.jsx'

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-[260px] pt-16 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
