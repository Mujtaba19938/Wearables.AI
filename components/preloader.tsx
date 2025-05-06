"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface PreloaderProps {
  className?: string
  duration?: number
  onLoadingComplete?: () => void
}

export function Preloader({ className, duration = 2000, onLoadingComplete }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (onLoadingComplete) {
        onLoadingComplete()
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onLoadingComplete])

  if (!isLoading) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500",
        className,
      )}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
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

        <h2 className="mt-6 text-xl font-bold animate-pulse">wearables.ai</h2>
        <p className="mt-2 text-sm text-muted-foreground">Loading your experience...</p>
      </div>
    </div>
  )
}
