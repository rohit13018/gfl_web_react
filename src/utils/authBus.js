// Event channel so the API layer can signal logout without importing the auth context (circular dep).
const target = new EventTarget()
const AUTH_LOGOUT = 'auth:logout'

export const emitAuthLogout = () => {
  target.dispatchEvent(new Event(AUTH_LOGOUT))
}

export const onAuthLogout = (handler) => {
  target.addEventListener(AUTH_LOGOUT, handler)
  return () => target.removeEventListener(AUTH_LOGOUT, handler)
}
