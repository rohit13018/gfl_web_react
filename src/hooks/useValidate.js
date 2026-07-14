import { useCallback, useRef } from 'react'

// Pairs with the common Validator input: register(name) hands back a ref
// callback to attach to a Validator, and validateAll() triggers every
// registered field's imperative `validate()` in one call.
const useValidate = () => {
  const fieldRefs = useRef({})

  const register = useCallback(
    (name) => (node) => {
      fieldRefs.current[name] = node
    },
    []
  )

  const validateAll = useCallback((names) => {
    const targets = names ?? Object.keys(fieldRefs.current)
    return targets
      .map((name) => fieldRefs.current[name]?.validate() ?? true)
      .every(Boolean)
  }, [])

  const reset = useCallback(() => {
    Object.values(fieldRefs.current).forEach((ref) => ref?.reset())
  }, [])

  return { register, validateAll, reset }
}

export default useValidate
