import { useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'
import Button from '../ui/Button.jsx'

function ResolveDialog({ isOpen, report, onConfirm, onCancel }) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      setTimeout(() => dialogRef.current?.focus(), 50)
    } else {
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onCancel()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onCancel])

  if (!isOpen || !report) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Resolve report confirmation"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-glass max-w-md w-full p-6 transition-all duration-200"
      >
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white shadow-sm transition-colors"
          aria-label="Close dialog"
        >
          <FiX size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-3">Resolve Report?</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          You are about to mark report{' '}
          <span className="font-mono text-gray-700 font-medium">{report.unique_code}</span>{' '}
          as resolved. This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Resolve
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResolveDialog
