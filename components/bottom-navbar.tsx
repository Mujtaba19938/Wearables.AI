"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Glasses, Info, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function BottomNavbar() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/guide", icon: BookOpen, label: "Guide" },
    { href: "/frames", icon: Glasses, label: "Frames" },
    { href: "/about", icon: Info, label: "About" },
  ]

  // Determine which animation to use based on theme
  const shadowAnimation = mounted && theme === "dark" ? "animate-glow-pulse" : "animate-shadow-pulse"

  // Make the navbar responsive
  return (
    <div className="fixed bottom-6 sm:bottom-8 left-0 right-0 z-50 flex justify-center">
      <div className="flex items-center gap-2 sm:gap-2">
        {/* Bottom Navbar - smaller on desktop */}
        <nav className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-1.5 dark:bg-black/60 bg-white/60 backdrop-blur-lg rounded-full gap-2 sm:gap-6 shadow-lg border dark:border-white/10 border-black/10">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[40px] sm:min-w-[50px] relative group transition-all duration-300 ease-in-out",
                  isActive
                    ? "dark:text-white text-black"
                    : "dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-black",
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 rounded-full dark:bg-white/0 bg-black/0 transition-all duration-300 ease-in-out -z-10",
                    isActive ? "dark:bg-white/0 bg-black/0" : "dark:group-hover:bg-white/10 group-hover:bg-black/10",
                  )}
                />

                <Icon
                  className={cn(
                    "h-5 w-5 sm:h-4 sm:w-4 transition-all duration-300 ease-in-out",
                    isActive
                      ? "dark:text-white text-black"
                      : "dark:text-gray-400 text-gray-600 dark:group-hover:text-white group-hover:text-black dark:group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]",
                    !isActive && "group-hover:animate-[subtle-bounce_0.5s_ease-in-out]",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] sm:text-[9px] mt-1 transition-all duration-300 ease-in-out",
                    isActive ? "" : "group-hover:font-medium group-hover:scale-105",
                  )}
                >
                  {label}
                </span>
                {isActive && (
                  <span
                    className="absolute -bottom-1 w-1 h-1 sm:w-1 sm:h-1 dark:bg-white bg-black rounded-full 
                  transition-all duration-300 ease-in-out animate-in fade-in zoom-in"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Profile Button with Shadow Animation - smaller on desktop */}
        <Link
          href="/profile"
          className={cn(
            "flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 border border-primary/20",
            shadowAnimation,
            pathname === "/profile" ? "ring-2 ring-white" : "",
          )}
          aria-label="Profile"
        >
          <User className="h-5 w-5 sm:h-4 sm:w-4" />
        </Link>
      </div>
    </div>
  )
}

// Add default export
export default BottomNavbar
