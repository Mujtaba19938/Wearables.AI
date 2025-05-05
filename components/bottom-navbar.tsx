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
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
      <nav className="flex items-center justify-between px-6 py-3 mx-auto bg-black/60 backdrop-blur-lg rounded-full w-auto gap-8 shadow-lg border border-white/10">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[60px] relative group transition-all duration-300 ease-in-out",
                isActive ? "text-white" : "text-gray-400 hover:text-white",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-full bg-white/0 transition-all duration-300 ease-in-out -z-10",
                  isActive ? "bg-white/0" : "group-hover:bg-white/10",
                )}
              />

              <Icon
                className={cn(
                  "h-6 w-6 transition-all duration-300 ease-in-out",
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]",
                  !isActive && "group-hover:animate-[subtle-bounce_0.5s_ease-in-out]",
                )}
              />
              <span
                className={cn(
                  "text-xs mt-1 transition-all duration-300 ease-in-out",
                  isActive ? "" : "group-hover:font-medium group-hover:scale-105",
                )}
              >
                {label}
              </span>
              {isActive && (
                <span
                  className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full 
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
