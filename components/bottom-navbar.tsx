"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, BookOpen, Glasses, Info, User } from "lucide-react"
import ProfileModal from "./profile-modal"

export default function BottomNavbar() {
  const pathname = usePathname()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/guide", label: "Guide", icon: BookOpen },
    { href: "/frames", label: "Frames", icon: Glasses },
    { href: "/about", label: "About", icon: Info },
  ]

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen)
  }

  return (
    <>
      <div className="fixed bottom-3 left-0 right-0 z-50 flex justify-center items-center gap-3 px-4">
        {/* Main Navigation */}
        <motion.nav
          className="flex items-center justify-between px-4 py-2 bg-gray-800/90 backdrop-blur-md rounded-full border border-gray-700/50 shadow-lg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {navItems.map((item, index) => {
            const active = isActive(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center px-2 py-1 rounded-full transition-all duration-200 ${
                  active ? "text-blue-400" : "text-gray-400 hover:text-gray-200"
                } ${index < navItems.length - 1 ? "mr-1" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {active && (
                  <motion.div
                    className="absolute inset-0 bg-blue-500/10 rounded-full"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            )
          })}
        </motion.nav>

        {/* Profile Button */}
        <motion.div
          initial={{ y: 100, scale: 0.8 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <button
            onClick={toggleProfileModal}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
            aria-label="Open profile"
          >
            <User className="h-5 w-5" />
          </button>
        </motion.div>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  )
}
