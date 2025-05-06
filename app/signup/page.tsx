"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { SocialLoginButtons } from "@/components/social-login-buttons"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    general?: string
  }>({})

  const router = useRouter()

  const validateForm = () => {
    const newErrors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      // In a real app, this would be an API call to create the user
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful signup
      router.push("/login?signup=success")
    } catch (error) {
      setErrors({
        general: "An error occurred during signup. Please try again.",
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center">Create Account</h1>
          <p className="text-sm sm:text-base text-muted-foreground text-center">
            Join wearables.ai to save your eyewear recommendations
          </p>
        </div>

        <div className="bg-card p-4 sm:p-6 rounded-xl border border-border w-full mb-6">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-4 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-muted border ${
                  errors.name ? "border-red-500" : "border-border"
                } rounded-lg py-2 px-3 text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="John Doe"
                disabled={isLoading}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
                Password
              </label>
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
              <p className="mt-1 text-xs text-muted-foreground">Must be at least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-muted border ${
                    errors.confirmPassword ? "border-red-500" : "border-border"
                  } rounded-lg py-2 px-3 text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary pr-10`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
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
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-border relative">
            <p className="text-center text-sm text-muted-foreground mb-4">Or sign up with</p>

            <SocialLoginButtons
              onSocialLogin={(provider) => {
                setIsLoading(true)
                // In a real app, this would authenticate with the selected provider
                setTimeout(() => {
                  router.push("/login?signup=success")
                  setIsLoading(false)
                }, 1500)
              }}
              isLoading={isLoading}
              type="signup"
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
