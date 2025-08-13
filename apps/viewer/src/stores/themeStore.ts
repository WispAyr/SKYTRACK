import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeState {
  theme: Theme
  isDark: boolean
  
  // Actions
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,

      setTheme: (theme: Theme) => {
        set({ theme })
        
        // Apply theme immediately
        const isDark = theme === 'dark' || 
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        
        set({ isDark })
        
        // Update document classes
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(isDark ? 'dark' : 'light')
      },

      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)

// Initialize theme on store creation
if (typeof window !== 'undefined') {
  const { setTheme } = useThemeStore.getState()
  setTheme(useThemeStore.getState().theme)
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const { theme } = useThemeStore.getState()
    if (theme === 'system') {
      const isDark = e.matches
      useThemeStore.setState({ isDark })
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(isDark ? 'dark' : 'light')
    }
  })
}
