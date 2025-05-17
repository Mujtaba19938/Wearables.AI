"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Book, Glasses, Info } from "lucide-react"
import { motion } from "framer-motion"
import ProfileButton from "./profile-button"
import ProfileModal from "./profile-modal"

export function BottomNavbar() {
  const pathname = usePathname()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <>
      <div className="fixed bottom-4 left-0 right-0 z-50 flex items-center justify-center px-4">
        <motion.div
          className="bg-black/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg px-3 sm:px-4 py-2 flex items-center space-x-4 sm:space-x-8 border border-gray-700/50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
        >
          <Link
            href="/"
            className={`flex flex-col items-center justify-center p-2 rounded-full transition-colors ${
              isActive("/") ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
            {isActive("/") && (
              <motion.div
                className="absolute bottom-0 w-1 h-1 bg-blue-500 rounded-full"
                layoutId="navIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>

          <Link
            href="/guide"
            className={`flex flex-col items-center justify-center p-2 rounded-full transition-colors ${
              isActive("/guide") ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Book className="w-5 h-5" />
            <span className="text-xs mt-1">Guide</span>
            {isActive("/guide") && (
              <motion.div
                className="absolute bottom-0 w-1 h-1 bg-blue-500 rounded-full"
                layoutId="navIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>

          <Link
            href="/frames"
            className={`flex flex-col items-center justify-center p-2 rounded-full transition-colors ${
              isActive("/frames") ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Glasses className="w-5 h-5" />
            <span className="text-xs mt-1">Frames</span>
            {isActive("/frames") && (
              <motion.div
                className="absolute bottom-0 w-1 h-1 bg-blue-500 rounded-full"
                layoutId="navIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>

          <Link
            href="/about"
            className={`flex flex-col items-center justify-center p-2 rounded-full transition-colors ${
              isActive("/about") ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-xs mt-1">About</span>
            {isActive("/about") && (
              <motion.div
                className="absolute bottom-0 w-1 h-1 bg-blue-500 rounded-full"
                layoutId="navIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        </motion.div>

        {/* Profile button */}
        <div className="ml-2">
          <ProfileButton onClick={() => setIsProfileModalOpen(true)} />
        </div>
      </div>

      {/* Profile modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  )
}

export default BottomNavbar
