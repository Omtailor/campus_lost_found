import { useNavigate } from 'react-router-dom'
import { FiSearch, FiBell } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext.jsx'
import UserMenu from '../common/UserMenu.jsx'

function StudentTopbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/student/login')
  }

  return (
    <header className="fixed top-0 left-[260px] right-0 h-16 bg-white/60 backdrop-blur-md border-b border-white/40 shadow-glass z-20 flex items-center justify-between px-8">
      <div className="relative w-80">
        <FiSearch
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search lost or found items..."
          className="w-full rounded-full bg-white/70 border border-gray-200 pl-10 pr-4 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative w-9 h-9 rounded-full bg-white/70 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-colors">
          <FiBell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-status-pending text-white text-[9px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        <UserMenu user={user} onLogout={handleLogout} />
      </div>
    </header>
  )
}

export default StudentTopbar
