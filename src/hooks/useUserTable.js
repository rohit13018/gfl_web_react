import { useCallback, useEffect, useMemo, useState } from 'react'
import userService from '../services/userService'

const FILTER_KEYS = ['business', 'company', 'location', 'plant']

const INITIAL_FILTERS = FILTER_KEYS.reduce((acc, key) => ({ ...acc, [key]: '' }), {})

// `company` can be an array (multiselect) while every other field is a
// plain string, so filtering/search below normalize through this helper.
const toValueList = (value) => (Array.isArray(value) ? value : [value])

const uniqueOptions = (rows, key) =>
  [...new Set(rows.flatMap((row) => toValueList(row[key])))].filter(Boolean).sort()

const matchesFilter = (value, filterValue) =>
  !filterValue || toValueList(value).includes(filterValue)

// Filtering/search/pagination run client-side against the full JSON Server
// dataset for now. Swapping to server-side pagination later just means
// replacing the `rows`/`rowCount` derivation below with a fetch keyed on
// { searchTerm, filters, paginationModel, sortModel }.
const useUserTable = () => {
  const [allUsers, setAllUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      setIsLoading(true)
      setError('')
      try {
        const users = await userService.fetchUsers()
        if (isMounted) setAllUsers(users)
      } catch {
        if (isMounted) setError('Unable to load users. Please try again later.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadUsers()
    return () => {
      isMounted = false
    }
  }, [])

  const addUser = useCallback(async (payload) => {
    const created = await userService.createUser(payload)
    setAllUsers((prev) => [created, ...prev])
    setPaginationModel((prev) => ({ ...prev, page: 0 }))
    return created
  }, [])

  const updateUser = useCallback(async (id, payload) => {
    const updated = await userService.updateUser(id, payload)
    setAllUsers((prev) => prev.map((existing) => (existing.id === id ? updated : existing)))
    return updated
  }, [])

  const deleteUser = useCallback(async (id) => {
    await userService.deleteUser(id)
    setAllUsers((prev) => prev.filter((existing) => existing.id !== id))
  }, [])

  const setFilter = useCallback((key, value) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }))
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSearchChange = useCallback((value) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }))
    setSearchTerm(value)
  }, [])

  const clearFilters = useCallback(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }))
    setFilters(INITIAL_FILTERS)
    setSearchTerm('')
  }, [])

  const filterOptions = useMemo(
    () => ({
      business: uniqueOptions(allUsers, 'business'),
      company: uniqueOptions(allUsers, 'company'),
      location: uniqueOptions(allUsers, 'location'),
      plant: uniqueOptions(allUsers, 'plant'),
      persona: uniqueOptions(allUsers, 'persona'),
    }),
    [allUsers]
  )

  const rows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return allUsers.filter((user) => {
      const matchesFilters = FILTER_KEYS.every((key) => matchesFilter(user[key], filters[key]))
      if (!matchesFilters) return false
      if (!term) return true

      return [user.email, user.business, user.company, user.location, user.plant, user.persona]
        .flatMap(toValueList)
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    })
  }, [allUsers, filters, searchTerm])

  const summary = useMemo(
    () => ({
      total: allUsers.length,
      active: allUsers.filter((user) => user.status === 'Active').length,
      inactive: allUsers.filter((user) => user.status === 'Inactive').length,
      new: allUsers.filter((user) => user.isNew).length,
    }),
    [allUsers]
  )

  return {
    rows,
    rowCount: rows.length,
    isLoading,
    error,
    summary,
    searchTerm,
    onSearchChange: handleSearchChange,
    filters,
    filterOptions,
    setFilter,
    clearFilters,
    paginationModel,
    setPaginationModel,
    addUser,
    updateUser,
    deleteUser,
  }
}

export default useUserTable
