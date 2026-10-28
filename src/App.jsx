import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import { muiTheme } from './styles/muiTheme'

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
