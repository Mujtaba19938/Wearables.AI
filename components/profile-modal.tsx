"use client"

import type React from "react"

import { useState } from "react"
import { X, Mail, Lock, Loader2, User } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/store/auth-store"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, isAuthenticated, login, signup, logout, isLoading, error, clearError } = useAuthStore()
  const [showSignup, setShowSignup] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  if (!isOpen) return null

  const toggleForm = () => {
    setShowSignup(!showSignup)
    clearError?.()
    setEmail("")
    setPassword("")
    setName("")
    setConfirmPassword("")
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    await login?.(email, password)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return
    }
    await signup?.(name, email, password)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 border border-slate-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {isAuthenticated ? (
              // Authenticated User Profile
              <>
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-white">Profile</h2>
                  <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white mb-4">
                      {user?.avatar ? (
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                    <p className="text-slate-400">{user?.email}</p>

                    <button
                      onClick={logout}
                      className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Sign In / Sign Up Forms
              <>
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-white">{showSignup ? "Sign Up" : "Sign In"}</h2>
                  <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-center text-white mb-8">
                    {showSignup ? "Create Account" : "Welcome Back"}
                  </h3>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={showSignup ? handleSignUp : handleSignIn} className="space-y-4">
                    {showSignup && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white block">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white block">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium text-white block">Password</label>
                        {!showSignup && (
                          <button type="button" className="text-sm text-blue-400 hover:text-blue-300">
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {showSignup && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white block">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center mt-6"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {showSignup ? "Creating account..." : "Signing in..."}
                        </>
                      ) : showSignup ? (
                        "Sign Up"
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-slate-400">
                      {showSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                      <button onClick={toggleForm} className="text-blue-400 hover:text-blue-300 font-medium">
                        {showSignup ? "Sign in" : "Sign up"}
                      </button>
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 py-3 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        <span className="text-sm">Google</span>
                      </button>
                      <button className="flex items-center justify-center gap-2 py-3 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                            fill="#1877F2"
                          />
                        </svg>
                        <span className="text-sm">Facebook</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 text-xs text-center text-slate-400">
                    By signing in, you agree to our{" "}
                    <a href="/terms-of-service" className="text-blue-400 hover:text-blue-300">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300">
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProfileModal
