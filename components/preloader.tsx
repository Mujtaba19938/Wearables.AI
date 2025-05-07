"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface PreloaderProps {
  className?: string
  duration?: number
  onLoadingComplete?: () => void
}

export function Preloader({ className, duration = 2000, onLoadingComplete }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        return newProgress > 100 ? 100 : newProgress
      })
    }, 200)

    const timer = setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setIsLoading(false)
      if (onLoadingComplete) {
        onLoadingComplete()
      }
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [duration, onLoadingComplete])

  if (!isLoading) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 overflow-hidden",
        className,
      )}
    >
      {/* Animated background - starfield effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars-container">
          <div className="stars stars-small"></div>
          <div className="stars stars-medium"></div>
          <div className="stars stars-large"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center max-w-md text-center px-4">
        {/* Logo with entrance animation */}
        <div className="relative logo-entrance">
          {/* Glasses SVG with animation */}
          <svg
            width="120"
            height="60"
            viewBox="0 0 120 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="glasses-animation"
          >
            <g className="glasses">
              {/* Left lens */}
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke="currentColor"
                strokeWidth="5"
                className="text-primary lens left-lens"
              />
              {/* Right lens */}
              <circle
                cx="90"
                cy="30"
                r="25"
                stroke="currentColor"
                strokeWidth="5"
                className="text-primary lens right-lens"
              />
              {/* Bridge */}
              <line
                x1="55"
                y1="30"
                x2="65"
                y2="30"
                stroke="currentColor"
                strokeWidth="5"
                className="text-primary bridge"
              />
              {/* Left temple */}
              <line
                x1="5"
                y1="30"
                x2="15"
                y2="30"
                stroke="currentColor"
                strokeWidth="5"
                className="text-primary temple left-temple"
              />
              {/* Right temple */}
              <line
                x1="105"
                y1="30"
                x2="115"
                y2="30"
                stroke="currentColor"
                strokeWidth="5"
                className="text-primary temple right-temple"
              />
              {/* Left eye */}
              <circle cx="30" cy="30" r="5" fill="currentColor" className="text-primary eye left-eye" />
              {/* Right eye */}
              <circle cx="90" cy="30" r="5" fill="currentColor" className="text-primary eye right-eye" />
            </g>
          </svg>

          {/* Scanning line animation */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="scan-line"></div>
          </div>
        </div>

        <h2 className="mt-6 text-xl font-bold animate-fade-in-up">wearables.ai</h2>

        {/* Branded tagline */}
        <p className="mt-2 text-base font-medium text-primary animate-fade-in-up animation-delay-100">
          Custom eyewear, powered by AI.
        </p>

        {/* Animated loader */}
        <div className="mt-8 relative">
          <div className="loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Loading text - smaller and lighter */}
        <p className="mt-3 text-xs text-muted-foreground animate-pulse">Loading your experience...</p>
      </div>
    </div>
  )
}
