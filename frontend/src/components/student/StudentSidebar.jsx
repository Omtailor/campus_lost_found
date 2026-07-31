import { NavLink } from 'react-router-dom'
import {
  FiGrid,
  FiSearch,
  FiFileText,
} from 'react-icons/fi'

const navItems = [
  { to: '/student/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/student/browse', icon: FiSearch, label: 'Browse Items' },
  { to: '/student/my-reports', icon: FiFileText, label: 'My Reports' },
]

function StudentSidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-white/80 backdrop-blur-xl border-r border-white/40 shadow-glass flex flex-col z-30">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/30">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">
          LF
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800 leading-tight">Lost & Found</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Campus Portal</p>
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
    </aside>
  )
}

export default StudentSidebar
