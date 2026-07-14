export const theme = {
  colors: {
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    gradientFrom: '#22c55e',
    gradientTo: '#0ea5e9',
    navy: '#0b3161',
    navyDark: '#081d3d',
    danger: '#dc2626',
    dangerBg: 'rgba(220, 38, 38, 0.08)',
    border: '#d8dee7',
    surface: '#ffffff',
    surfaceMuted: '#f7f7f9',
    pageBg: '#f4f9fd',
    text: '#111827',
    textMuted: '#6b7280',
    heroTextMuted: 'rgba(255, 255, 255, 0.75)',
    tableHeader: '#1B5FA8',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    pill: '999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadow: '0 10px 30px rgba(15, 15, 20, 0.08)',
  transitionFast: '0.15s ease',
  breakpoints: {
    tablet: 768,
    laptop: 1024,
    desktop: 1440,
  },
}

export const mq = (breakpoint) => `@media (min-width: ${theme.breakpoints[breakpoint]}px)`
