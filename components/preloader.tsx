"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import LogoAnimation from "./logo-animation"

interface PreloaderProps {
  onLoadingComplete: () => void
}

export function Preloader({ onLoadingComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [showLogo, setShowLogo] = useState(true)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)

          // After progress reaches 100%, wait a bit before transitioning out
          setTimeout(() => {
            setShowLogo(false)

            // After logo animation completes, signal loading is complete
            setTimeout(onLoadingComplete, 1000)
          }, 500)

          return 100
        }
        return newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  return (
    <AnimatePresence mode="wait">
      {showLogo && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Background with gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Animated particles in background */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/20"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
                animate={{
                  y: [null, Math.random() * -200 - 100],
                  opacity: [null, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  width: `${Math.random() * 30 + 10}px`,
                  height: `${Math.random() * 30 + 10}px`,
                }}
              />
            ))}
          </div>

          {/* Main content container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo animation */}
            <div className="relative mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2,
                }}
              >
                <LogoAnimation size={120} color="white" animated={true} />
              </motion.div>
            </div>

            {/* App name */}
            <motion.h1
              className="text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              wearables.ai
            </motion.h1>

            <motion.p
              className="text-white/80 text-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Face Shape Analyzer
            </motion.p>

            {/* Progress bar */}
            <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>

            {/* Loading text */}
            <motion.p
              className="text-white/70 text-sm mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {progress < 100 ? "Loading your experience..." : "Ready!"}
            </motion.p>
          </div>

          {/* Animated face outline that morphs between different face shapes */}
          <div className="absolute bottom-10 w-full flex justify-center">
            <motion.div
              className="relative w-32 h-32"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white/30"
              >
                <motion.path
                  d="M50 10 C25 10, 10 30, 10 50 C10 75, 25 90, 50 90 C75 90, 90 75, 90 50 C90 30, 75 10, 50 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{
                    d: [
                      "M50 10 C25 10, 10 30, 10 50 C10 75, 25 90, 50 90 C75 90, 90 75, 90 50 C90 30, 75 10, 50 10", // Oval
                      "M50 10 C30 10, 10 30, 10 50 C10 70, 30 90, 50 90 C70 90, 90 70, 90 50 C90 30, 70 10, 50 10", // Round
                      "M30 10 C20 10, 10 20, 10 40 C10 70, 20 90, 50 90 C80 90, 90 70, 90 40 C90 20, 80 10, 70 10", // Heart
                      "M50 10 C25 10, 10 30, 10 50 C10 75, 25 90, 50 90 C75 90, 90 75, 90 50 C90 30, 75 10, 50 10", // Back to Oval
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                  fill="none"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
