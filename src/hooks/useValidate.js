import { useCallback, useRef } from 'react'

// register(name) returns a ref callback for a Validator; validateAll() runs each field's validate().
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
