import apiService from './apiService'

// Web Admin User endpoints. CRUD routes take the MongoDB _id.
const BASE = '/web/admin/users'

// Builds a query string; array values become repeated keys, empty values are skipped.
const buildQuery = (params = {}) => {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    if (Array.isArray(value)) {
      value.filter((item) => item !== undefined && item !== null && item !== '').forEach((item) =>
        search.append(key, item)
      )
    } else {
      search.append(key, value)
    }
  })

  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

// Returns { rows, pagination }. Accepts page, pageSize, search, filters, sortBy, sortOrder.
const fetchUsers = async (params = {}) => {
  const res = await apiService.get(`${BASE}${buildQuery(params)}`)

  return {
    rows: Array.isArray(res?.data) ? res.data : [],
    pagination: res?.pagination ?? {
      page: 1,
      pageSize: 0,
      totalRecords: 0,
      totalPages: 0,
    },
  }
}

// Normalizes count-summary into the shape the dashboard summary cards use.
const fetchUserCountSummary = async () => {
  const res = await apiService.get(`${BASE}/count-summary`)
  const data = res?.data ?? {}

  return {
    total: data.totalUser ?? 0,
    active: data.activeUser ?? 0,
    inactive: data.inactiveUser ?? 0,
    new: data.newUser ?? 0,
  }
}

const fetchUser = async (id) => {
  const res = await apiService.get(`${BASE}/${id}`)
  return res?.data ?? null
}

const createUser = async (payload) => {
  const res = await apiService.post(BASE, payload)
  return res?.data ?? null
}

const updateUser = async (id, payload) => {
  const res = await apiService.put(`${BASE}/${id}`, payload)
  return res?.data ?? null
}

const deleteUser = (id) => apiService.delete(`${BASE}/${id}`)

const userService = {
  fetchUsers,
  fetchUserCountSummary,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
}

export default userService
