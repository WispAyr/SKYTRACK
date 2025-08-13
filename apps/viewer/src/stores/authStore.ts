import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'operator' | 'viewer' | 'analyst'
  permissions: string[]
  lastLogin?: Date
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  clearError: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // TODO: Implement actual API call
          // For now, simulate successful login
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const mockUser: User = {
            id: '1',
            username,
            email: `${username}@example.com`,
            role: 'admin',
            permissions: ['*'],
            lastLogin: new Date(),
          }
          
          const mockToken = 'mock-jwt-token-' + Date.now()
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          })
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      refreshToken: async () => {
        try {
          // TODO: Implement token refresh
          const { token } = get()
          if (token) {
            // Simulate token refresh
            await new Promise(resolve => setTimeout(resolve, 500))
            // Token is still valid
          }
        } catch (error) {
          // Token refresh failed, logout user
          get().logout()
        }
      },

      clearError: () => {
        set({ error: null })
      },

      setUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
