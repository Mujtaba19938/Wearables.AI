"use client"

import { useState } from "react"
import { X, User, Settings, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/store/auth-store"
import LoginForm from "./login-form"
import SignupForm from "./signup-form"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [showSignup, setShowSignup] = useState(false)

  if (!isOpen) return null

  const toggleForm = () => {
    setShowSignup(!showSignup)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative bg-background rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-md sm:max-w-lg overflow-hidden z-10 border border-border"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-bold">
            {isAuthenticated ? "Profile" : showSignup ? "Create Account" : "Sign In"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isAuthenticated ? (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12" />
                )}
              </div>
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-muted-foreground">{user?.email}</p>

              <div className="w-full mt-6 space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left">
                  <User className="w-5 h-5 text-primary" />
                  <span>Edit Profile</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className="text-red-500">Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              {showSignup ? (
                <SignupForm key="signup" onToggleForm={toggleForm} />
              ) : (
                <LoginForm key="login" onToggleForm={toggleForm} />
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProfileModal
