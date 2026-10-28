import { createTheme } from '@mui/material/styles'
import { theme } from './theme'

// MUI components set their own font and spacing, so the app font and the compact
// placeholder/dropdown sizing are applied here instead of through body styles.
const compactOption = {
  minHeight: 'auto',
  paddingTop: 4,
  paddingBottom: 4,
  paddingLeft: 12,
  paddingRight: 12,
}

export const muiTheme = createTheme({
  typography: {
    fontFamily: theme.fontFamily,
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': { fontSize: 13 },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: { paddingTop: 4, paddingBottom: 4 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: compactOption,
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        listbox: {
          paddingTop: 4,
          paddingBottom: 4,
          '& .MuiAutocomplete-option': compactOption,
        },
      },
    },
  },
})
