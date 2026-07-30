import { useState, useEffect, useCallback } from 'react'
import { getPublicReports } from '../services/reportService.js'

function usePublicReports(params = {}) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPublicReports(params)
      const list = Array.isArray(data) ? data : []
      const sorted = [...list].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
      setReports(sorted)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load reports.')
    } finally {
      setLoading(false)
    }
  }, [params.status, params.report_kind, params.limit, params.offset])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { reports, loading, error, refresh }
}

export default usePublicReports
