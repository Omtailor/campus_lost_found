import AdminTopbar from './AdminTopbar.jsx'

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen">
      <AdminTopbar />
      <main className="pt-16 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
