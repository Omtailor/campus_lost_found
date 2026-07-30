import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiGrid,
  FiList,
  FiCheckCircle,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiShield,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/reports', icon: FiList, label: 'All Reports' },
  { to: '/admin/resolved', icon: FiCheckCircle, label: 'Resolved Reports' },
  { to: '/admin/students', icon: FiUsers, label: 'Students' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
]

function AdminSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-white/80 backdrop-blur-xl border-r border-white/40 shadow-glass flex flex-col z-30">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/30">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">
          LF
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800 leading-tight">Lost & Found</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-4 py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-6 space-y-3">
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
            <FiShield size={16} className="text-primary" />
          </div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Admin Access</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Manage reports, students, and system settings.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-error/10 hover:text-error transition-colors duration-150"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
