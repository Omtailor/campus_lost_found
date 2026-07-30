import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function Input({ label, error, className = '', id, type, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const isPassword = type === 'password'
  const [visible, setVisible] = useState(false)
  const actualType = isPassword && visible ? 'text' : type

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={actualType}
          className={`rounded-lg border border-gray-200 bg-white/80 px-4 py-2.5 text-sm outline-none transition-colors duration-150 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 w-full ${error ? 'border-error' : ''} ${isPassword ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

export default Input
