"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Smartphone } from "lucide-react"
import { useHaptic } from "@/hooks/use-haptic"

export default function SwipeTutorial() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { isSupported, triggerSelection } = useHaptic()

  useEffect(() => {
    // Check if the tutorial has been shown before
    const hasSeenTutorial = localStorage.getItem("hasSeenSwipeTutorial") === "true"

    if (!hasSeenTutorial && !dismissed) {
      // Show tutorial after a short delay
      const timer = setTimeout(() => {
        setVisible(true)
        // Trigger haptic feedback when tutorial appears
        if (isSupported) {
          triggerSelection()
        }
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [dismissed, isSupported, triggerSelection])

  const handleDismiss = () => {
    setVisible(false)
    setDismissed(true)
    localStorage.setItem("hasSeenSwipeTutorial", "true")

    // Trigger haptic feedback when dismissing
    if (isSupported) {
      triggerSelection()
    }
  }

  if (!visible) return null

  return (
    <motion.div
      className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="bg-gray-800/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-700/50 max-w-sm relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          aria-label="Close tutorial"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-white font-medium">New Feature: Swipe Navigation</h3>
          {isSupported && (
            <div className="flex items-center gap-1 text-blue-400">
              <Smartphone className="w-4 h-4" />
              <span className="text-xs">📳</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 my-3">
          <div className="flex items-center text-gray-300">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Previous</span>
          </div>

          <motion.div
            className="w-16 h-1 bg-blue-500 rounded-full"
            animate={{
              x: [0, -10, 0, 10, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
          />

          <div className="flex items-center text-gray-300">
            <span>Next</span>
            <ChevronRight className="w-5 h-5 ml-1" />
          </div>
        </div>

        <p className="text-gray-300 text-sm">
          Swipe left or right to navigate between sections of the app.
          {isSupported && (
            <span className="block mt-1 text-blue-300 text-xs">✨ Feel the haptic feedback as you swipe!</span>
          )}
        </p>
      </div>
    </motion.div>
  )
}
