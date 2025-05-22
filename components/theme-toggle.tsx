"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun } from "lucide-react"
import { motion } from "framer-motion"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-slate-700 dark:bg-slate-800 flex items-center justify-center shadow-lg hover:bg-slate-600 dark:hover:bg-slate-700 transition-colors"
      whileTap={{ scale: 0.9 }}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-300" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-slate-200"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </motion.button>
  )
}
