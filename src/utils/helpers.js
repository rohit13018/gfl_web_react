export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const getErrorMessage = (error) =>
  error?.message || 'Something went wrong. Please try again.'
