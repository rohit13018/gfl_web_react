import { useCallback, useEffect, useMemo, useState } from 'react'
import masterService, { formatMasterType, getMasterName } from '../services/masterService'

const byNewest = (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0)

// Newest first so a freshly added master lands on page one.
const toRows = (records) =>
  [...records].sort(byNewest).map((record) => ({
    ...record,
    name: getMasterName(record) ?? '',
    typeLabel: formatMasterType(record.type),
    status: record.isActive === false ? 'Inactive' : 'Active',
  }))

// The list endpoint isn't paginated (it returns every record), so search and paging stay client-side.
const useMasterTable = () => {
  const [allMasters, setAllMasters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  useEffect(() => {
    let active = true

    masterService
      .fetchMasterData()
      .then((records) => {
        if (active) setAllMasters(toRows(records))
      })
      .catch(() => {
        if (active) setError('Unable to load masters. Please try again later.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  // Re-pull the list after a mutation so the table reflects server state.
  const reload = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      setAllMasters(toRows(await masterService.fetchMasterData()))
    } catch {
      setError('Unable to load masters. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addMaster = useCallback(
    async (payload) => {
      const created = await masterService.createMasterData(payload)
      await reload()
      setPaginationModel((prev) => ({ ...prev, page: 0 }))
      return created
    },
    [reload]
  )

  const updateMaster = useCallback(
    async (id, payload) => {
      const updated = await masterService.updateMasterData(id, payload)
      await reload()
      return updated
    },
    [reload]
  )

  const handleSearchChange = useCallback((value) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }))
    setSearchTerm(value)
  }, [])

  // Sr. No. follows the filtered order, so it's assigned after searching.
  const rows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const matches = term
      ? allMasters.filter((master) =>
          [master.typeLabel, master.name, master.status].some((value) =>
            value.toLowerCase().includes(term)
          )
        )
      : allMasters

    return matches.map((master, index) => ({ ...master, srNo: index + 1 }))
  }, [allMasters, searchTerm])

  return {
    rows,
    rowCount: rows.length,
    isLoading,
    error,
    searchTerm,
    onSearchChange: handleSearchChange,
    paginationModel,
    setPaginationModel,
    addMaster,
    updateMaster,
  }
}

export default useMasterTable
