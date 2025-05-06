"use client"

import { useState, useEffect, useRef } from "react"
import { FaceLandmarksVisualization } from "./face-landmarks-visualization"
import { Eye, EyeOff } from "lucide-react"
import { shouldUseStandaloneAnalyzer } from "@/utils/mobile-detector"

interface FaceImageViewerProps {
  imageData: string
  landmarks: Array<{ x: number; y: number }>
  measurements: {
    faceWidth: number
    faceHeight: number
    foreheadWidth: number
    cheekboneWidth: number
    jawWidth: number
    chinWidth: number
    [key: string]: number
  }
}

export function FaceImageViewer({ imageData, landmarks, measurements }: FaceImageViewerProps) {
  const [showLandmarks, setShowLandmarks] = useState(false)
  const usingStandaloneMode = shouldUseStandaloneAnalyzer()
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const touchStartRef = useRef(0)
  const touchEndRef = useRef(0)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.targetTouches[0].clientX
      setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndRef.current = e.targetTouches[0].clientX
      setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
      if (touchStartRef.current - touchEndRef.current > 100) {
        // Left swipe - show landmarks
        setShowLandmarks(true)
      }

      if (touchStartRef.current - touchEndRef.current < -100) {
        // Right swipe - hide landmarks
        setShowLandmarks(false)
      }
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  return (
    <div className="relative">
      <div className="rounded-lg overflow-hidden">
        {showLandmarks ? (
          <FaceLandmarksVisualization imageData={imageData} landmarks={landmarks} measurements={measurements} />
        ) : (
          <img
            src={imageData || "/placeholder.svg"}
            alt="Face analysis"
            className="w-full h-auto object-cover rounded-lg"
          />
        )}
      </div>
      <button
        onClick={() => setShowLandmarks(!showLandmarks)}
        onTouchStart={() => {}} // This prevents delay on mobile touch
        className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors touch-target"
        aria-label={showLandmarks ? "Hide landmarks" : "Show landmarks"}
      >
        {showLandmarks ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      {usingStandaloneMode && !showLandmarks && (
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs text-white">
          Simplified Mode
        </div>
      )}
    </div>
  )
}
