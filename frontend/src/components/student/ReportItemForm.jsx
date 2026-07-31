import { useState, useRef, useCallback } from 'react'
import { FiUploadCloud, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import GlassCard from '../ui/GlassCard.jsx'
import Select from '../ui/Select.jsx'
import Button from '../ui/Button.jsx'
import { createReport } from '../../services/reportService.js'
import { REPORT_CATEGORIES } from '../../constants/reportCategories.js'

const MAX_DESCRIPTION_LENGTH = 300

function validate({ reportKind, category, description, imageFile }) {
  const errors = {}

  if (!category) {
    errors.category = 'Please select a category.'
  }

  if (!description.trim()) {
    errors.description = 'Description is required.'
  } else if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`
  }

  if (reportKind === 'lost' && !imageFile) {
    errors.imageFile = 'An image is required for lost item reports.'
  }

  return errors
}

function getErrorMessage(error) {
  if (!error.response) {
    return 'Network error. Please check your connection and try again.'
  }

  const { status, data } = error.response

  if (status === 400) {
    return data?.message || data?.error || 'Validation failed. Please check your input.'
  }

  if (status === 401) {
    return 'Your session has expired. Please log in again.'
  }

  if (status === 403) {
    return 'You do not have permission to submit reports.'
  }

  if (status >= 500) {
    return 'Server error. Please try again later.'
  }

  return data?.message || data?.error || 'Something went wrong. Please try again.'
}

function ReportItemForm({ onSuccess }) {
  const [reportKind, setReportKind] = useState('lost')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [banner, setBanner] = useState(null)
  const fileInputRef = useRef(null)
  const resetTimerRef = useRef(null)

  const resetForm = useCallback(() => {
    setReportKind('lost')
    setCategory('')
    setDescription('')
    setImageFile(null)
    setErrors({})
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return

    const validationErrors = validate({ reportKind, category, description, imageFile })
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    setBanner(null)

    const formData = new FormData()
    formData.append('report_kind', reportKind)
    formData.append('category', category)
    formData.append('description', description)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      await createReport(formData)
      setBanner({ type: 'success', message: 'Report submitted successfully.' })

      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      resetTimerRef.current = setTimeout(() => {
        resetForm()
        setBanner(null)
        if (onSuccess) onSuccess()
      }, 1000)
    } catch (err) {
      setBanner({ type: 'error', message: getErrorMessage(err) })
    } finally {
      setSubmitting(false)
    }
  }

  function handleCategoryChange(e) {
    setCategory(e.target.value)
    setErrors((prev) => ({ ...prev, category: undefined }))
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setErrors((prev) => ({ ...prev, imageFile: undefined }))
    }
  }

  function handleDescriptionChange(e) {
    const value = e.target.value
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <GlassCard className="p-6 md:p-8 rounded-xl2">
        {banner && (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-6 text-sm font-medium ${
              banner.type === 'success'
                ? 'bg-status-resolved-bg text-status-resolved'
                : 'bg-status-pending-bg text-status-pending'
            }`}
          >
            {banner.type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
            <span>{banner.message}</span>
          </div>
        )}

        <div className="space-y-6">

          {/* Lost / Found Toggle */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Report Type
            </label>
            <div className="flex rounded-xl bg-gray-100 p-1 w-fit">
              <button
                type="button"
                disabled={submitting}
                onClick={() => { if (!submitting) { setReportKind('lost'); setErrors((p) => ({ ...p, reportKind: undefined })) } }}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  reportKind === 'lost'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Lost Item
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => { if (!submitting) { setReportKind('found'); setErrors((p) => ({ ...p, reportKind: undefined })) } }}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  reportKind === 'found'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Found Item
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <Select
              label="Category"
              options={[{ value: '', label: 'Select Category' }, ...REPORT_CATEGORIES]}
              value={category}
              disabled={submitting}
              onChange={handleCategoryChange}
              className={errors.category ? 'border-error' : ''}
            />
            {errors.category && (
              <p className="text-xs text-error mt-1.5">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Description
            </label>
            <textarea
              placeholder="Describe your item in detail..."
              value={description}
              disabled={submitting}
              onChange={handleDescriptionChange}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(Math.max(e.target.scrollHeight, 100), 200) + 'px'
              }}
              className={`w-full rounded-lg border border-gray-200 bg-white/80 px-4 py-2.5 text-sm outline-none transition-colors duration-150 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.description ? 'border-error' : ''
              }`}
              rows={3}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description ? (
                <p className="text-xs text-error">{errors.description}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">
                {description.length} / {MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              {reportKind === 'lost' ? 'Image (required)' : 'Image (optional)'}
            </label>
            <div
              onClick={() => { if (!submitting) fileInputRef.current?.click() }}
              className={`w-full rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors duration-150 ${
                submitting ? 'pointer-events-none opacity-50' : ''
              } ${
                errors.imageFile
                  ? 'border-error bg-error/5'
                  : 'border-gray-200 hover:border-primary/40 bg-white/40 hover:bg-primary/[0.02]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={submitting}
                className="hidden"
              />
              {imageFile ? (
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-medium text-primary">{imageFile.name}</p>
                  <p className="text-xs text-gray-400">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <FiUploadCloud size={36} className="text-gray-300 mb-1" />
                  <p className="text-sm font-medium text-gray-500">Drag & drop image here</p>
                  <p className="text-xs text-gray-400">or click to browse</p>
                  <p className="text-xs text-gray-300 mt-2">
                    JPG &bull; PNG &bull; WEBP &bull; Max 5 MB
                  </p>
                </div>
              )}
            </div>
            {errors.imageFile && (
              <p className="text-xs text-error mt-1.5">{errors.imageFile}</p>
            )}
          </div>

        </div>

        {/* Submit */}
        <div className="mt-8">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-base flex items-center justify-center gap-2"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </GlassCard>
    </form>
  )
}

export default ReportItemForm
