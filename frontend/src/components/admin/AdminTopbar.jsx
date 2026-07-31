import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import UserMenu from '../common/UserMenu.jsx'

function AdminTopbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/60 backdrop-blur-md border-b border-white/40 shadow-glass z-20 flex items-center justify-end px-8">
      <UserMenu user={user} onLogout={handleLogout} />
    </header>
  )
}

export default AdminTopbar
