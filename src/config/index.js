// Runtime config from Vite env vars, with fallback defaults.
const trimTrailingSlash = (url) => url.replace(/\/+$/, '')

const readNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const config = {
  apiBaseUrl: trimTrailingSlash(
    import.meta.env.VITE_API_BASE_URL || 'https://8kfas3uoje.execute-api.ap-south-1.amazonaws.com'
  ),
  authMode: import.meta.env.VITE_WEB_ADMIN_AUTH_MODE || 'admin',
  requestTimeoutMs: readNumber(import.meta.env.VITE_API_TIMEOUT_MS, 20000),
}

export default config
