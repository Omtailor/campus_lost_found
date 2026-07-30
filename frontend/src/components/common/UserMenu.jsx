import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FiLogOut, FiChevronDown } from 'react-icons/fi'

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const roleBadgeConfig = {
  student: { label: 'Student', classes: 'bg-blue-100 text-blue-700' },
  admin: { label: 'Administrator', classes: 'bg-purple-100 text-purple-700' },
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const [animating, setAnimating] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
      if (e.key === 'Tab') {
        const focusable = menuRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setAnimating(true))
    } else {
      setAnimating(false)
    }
  }, [open])

  function toggle() {
    setOpen((prev) => !prev)
  }

  function handleLogout() {
    onLogout()
  }

  const badge = roleBadgeConfig[user?.role] || roleBadgeConfig.student

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
        className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-gray-100/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{
              background: `linear-gradient(135deg, #3b82f6, #8b5cf6)`,
            }}
            aria-hidden="true"
          >
            {getInitials(user?.name)}
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-[11px] text-gray-400">
              {user?.role === 'admin' ? 'Administrator' : 'Student'}
            </p>
          </div>
          <FiChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="User options"
          className={`absolute right-0 top-full mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden ${
            animating
              ? 'animate-user-menu-enter opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-2 scale-95'
          }`}
          style={{
            transformOrigin: 'top right',
          }}
        >
          <div className="p-5 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
              style={{
                background: `linear-gradient(135deg, #3b82f6, #8b5cf6)`,
              }}
              aria-hidden="true"
            >
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
              {user?.role === 'student' && user?.roll_no && (
                <p className="text-xs text-gray-400 truncate">Roll: {user.roll_no}</p>
              )}
            </div>
          </div>

          <div className="px-5 pb-3">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.classes}`}
            >
              {badge.label}
            </span>
          </div>

          <div className="border-t border-gray-100" />

          <button
            role="menuitem"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:bg-red-50"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
