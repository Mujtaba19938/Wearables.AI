"use client"

import { useState } from "react"
import { useAnimationStore } from "@/store/animation-store"
import { Sparkles, Waves, Shapes, Stars, Minimize } from "lucide-react"

export function AnimationStyleButton() {
  const { animationStyle, cycleAnimationStyle } = useAnimationStore()
  const [isHovered, setIsHovered] = useState(false)

  const getIcon = () => {
    switch (animationStyle) {
      case "particles":
        return <Sparkles className="w-4 h-4" />
      case "waves":
        return <Waves className="w-4 h-4" />
      case "geometric":
        return <Shapes className="w-4 h-4" />
      case "constellation":
        return <Stars className="w-4 h-4" />
      case "minimal":
        return <Minimize className="w-4 h-4" />
    }
  }

  const getLabel = () => {
    switch (animationStyle) {
      case "particles":
        return "Particles"
      case "waves":
        return "Waves"
      case "geometric":
        return "Geometric"
      case "constellation":
        return "Constellation"
      case "minimal":
        return "Minimal"
    }
  }

  return (
    <button
      onClick={cycleAnimationStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center justify-center gap-2 py-2 px-4 bg-black/30 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/30 rounded-full text-sm transition-all duration-300 backdrop-blur-sm"
      aria-label="Change animation style"
    >
      {getIcon()}
      <span
        className={`transition-all duration-300 ${isHovered ? "opacity-100 max-w-24" : "opacity-0 max-w-0 overflow-hidden"}`}
      >
        {getLabel()}
      </span>
    </button>
  )
}
