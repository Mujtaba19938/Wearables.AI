"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    general?: string
  }>({})
  const [showSignupSuccess, setShowSignupSuccess] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if user just signed up successfully
    if (searchParams?.get("signup") === "success") {
      setShowSignupSuccess(true)

      // Auto-hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSignupSuccess(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors: {
      email?: string
      password?: string
    } = {}

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to authenticate the user
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      router.push("/profile")
    } catch (error) {
      setErrors({
        general: "Invalid email or password. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        <div className="mb-6 sm:mb-10">
          <Link
            href="/profile"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center">Welcome Back</h1>
          <p className="text-sm sm:text-base text-muted-foreground text-center">
            Log in to access your wearables.ai account
          </p>
        </div>

        {showSignupSuccess && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-lg p-3 mb-4 flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Account created successfully!</p>
              <p className="text-sm">You can now log in with your credentials.</p>
            </div>
          </div>
        )}

        <div className="bg-card p-4 sm:p-6 rounded-xl border border-border w-full mb-6">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-4 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-muted border ${
                  errors.email ? "border-red-500" : "border-border"
                } rounded-lg py-2 px-3 text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-muted border ${
                    errors.password ? "border-red-500" : "border-border"
                  } rounded-lg py-2 px-3 text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary pr-10`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
