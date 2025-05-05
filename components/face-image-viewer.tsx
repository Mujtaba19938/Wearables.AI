"use client"

import { useState } from "react"
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
        className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors"
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
