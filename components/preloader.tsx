"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface PreloaderProps {
  onLoadingComplete?: () => void
  minimumDisplayTime?: number
}

export default function Preloader({ onLoadingComplete, minimumDisplayTime = 2000 }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [resourcesLoaded, setResourcesLoaded] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const { theme, resolvedTheme } = useTheme()

  // Use resolvedTheme for more accurate theme detection
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    let progressInterval: NodeJS.Timeout

    // Simulate progress
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }

        // Speed up progress if resources are actually loaded
        const increment = resourcesLoaded ? 10 : 3
        return Math.min(prev + increment, 100)
      })
    }, 150)

    // Track page load completion
    const handleResourcesLoaded = () => {
      setResourcesLoaded(true)
    }

    // Check if page is already loaded
    if (document.readyState === "complete") {
      handleResourcesLoaded()
    } else {
      window.addEventListener("load", handleResourcesLoaded)
    }

    // Ensure minimum display time
    const timer = setTimeout(() => {
      setMinTimeElapsed(true)
    }, minimumDisplayTime)

    return () => {
      window.removeEventListener("load", handleResourcesLoaded)
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [minimumDisplayTime])

  // Hide loader when both conditions are met
  useEffect(() => {
    if (progress >= 100 && minTimeElapsed) {
      const finalTimer = setTimeout(() => {
        setIsLoading(false)
        if (onLoadingComplete) {
          onLoadingComplete()
        }
      }, 500) // Small delay after reaching 100%

      return () => clearTimeout(finalTimer)
    }
  }, [progress, minTimeElapsed, onLoadingComplete])

  // Animation variants
  const containerVariants = {
    exit: {
      opacity: 0,
      transition: { duration: 0.5 },
    },
  }

  const glassesVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  // Animation for the lens shine effect
  const shineVariants = {
    animate: {
      opacity: [0, 1, 0],
      pathLength: [0, 1, 0],
      transition: {
        duration: 1.8,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
  }

  if (!isLoading) return null

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-background"
      exit="exit"
      variants={containerVariants}
    >
      <motion.div initial="initial" animate="animate" variants={glassesVariants} className="relative">
        {/* Custom Glasses SVG */}
        <svg width="125" height="45.01" viewBox="0 0 125 45.01" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M124.83,6.64a8,8,0,0,0-3.5-4.71c-2.4-1.38-22.38-1.73-22.58-1.73s-0.15,0-.25,0c-0.55,0-1.05-.12-1.63-0.15-1.05,0-2.28-.1-3.65-0.1-4.58,0-12.6.47-18.85,3.25l-7,1.08a40,40,0,0,1-9.7,0l-7-1.08c-6.25-2.81-14.28-3.25-18.85-3.25-1.38,0-2.63,0-3.65.1-0.58,0-1.13.1-1.68,0.15l-0.17,0c-0.2,0-20.15.34-22.58,1.72a8.12,8.12,0,0,0-3.5,4.7,5.17,5.17,0,0,0,.67,4.21c0.92,1.43,4.37,8.67,6.35,12.88,0,0.07.1,0.12,0.13,0.2a65.14,65.14,0,0,0,2.37,9.85c2.3,7.22,10.9,11.21,24.18,11.21a67,67,0,0,0,7-.37,18.11,18.11,0,0,0,12.25-6c4.13-4.51,6.4-11.92,6.43-20.61l1.63-1.11a2.81,2.81,0,0,1,2.65,0l1.63,1.11c0,8.69,2.3,16.11,6.42,20.62a18,18,0,0,0,12.25,6,67.39,67.39,0,0,0,7,.37c13.28,0,21.88-4,24.18-11.2a65.84,65.84,0,0,0,2.38-9.85,0.86,0.86,0,0,0,.13-0.2c2-4.21,5.43-11.45,6.35-12.88A5.33,5.33,0,0,0,124.83,6.64ZM49.36,35.28a13.06,13.06,0,0,1-9,4.37,64,64,0,0,1-6.51,.35c-5.09,0-17.16-.75-19.36-7.64a61.69,61.69,0,0,1-3-17,7.22,7.22,0,0,1,2.74-5.69c2.89-2.6,7.75-4.17,14.09-4.54,1,0,2.1-.1,3.37-.1,3.29,0,11.28,.3,16.85,2.8,0,0,0,0,.05,0,3.19,1.45,5.6,3.65,5.8,7C54.96,23.7,53.11,31.16,49.36,35.28Zm64.08-19.95a60.52,60.52,0,0,1-2.94,17c-2.21,6.89-14.27,7.64-19.37,7.64a64.54,64.54,0,0,1-6.54-.35,13.12,13.12,0,0,1-9-4.37c-3.75-4.12-5.6-11.58-5-20.5,0.2-3.32,2.59-5.49,5.81-7,0,0,0,0,.05,0,5.58-2.52,13.56-2.79,16.86-2.79,1.27,0,2.41,0,3.37,.1,8.8,.53,12.93,3.15,14.83,5.29A6.84,6.84,0,0,1,113.44,15.33Z"
            className="fill-foreground/80"
          />

          {/* Add shine effects to the lenses */}
          <motion.path
            d="M30 20C40 10 45 30 30 25"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={shineVariants.animate}
          />

          <motion.path
            d="M95 20C105 10 110 30 95 25"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={shineVariants.animate}
          />
        </svg>
      </motion.div>

      {/* App name */}
      <motion.h1
        className="text-3xl font-bold mt-6 text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        wearables.ai
      </motion.h1>

      {/* Progress indicator */}
      <div className="w-48 bg-muted rounded-full h-1.5 mt-4">
        <motion.div
          className="bg-primary h-1.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.5, 1, 0.5],
          transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
        }}
        className="mt-3 text-muted-foreground text-sm"
      >
        Loading your perfect frames...
      </motion.p>
    </motion.div>
  )
}
