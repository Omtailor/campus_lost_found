import { useState, useEffect } from 'react'
import { FiX, FiImage } from 'react-icons/fi'
import { buildImageUrl } from '../common/ItemImage.jsx'

function ImageLightbox({ imageUrl, alt, onClose }) {
  const [failedSrc, setFailedSrc] = useState(null)

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
      {fullUrl && failedSrc !== fullUrl ? (
        <img
          src={fullUrl}
          alt={alt || 'Report image'}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
          onError={() => setFailedSrc(fullUrl)}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-white">
          <FiImage size={36} className="text-white/70" />
          <span className="text-lg">No image available</span>
        </div>
      )}
    </div>
  )
}

export default ImageLightbox
