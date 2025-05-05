"use client"

import { useTheme } from "@/components/theme-provider"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  )
}
