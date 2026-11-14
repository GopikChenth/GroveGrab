import { useEffect, useState, useCallback } from 'react'

const THEME_KEY = 'grovegrab.theme'
const DEFAULT_THEME = 'light'

export default function useTheme() {
  const resolveInitial = () => {
    if (typeof window === 'undefined') return DEFAULT_THEME
    try {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'light' || stored === 'dark') {
        return stored
      }
      localStorage.setItem(THEME_KEY, DEFAULT_THEME)
    } catch {}
    return DEFAULT_THEME
  }

  const [theme, setTheme] = useState(resolveInitial)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const isDark = theme === 'dark'
    const root = document.documentElement
    const body = document.body

    root.classList.toggle('dark', isDark)
    body.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'

    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (event) => {
      if (event.key === THEME_KEY && (event.newValue === 'light' || event.newValue === 'dark')) {
        setTheme(event.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback(() => {
    setTheme((value) => (value === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggle, setTheme }
}
