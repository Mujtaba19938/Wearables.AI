"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      // If user scrolls down 300px, show the button
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    // Initial check in case page is already scrolled
    toggleVisibility()

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Determine which animation to use based on theme
  const shadowAnimation = mounted && theme === "dark" ? "animate-glow-pulse" : "animate-shadow-pulse"

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed right-4 bottom-24 sm:right-6 sm:bottom-28 z-40 flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 border border-primary/20 opacity-90 hover:opacity-100",
        shadowAnimation,
        "transform hover:translate-y-[-2px]",
      )}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5 sm:h-4 sm:w-4" />
    </button>
  )
}

// Add default export
export default ScrollToTop
