"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Settings, LogOut, LogIn, UserPlus } from "lucide-react"

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-10 text-center">Profile</h1>

        {isLoggedIn ? (
          <div className="bg-card p-4 sm:p-6 rounded-xl border border-border w-full mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/profile/settings"
                className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Settings className="w-5 h-5 text-primary" />
                <span>Account Settings</span>
              </Link>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <LogOut className="w-5 h-5 text-primary" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card p-4 sm:p-6 rounded-xl border border-border w-full mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Login</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Sign in to access your account and saved eyewear recommendations
            </p>

            <div className="space-y-3">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>

              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300"
              >
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </Link>
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className="bg-muted p-4 rounded-lg text-sm text-center">
            <p className="text-muted-foreground">
              Creating an account allows you to save your face analysis results and eyewear recommendations.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
