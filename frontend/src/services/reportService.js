import api from '../lib/api.js'

export async function createReport(formData) {
  const { data } = await api.post('/api/reports', formData)
  return data
}

export async function getMyReports() {
  const { data } = await api.get('/api/reports/mine')
  return data
}

export async function getPublicReports(params) {
  const { data } = await api.get('/api/reports', { params })
  return data
}

export async function getAdminDashboardStats() {
  const { data } = await api.get('/api/admin/dashboard/stats')
  return data
}

export async function getAdminReports(params, { signal } = {}) {
  const { data } = await api.get('/api/admin/reports', { params, signal })
  return data
}

export async function resolveReport(reportId) {
  const { data } = await api.patch(`/api/admin/reports/${reportId}/resolve`)
  return data
}
