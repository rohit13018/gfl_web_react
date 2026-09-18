import apiService from './apiService'

// Web Admin Master Data endpoints. CRUD routes take the MongoDB _id.
const BASE = '/web/admin/master-data'

// Builds a query string; empty values are skipped.
const buildQuery = (params = {}) => {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    search.append(key, value)
  })

  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

// Returns the list of master data records, optionally filtered by type
// (business, company, location, plant, persona).
const fetchMasterData = async (params = {}) => {
  const res = await apiService.get(`${BASE}${buildQuery(params)}`)
  console.log('[masterService] fetchMasterData', params, res)
  return Array.isArray(res?.data) ? res.data : []
}

const fetchMasterDataById = async (id) => {
  const res = await apiService.get(`${BASE}/${id}`)
  return res?.data ?? null
}

const createMasterData = async (payload) => {
  const res = await apiService.post(BASE, payload)
  return res?.data ?? null
}

const updateMasterData = async (id, payload) => {
  const res = await apiService.put(`${BASE}/${id}`, payload)
  return res?.data ?? null
}

const deleteMasterData = (id) => apiService.delete(`${BASE}/${id}`)

const masterService = {
  fetchMasterData,
  fetchMasterDataById,
  createMasterData,
  updateMasterData,
  deleteMasterData,
}

export default masterService
