import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AnimationStyle = "particles" | "waves" | "gradient" | "bubbles" | "none"

interface AnimationState {
  style: AnimationStyle
  setStyle: (style: AnimationStyle) => void
}

// Create a custom storage object that works with SSR
const createNoopStorage = () => {
  return {
    getItem: (_name: string) => null,
    setItem: (_name: string, _value: string) => {},
    removeItem: (_name: string) => {},
  }
}

// Get storage that works in browser and SSR
const getStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage
  }
  return createNoopStorage()
}

export const useAnimationStore = create<AnimationState>()(
  persist(
    (set) => ({
      style: "particles",
      setStyle: (style) => {
        console.log("Setting animation style to:", style)
        set({ style })
      },
    }),
    {
      name: "animation-style",
      storage: {
        getItem: (name) => {
          const storage = getStorage()
          const value = storage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          const storage = getStorage()
          storage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          const storage = getStorage()
          storage.removeItem(name)
        },
      },
    },
  ),
)
