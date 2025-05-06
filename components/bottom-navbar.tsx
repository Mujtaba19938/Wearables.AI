"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Glasses, Info, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNavbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/guide", icon: BookOpen, label: "Guide" },
    { href: "/frames", icon: Glasses, label: "Frames" },
    { href: "/about", icon: Info, label: "About" },
  ]

  // Make the navbar responsive
  return (
    <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex flex-col items-center justify-center">
      {/* Floating Profile Button */}
      <Link
        href="/profile"
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-white mb-3 shadow-lg hover:bg-primary/90 transition-all duration-300 border border-primary/20"
        aria-label="Profile"
      >
        <User className="h-5 w-5 sm:h-6 sm:w-6" />
      </Link>

      {/* Bottom Navbar */}
      <nav className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 mx-auto dark:bg-black/60 bg-white/60 backdrop-blur-lg rounded-full w-auto gap-2 sm:gap-8 shadow-lg border dark:border-white/10 border-black/10">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[40px] sm:min-w-[60px] relative group transition-all duration-300 ease-in-out",
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
                  "h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 ease-in-out",
                  isActive
                    ? "dark:text-white text-black"
                    : "dark:text-gray-400 text-gray-600 dark:group-hover:text-white group-hover:text-black dark:group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]",
                  !isActive && "group-hover:animate-[subtle-bounce_0.5s_ease-in-out]",
                )}
              />
              <span
                className={cn(
                  "text-[10px] sm:text-xs mt-1 transition-all duration-300 ease-in-out",
                  isActive ? "" : "group-hover:font-medium group-hover:scale-105",
                )}
              >
                {label}
              </span>
              {isActive && (
                <span
                  className="absolute -bottom-1 w-1 h-1 sm:w-1.5 sm:h-1.5 dark:bg-white bg-black rounded-full 
                transition-all duration-300 ease-in-out animate-in fade-in zoom-in"
                />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
