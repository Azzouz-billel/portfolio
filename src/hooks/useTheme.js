import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

const getInitialTheme = () => {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // storage unavailable (private mode) — theme still applies for this session
    }
  }, [theme])

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
    [],
  )

  return { theme, toggleTheme }
}
