"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Glasses, Info, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function BottomNavbar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const isMobile = useMobile()
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
  ]

  if (!mounted) return null

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 px-2 sm:px-4 md:px-8 lg:px-10 pb-2 sm:pb-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.2,
      }}
    >
      <div className="mx-auto max-w-md">
        <motion.div
          className="backdrop-blur-md bg-background/80 dark:bg-background/70 rounded-full border border-border shadow-lg"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <nav className="flex items-center justify-between px-2 sm:px-4 py-1 sm:py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link key={item.name} href={item.href} className="relative flex flex-col items-center justify-center">
                  <motion.div
                    className={cn(
                      "relative flex h-10 sm:h-12 w-10 sm:w-12 flex-col items-center justify-center rounded-full transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            opacity: { duration: 0.15 },
                          }}
                        />
                      )}
                    </AnimatePresence>
                    <motion.div
                      initial={{ y: isActive ? -3 : 0 }}
                      animate={{ y: isActive ? -3 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 relative z-10" />
                    </motion.div>
                    <motion.span
                      className="mt-0.5 text-[10px] sm:text-xs font-medium relative z-10"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: isActive ? 1 : 0.7 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  </motion.div>
                </Link>
              )
            })}
            <Link href="/profile" className="relative flex flex-col items-center justify-center">
              <motion.div
                className={cn(
                  "relative flex h-10 sm:h-12 w-10 sm:w-12 flex-col items-center justify-center rounded-full transition-colors",
                  pathname === "/profile" ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <AnimatePresence mode="wait">
                  {pathname === "/profile" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        opacity: { duration: 0.15 },
                      }}
                    />
                  )}
                </AnimatePresence>
                {user ? (
                  <div className="relative z-10">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-background">
                      <AvatarImage src={user.profilePic || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-xs">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <>
                    <motion.div
                      initial={{ y: pathname === "/profile" ? -3 : 0 }}
                      animate={{ y: pathname === "/profile" ? -3 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <User className="h-4 w-4 sm:h-5 sm:w-5 relative z-10" />
                    </motion.div>
                    <motion.span
                      className="mt-0.5 text-[10px] sm:text-xs font-medium relative z-10"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: pathname === "/profile" ? 1 : 0.7 }}
                      transition={{ duration: 0.2 }}
                    >
                      Profile
                    </motion.span>
                  </>
                )}
              </motion.div>
            </Link>
          </nav>
        </motion.div>
      </div>
    </motion.div>
  )
}
