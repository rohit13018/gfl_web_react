import { useEffect, useState } from 'react'
import masterService, { MASTER_TYPES, getMasterName } from '../services/masterService'

// Each dropdown field name doubles as the master-data `type` filter param.
const EMPTY_OPTIONS = MASTER_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {})

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
            // De-dupe: master data can hold repeated names (e.g. two "Unit Head"
            // personas), which would collide as dropdown keys.
            acc[type] = [
              ...new Set(
                results[index]
                  .filter((item) => item.isActive !== false)
                  .map(getMasterName)
                  .filter(Boolean)
              ),
            ]
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
