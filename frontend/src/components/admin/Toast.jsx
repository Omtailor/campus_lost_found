import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

function Toast({ type, message }) {
  if (!message) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[slideUp_300ms_ease]">
      <div
        className={`flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
          type === 'success'
            ? 'bg-status-resolved text-white'
            : 'bg-error text-white'
        }`}
      >
        {type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Toast
