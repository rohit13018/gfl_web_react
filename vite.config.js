import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget =
    env.VITE_API_BASE_URL || 'https://8kfas3uoje.execute-api.ap-south-1.amazonaws.com'

  // Dev-only proxy: the backend rejects browser origins like localhost:5173,
  // so in dev the app calls same-origin /web/* and /api/* and Vite forwards
  // them with the Origin header stripped (treated as a server-to-server call).
  const proxyOptions = {
    target: apiTarget,
    changeOrigin: true,
    secure: true,
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.removeHeader('origin')
        proxyReq.removeHeader('referer')
      })
    },
  }

  return {
    plugins: [react()],
    // Pre-bundle MUI deep imports at startup so Vite doesn't discover them
    // mid-session and re-optimize, which breaks open tabs with
    // "504 Outdated Optimize Dep". Add new MUI imports here as they're used.
    optimizeDeps: {
      include: [
        '@emotion/react',
        '@emotion/styled',
        '@mui/material/Autocomplete',
        '@mui/material/Checkbox',
        '@mui/material/Chip',
        '@mui/material/FormControl',
        '@mui/material/FormControlLabel',
        '@mui/material/FormHelperText',
        '@mui/material/IconButton',
        '@mui/material/InputAdornment',
        '@mui/material/InputLabel',
        '@mui/material/MenuItem',
        '@mui/material/OutlinedInput',
        '@mui/material/TextField',
        '@mui/icons-material/AddRounded',
        '@mui/icons-material/ArrowForward',
        '@mui/icons-material/CheckBox',
        '@mui/icons-material/CheckBoxOutlineBlank',
        '@mui/icons-material/ChevronLeftRounded',
        '@mui/icons-material/ChevronRightRounded',
        '@mui/icons-material/CloseRounded',
        '@mui/icons-material/KeyboardArrowDown',
        '@mui/icons-material/KeyboardArrowUp',
        '@mui/icons-material/SearchRounded',
        '@mui/icons-material/Visibility',
        '@mui/icons-material/VisibilityOff',
        '@mui/x-data-grid',
        '@base-ui/react/number-field',
      ],
    },
    server: {
      proxy: {
        '/web/': proxyOptions,
        '/api/': proxyOptions,
      },
    },
  }
})
