"use client"

import type React from "react"

import { useState } from "react"
import { Mail } from "lucide-react"

export function SubscribeButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSuccess(true)
      setEmail("")
      setTimeout(() => {
        setIsModalOpen(false)
        setIsSuccess(false)
      }, 2000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full bg-primary/20 hover:bg-primary/30 text-primary-foreground font-medium transition-colors backdrop-blur-md"
      >
        <Mail className="h-4 w-4" />
        <span className="hidden sm:inline">Subscribe</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-border">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">Subscribe to Updates</h2>
            <p className="text-muted-foreground mb-4">
              Get notified about new features and improvements to our eyewear matching technology.
            </p>

            {isSuccess ? (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-lg mb-4">
                Thanks for subscribing! We'll be in touch soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-field"
                  />
                </div>

                {error && <div className="text-destructive text-sm mb-4">{error}</div>}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="button-primary disabled:opacity-50">
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SubscribeButton
