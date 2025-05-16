"use client"

import { useState } from "react"
import { User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/store/auth-store"

interface ProfileButtonProps {
  onClick?: () => void
}

export function ProfileButton({ onClick }: ProfileButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { user, isAuthenticated } = useAuthStore()

  return (
    <motion.button
      className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg overflow-hidden"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 20,
        },
      }}
    >
      {isAuthenticated && user?.avatar ? (
        <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <User className="w-6 h-6" />
      )}

      {/* Authentication indicator */}
      {isAuthenticated && (
        <motion.div
          className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-blue-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}

      {/* Glow effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500 opacity-50 blur-md"
            initial={{ scale: 1 }}
            animate={{ scale: 1.2 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Permanent subtle glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-500 opacity-30 blur-md -z-10"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </motion.button>
  )
}

export default ProfileButton
