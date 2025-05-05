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
