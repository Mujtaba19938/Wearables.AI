import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Simple validation (in a real app, this would be server-side)
          if (email === "demo@example.com" && password === "password") {
            set({
              user: {
                id: "user-1",
                name: "Demo User",
                email: "demo@example.com",
                avatar: null,
              },
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({ error: "Invalid email or password", isLoading: false })
          }
        } catch (error) {
          set({ error: "An error occurred during login", isLoading: false })
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // In a real app, this would create a new user on the server
          set({
            user: {
              id: `user-${Date.now()}`,
              name,
              email,
              avatar: null,
            },
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ error: "An error occurred during signup", isLoading: false })
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
