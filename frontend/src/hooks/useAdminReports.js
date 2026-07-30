import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { getAdminReports } from '../services/reportService.js'

function useAdminReports(params = {}) {
  const [reports, setReports] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const refresh = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    try {
      const data = await getAdminReports(params, { signal: controller.signal })
      if (Array.isArray(data)) {
        setReports(data)
        setTotal(data.length)
      } else {
        setReports(data.reports || [])
        setTotal(data.total ?? 0)
      }
    } catch (err) {
      if (axios.isCancel(err)) return
      setError(err.response?.data?.message || err.message || 'Failed to load reports.')
    } finally {
      setLoading(false)
    }
  }, [params.status, params.report_kind, params.search, params.limit, params.offset])

  useEffect(() => {
    refresh()
    return () => abortRef.current?.abort()
  }, [refresh])

  return { reports, total, loading, error, refresh }
}

export default useAdminReports
