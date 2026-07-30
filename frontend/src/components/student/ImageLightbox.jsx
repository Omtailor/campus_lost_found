import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

const API_BASE = import.meta.env.VITE_API_URL.replace(/\/+$/, '')

function buildImageUrl(imageUrl) {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  return `${API_BASE}${imageUrl}`
}

function ImageLightbox({ imageUrl, alt, onClose }) {
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const fullUrl = buildImageUrl(imageUrl)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Close lightbox"
      >
        <FiX size={22} />
      </button>
      {fullUrl ? (
        <img
          src={fullUrl}
          alt={alt || 'Report image'}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="text-white text-lg">No image available</div>
      )}
    </div>
  )
}

export default ImageLightbox
