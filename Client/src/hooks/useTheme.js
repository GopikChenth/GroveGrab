import { useEffect, useState, useCallback } from 'react'

const THEME_KEY = 'grovegrab.theme'
const LEGACY_THEME_KEY = 'theme'
const DEFAULT_THEME = 'light'

// Hook that keeps theme in sync with localStorage, <html>, and <body>
export default function useTheme() {
  const resolveInitial = () => {
    if (typeof window === 'undefined') return DEFAULT_THEME

    let stored = null

    try {
      stored = localStorage.getItem(THEME_KEY)

      // Migrate legacy key while forcing the new default to light
      if (!stored) {
        const legacy = localStorage.getItem(LEGACY_THEME_KEY)
        if (legacy === 'light') {
          stored = 'light'
        } else if (legacy === 'dark') {
          stored = DEFAULT_THEME
        }
        if (legacy === 'light' || legacy === 'dark') {
          localStorage.removeItem(LEGACY_THEME_KEY)
          localStorage.setItem(THEME_KEY, stored ?? DEFAULT_THEME)
        }
      }
    } catch {}

    if (stored === 'light' || stored === 'dark') {
      return stored
    }

    try {
      localStorage.setItem(THEME_KEY, DEFAULT_THEME)
    } catch {}
    return DEFAULT_THEME
  }

  const [theme, setTheme] = useState(resolveInitial)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const body = document.body

    const applyTheme = (value) => {
      const isDark = value === 'dark'
      root.classList.toggle('dark', isDark)
      body.classList.toggle('dark', isDark)
      root.style.colorScheme = isDark ? 'dark' : 'light'
      root.dataset.theme = value
      body.dataset.theme = value
    }

    applyTheme(theme)

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
