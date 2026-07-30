import { useState, useEffect, useCallback } from 'react'
import { getAdminDashboardStats } from '../services/reportService.js'

function useAdminDashboardStats() {
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedThisWeek: 0,
    totalStudents: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminDashboardStats()
      setStats({
        totalReports: data.totalReports ?? 0,
        pendingReports: data.pendingReports ?? 0,
        resolvedThisWeek: data.resolvedThisWeek ?? 0,
        totalStudents: data.totalStudents ?? 0,
      })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load statistics.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { stats, loading, error, refresh }
}

export default useAdminDashboardStats
