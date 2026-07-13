export const setItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save "${key}" to storage`, error)
  }
}

export const getItem = (key) => {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error(`Failed to read "${key}" from storage`, error)
    return null
  }
}

export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}
