"use client"

import type React from "react"

import { useState } from "react"
import { Mail, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/toast-provider"

export default function SubscribeButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSuccess(true)
      setEmail("")

      // Show toast notification
      addToast("Successfully subscribed to updates!", "success")

      setTimeout(() => {
        setIsModalOpen(false)
        setIsSuccess(false)
      }, 2000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
      addToast("Failed to subscribe. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium transition-all duration-300 shadow-lg backdrop-blur-sm border border-slate-600 dark:border-slate-500"
        aria-label="Subscribe to updates"
      >
        <Mail className="h-4 w-4" />
        <span className="hidden sm:inline">Subscribe</span>
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Subscribe to Updates</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Get notified about new features and improvements to our eyewear matching technology.
              </p>

              {isSuccess ? (
                <motion.div
                  className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-lg mb-4 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Mail className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                  <p className="font-medium">Thanks for subscribing!</p>
                  <p className="text-sm">We'll be in touch soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          Subscribe
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
