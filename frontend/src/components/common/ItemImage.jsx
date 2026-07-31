import { useState } from 'react'
import {
  FiImage,
  FiMonitor,
  FiFileText,
  FiShoppingBag,
  FiWatch,
  FiBriefcase,
  FiBook,
  FiKey,
} from 'react-icons/fi'

const API_BASE = import.meta.env.VITE_API_URL.replace(/\/+$/, '')

export function buildImageUrl(imageUrl) {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  if (imageUrl.startsWith('/uploads/')) return `${API_BASE}${imageUrl}`
  return `${API_BASE}/uploads/${imageUrl}`
}

const CATEGORY_ICONS = {
  electronics: FiMonitor,
  documents: FiFileText,
  clothing: FiShoppingBag,
  accessories: FiWatch,
  bags: FiBriefcase,
  books: FiBook,
  keys: FiKey,
  other: FiImage,
}

function ItemImage({
  imageUrl,
  alt = 'Item image',
  category,
  className = '',
  imgClassName = 'w-full h-full object-cover',
  compact = false,
  onClick,
}) {
  const [failedSrc, setFailedSrc] = useState(null)
  const src = buildImageUrl(imageUrl)
  const showFallback = !src || failedSrc === src
  const Icon = CATEGORY_ICONS[category] || FiImage

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-background-start overflow-hidden ${className}`}
      >
        {compact ? (
          <Icon size={18} className="text-gray-400" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-gray-400">
            <Icon size={28} className="text-gray-400" />
            <span className="text-xs font-medium">No image available</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={imgClassName}
      onClick={onClick}
      onError={() => setFailedSrc(src)}
    />
  )
}

export default ItemImage
