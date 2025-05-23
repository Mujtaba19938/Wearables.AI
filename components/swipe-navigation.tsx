"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, useAnimation, type PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useHaptic } from "@/hooks/use-haptic"

interface SwipeNavigationProps {
  children: ReactNode
}

export default function SwipeNavigation({ children }: SwipeNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const controls = useAnimation()
  const { trigger, triggerSelection, triggerImpact, isSupported } = useHaptic()

  const [dragStartX, setDragStartX] = useState(0)
  const [showIndicator, setShowIndicator] = useState<"left" | "right" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasTriggeredFeedback, setHasTriggeredFeedback] = useState(false)
  const [lastIndicatorState, setLastIndicatorState] = useState<"left" | "right" | null>(null)

  // Define the navigation routes in order
  const routes = ["/", "/guide", "/frames", "/about"]

  // Get current route index
  const getCurrentRouteIndex = () => {
    // Handle nested routes (like /frames/something)
    const baseRoute = `/${pathname.split("/")[1]}`
    const exactMatch = routes.findIndex((route) => route === pathname)

    if (exactMatch !== -1) return exactMatch

    // For nested routes, find the parent route
    return routes.findIndex((route) => route !== "/" && pathname.startsWith(route))
  }

  const currentIndex = getCurrentRouteIndex()

  // Determine if we can navigate in a direction
  const canNavigatePrev = currentIndex > 0
  const canNavigateNext = currentIndex < routes.length - 1 && currentIndex !== -1

  // Handle swipe gesture
  const handleDragStart = (_: any, info: PanInfo) => {
    setDragStartX(info.point.x)
    setHasTriggeredFeedback(false)

    // Light haptic feedback when starting to drag
    trigger("light")
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    const dragEndX = info.point.x
    const dragDistance = dragEndX - dragStartX

    // Only navigate if the drag distance is significant
    if (Math.abs(dragDistance) > 100) {
      if (dragDistance > 0 && canNavigatePrev) {
        // Swiped right - go to previous route
        triggerImpact() // Strong feedback for successful navigation
        navigateTo(routes[currentIndex - 1])
      } else if (dragDistance < 0 && canNavigateNext) {
        // Swiped left - go to next route
        triggerImpact() // Strong feedback for successful navigation
        navigateTo(routes[currentIndex + 1])
      } else {
        // Reset position if we can't navigate - medium feedback for blocked action
        trigger("medium")
        controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } })
      }
    } else {
      // Reset position if the drag wasn't far enough - light feedback
      trigger("light")
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } })
    }

    setShowIndicator(null)
    setLastIndicatorState(null)
    setHasTriggeredFeedback(false)
  }

  const handleDrag = (_: any, info: PanInfo) => {
    const dragDistance = info.point.x - dragStartX

    // Show direction indicator based on drag direction and if we can navigate
    let newIndicatorState: "left" | "right" | null = null

    if (dragDistance > 50 && canNavigatePrev) {
      newIndicatorState = "left"
    } else if (dragDistance < -50 && canNavigateNext) {
      newIndicatorState = "right"
    }

    // Trigger selection feedback when indicator state changes
    if (newIndicatorState !== lastIndicatorState && newIndicatorState !== null && !hasTriggeredFeedback) {
      triggerSelection()
      setHasTriggeredFeedback(true)
    }

    setShowIndicator(newIndicatorState)
    setLastIndicatorState(newIndicatorState)

    // Trigger feedback when reaching the threshold for navigation
    if (Math.abs(dragDistance) > 100 && !hasTriggeredFeedback) {
      if ((dragDistance > 0 && canNavigatePrev) || (dragDistance < 0 && canNavigateNext)) {
        trigger("medium") // Medium feedback when reaching navigation threshold
        setHasTriggeredFeedback(true)
      }
    }

    // Limit drag distance and add resistance at edges
    let dragX = dragDistance
    if ((dragDistance > 0 && !canNavigatePrev) || (dragDistance < 0 && !canNavigateNext)) {
      dragX = dragDistance / 3 // Add resistance

      // Trigger light feedback when hitting resistance (but not too frequently)
      if (Math.abs(dragDistance) > 80 && !hasTriggeredFeedback) {
        trigger("light")
        setHasTriggeredFeedback(true)
      }
    }

    // Limit maximum drag distance
    const maxDrag = 150
    if (Math.abs(dragX) > maxDrag) {
      dragX = dragX > 0 ? maxDrag : -maxDrag
    }

    controls.set({ x: dragX })
  }

  const navigateTo = (route: string) => {
    if (isAnimating) return

    setIsAnimating(true)

    // Determine animation direction
    const direction = routes.indexOf(route) > currentIndex ? -1 : 1

    // Animate out
    controls
      .start({
        x: direction * window.innerWidth * 0.3,
        opacity: 0.5,
        transition: { duration: 0.2 },
      })
      .then(() => {
        router.push(route)

        // Reset position immediately for the new page
        controls.set({ x: -direction * window.innerWidth * 0.3, opacity: 0.5 })

        // Animate in
        controls
          .start({
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 30 },
          })
          .then(() => {
            setIsAnimating(false)
            // Light feedback when navigation completes
            trigger("light")
          })
      })
  }

  // Reset animation when route changes externally
  useEffect(() => {
    controls.set({ x: 0, opacity: 1 })
  }, [pathname, controls])

  return (
    <div className="relative overflow-hidden w-full h-full">
      {/* Direction indicators */}
      <div
        className={`fixed top-1/2 left-4 z-40 transform -translate-y-1/2 transition-all duration-200 ${
          showIndicator === "left" ? "opacity-70 scale-110" : "opacity-0 scale-100"
        }`}
      >
        <div className="bg-gray-800/80 rounded-full p-3 shadow-lg">
          <ChevronLeft className="w-6 h-6 text-white" />
        </div>
      </div>

      <div
        className={`fixed top-1/2 right-4 z-40 transform -translate-y-1/2 transition-all duration-200 ${
          showIndicator === "right" ? "opacity-70 scale-110" : "opacity-0 scale-100"
        }`}
      >
        <div className="bg-gray-800/80 rounded-full p-3 shadow-lg">
          <ChevronRight className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Main content with swipe detection */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="w-full h-full touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  )
}
