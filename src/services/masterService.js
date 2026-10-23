import apiService from './apiService'

// Web Admin Master Data endpoints. CRUD routes take the MongoDB _id.
const BASE = '/web/cxo/master-data'

// The `type` enum the API accepts on create and as a list filter.
export const MASTER_TYPES = ['business', 'company', 'location', 'plant', 'persona']

// Some records come back with a "name " key (trailing space) instead of "name";
// prefer the real key so a record renamed through the API shows its new name.
export const getMasterName = (item) => {
  if (item.name !== undefined) return item.name
  const key = Object.keys(item).find((k) => k.trim() === 'name')
  return key ? item[key] : undefined
}

// Stored types are mixed case ("Business", "business", "Material Group"); title-case for display.
export const formatMasterType = (type = '') => type.replace(/\b\w/g, (char) => char.toUpperCase())

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
