"use client"

import { useAnimationStore } from "@/store/animation-store"
import { Sparkles, Waves, Palette, Circle, X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function AnimationStyleButton() {
  const { style, setStyle } = useAnimationStore()
  const [showTooltip, setShowTooltip] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0)

  // Animation style icons and labels
  const animationStyles = [
    { type: "particles", icon: <Sparkles className="h-4 w-4" />, label: "Particles" },
    { type: "waves", icon: <Waves className="h-4 w-4" />, label: "Waves" },
    { type: "gradient", icon: <Palette className="h-4 w-4" />, label: "Gradient" },
    { type: "bubbles", icon: <Circle className="h-4 w-4" />, label: "Bubbles" },
    { type: "none", icon: <X className="h-4 w-4" />, label: "None" },
  ] as const

  // Update current style index when style changes
  useEffect(() => {
    const index = animationStyles.findIndex((s) => s.type === style)
    if (index !== -1) {
      setCurrentStyleIndex(index)
    }
  }, [style])

  const cycleAnimation = () => {
    setAnimating(true)

    // Get next style in the cycle
    const nextIndex = (currentStyleIndex + 1) % animationStyles.length
    const nextStyle = animationStyles[nextIndex].type

    console.log(`Changing animation from ${style} to ${nextStyle}`)
    setStyle(nextStyle)
    setCurrentStyleIndex(nextIndex)

    // Reset animating state after animation completes
    setTimeout(() => setAnimating(false), 300)
  }

  const currentStyle = animationStyles[currentStyleIndex]

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={cycleAnimation}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-8 h-8 rounded-full bg-slate-200/20 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-300/20 dark:border-slate-600/30 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200/30 dark:hover:bg-slate-600/50 transition-all duration-200"
        aria-label="Change animation style"
        whileTap={{ scale: 0.95 }}
        animate={animating ? { rotate: 360 } : {}}
        transition={{ duration: 0.3 }}
      >
        {currentStyle.icon}

        {/* Pulse effect when changing */}
        <AnimatePresence>
          {animating && (
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-500/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            {currentStyle.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AnimationStyleButton
