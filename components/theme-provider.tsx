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

    // Apply appropriate theme class to body and html
    const updateBodyClass = () => {
      const isDark =
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)

      if (isDark) {
        document.documentElement.classList.add("dark")
        document.documentElement.classList.remove("light")
        document.body.classList.add("dark")
        document.body.classList.remove("light")
      } else {
        document.documentElement.classList.add("light")
        document.documentElement.classList.remove("dark")
        document.body.classList.add("light")
        document.body.classList.remove("dark")
      }
    }

    // Initial setup
    updateBodyClass()

    // Listen for theme changes
    window.addEventListener("storage", updateBodyClass)

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", updateBodyClass)

    return () => {
      window.removeEventListener("storage", updateBodyClass)
      mediaQuery.removeEventListener("change", updateBodyClass)
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

export default ThemeProvider
