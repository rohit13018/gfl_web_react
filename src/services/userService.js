import apiService from './apiService'

const fetchUsers = async () => {
  const users = await apiService.get('/users')
  return users.filter((user) => user.status !== undefined)
}

const createUser = (payload) => apiService.post('/users', payload)

const updateUser = (id, payload) => apiService.patch(`/users/${id}`, payload)

const deleteUser = (id) => apiService.delete(`/users/${id}`)

const userService = { fetchUsers, createUser, updateUser, deleteUser }

export default userService
