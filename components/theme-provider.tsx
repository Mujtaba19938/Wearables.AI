"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // This delay ensures all client components are properly hydrated
  // before the theme is applied, preventing flickering
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Add transition class to body for smooth theme changes
    document.body.classList.add("theme-transition")

    // Apply appropriate theme class to body
    const updateBodyClass = () => {
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark")
        document.documentElement.classList.remove("light")
      } else {
        document.documentElement.classList.add("light")
        document.documentElement.classList.remove("dark")
      }
    }

    // Initial setup
    updateBodyClass()

    // Listen for theme changes
    window.addEventListener("storage", updateBodyClass)

    return () => {
      window.removeEventListener("storage", updateBodyClass)
    }
  }, [])

  return (
    <NextThemesProvider {...props}>
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </NextThemesProvider>
  )
}

// Context and hook for component-level access
export const ThemeContext = createContext({
  theme: "dark" as string | undefined,
  setTheme: (_theme: string) => {},
})

export const useTheme = () => useContext(ThemeContext)
