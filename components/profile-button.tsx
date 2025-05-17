"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/store/auth-store"
import { useTheme } from "next-themes"

interface ProfileButtonProps {
  onClick?: () => void
}

export function ProfileButton({ onClick }: ProfileButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { user, isAuthenticated } = useAuthStore()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Set mounted to true after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine neon colors based on theme
  const getNeonColors = () => {
    if (!mounted) return { primary: "#3b82f6", secondary: "#8b5cf6" }

    return theme === "dark"
      ? { primary: "#4f46e5", secondary: "#8b5cf6" } // Indigo and purple for dark mode
      : { primary: "#3b82f6", secondary: "#ec4899" } // Blue and pink for light mode
  }

  const { primary, secondary } = getNeonColors()

  return (
    <motion.button
      className="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg overflow-hidden"
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
      {/* Neon glow effects - outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-70 blur-md -z-10"
        style={{ backgroundColor: primary }}
        animate={{
          boxShadow: [
            `0 0 5px ${primary}, 0 0 10px ${primary}`,
            `0 0 10px ${primary}, 0 0 20px ${primary}`,
            `0 0 5px ${primary}, 0 0 10px ${primary}`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* User avatar or icon */}
      {isAuthenticated && user?.avatar ? (
        <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <User className="w-6 h-6" />
      )}

      {/* Authentication indicator with neon effect */}
      {isAuthenticated && (
        <motion.div
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-primary"
          style={{ backgroundColor: secondary }}
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            boxShadow: [
              `0 0 2px ${secondary}, 0 0 4px ${secondary}`,
              `0 0 4px ${secondary}, 0 0 8px ${secondary}`,
              `0 0 2px ${secondary}, 0 0 4px ${secondary}`,
            ],
          }}
          transition={{
            delay: 0.2,
            boxShadow: {
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
        />
      )}

      {/* Hover effect with neon glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full opacity-60 blur-md"
            style={{ backgroundColor: secondary }}
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: 1.2,
              opacity: 0.6,
              boxShadow: `0 0 15px ${secondary}, 0 0 30px ${secondary}`,
            }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Rotating neon accent */}
      <motion.div
        className="absolute w-full h-full rounded-full opacity-0"
        style={{
          backgroundImage: `linear-gradient(90deg, ${primary}, ${secondary}, ${primary})`,
          backgroundSize: "200% 100%",
        }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          rotate: [0, 360],
        }}
        transition={{
          opacity: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
          backgroundPosition: {
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
          rotate: {
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          },
        }}
      />
    </motion.button>
  )
}

export default ProfileButton
