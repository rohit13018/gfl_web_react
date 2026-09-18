import { useEffect, useState } from 'react'
import masterService from '../services/masterService'

// Each dropdown field name doubles as the master-data `type` filter param.
const MASTER_TYPES = ['business', 'company', 'location', 'plant', 'persona']

const EMPTY_OPTIONS = MASTER_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {})

// Some master-data records come back from the API with a "name " key (trailing
// space) instead of "name" — tolerate that instead of rendering a blank option.
const getName = (item) => {
  const key = Object.keys(item).find((k) => k.trim() === 'name')
  return key ? item[key] : undefined
}

// Fetches the option list for every master-data type, one request per type
// (e.g. fetchMasterData({ type: 'business' })), for use in the user form dropdowns.
const useMasterOptions = () => {
  const [options, setOptions] = useState(EMPTY_OPTIONS)

  useEffect(() => {
    let active = true

    Promise.all(MASTER_TYPES.map((type) => masterService.fetchMasterData({ type })))
      .then((results) => {
        if (!active) return
        console.log('[useMasterOptions] raw results', MASTER_TYPES, results)
        setOptions(
          MASTER_TYPES.reduce((acc, type, index) => {
            acc[type] = results[index]
              .filter((item) => item.isActive !== false)
              .map(getName)
              .filter(Boolean)
            return acc
          }, {})
        )
      })
      .catch(() => {
        if (active) setOptions(EMPTY_OPTIONS)
      })

    return () => {
      active = false
    }
  }, [])

  return options
}

export default useMasterOptions
