"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Glasses, Info, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function BottomNavbar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Guide",
      href: "/guide",
      icon: BookOpen,
    },
    {
      name: "Frames",
      href: "/frames",
      icon: Glasses,
    },
    {
      name: "About",
      href: "/about",
      icon: Info,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      isProfile: true,
    },
  ]

  if (!mounted) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <nav className="bg-card/80 backdrop-blur-md border-t border-border flex justify-around items-center py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center text-xs",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.isProfile && user ? (
                <Avatar className="h-6 w-6 mb-1">
                  <AvatarImage src={user.profilePic || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-[10px]">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              ) : (
                <item.icon className="h-5 w-5 mb-1" />
              )}
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
