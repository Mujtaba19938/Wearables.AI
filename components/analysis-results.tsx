"use client"

import { useState } from "react"
import { Check, ChevronRight, Info } from "lucide-react"
import Link from "next/link"
import { FaceImageViewer } from "./face-image-viewer"
import type { AnalysisMode } from "./analysis-mode-selector"

interface AnalysisResultsProps {
  faceShape: string
  confidence?: number
  alternativeShapes?: Array<{ shape: string; score: number }>
  measurements: any
  landmarks: any
  imageData: string
  analysisMode: AnalysisMode
}

export function AnalysisResults({
  faceShape,
  confidence = 0,
  alternativeShapes = [],
  measurements,
  landmarks,
  imageData,
  analysisMode,
}: AnalysisResultsProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Frame recommendations based on face shape
  const recommendations = {
    Round: ["Square", "Rectangle", "Wayfarer"],
    Square: ["Round", "Oval", "Aviator"],
    Oval: ["Wayfarer", "Rectangle", "Cat-Eye"],
    Heart: ["Round", "Oval", "Cat-Eye"],
    Diamond: ["Oval", "Wayfarer", "Cat-Eye"],
    Oblong: ["Round", "Square", "Aviator"],
    Triangle: ["Aviator", "Cat-Eye", "Rectangle"],
    Pear: ["Round", "Oval", "Wayfarer"],
  }

  const frameStyles = recommendations[faceShape as keyof typeof recommendations] || ["Wayfarer", "Round", "Rectangle"]

  // Face shape descriptions
  const faceShapeDescriptions = {
    Round: "soft curves with similar width and length, and full cheeks.",
    Square: "strong jawline and forehead with similar width and length, creating an angular appearance.",
    Oval: "balanced proportions with a slightly narrower jawline than forehead, considered the most versatile shape.",
    Heart: "a wider forehead and narrower jawline, often with a pointed chin and high cheekbones.",
    Diamond: "high, dramatic cheekbones with narrower forehead and jawline, creating a diamond-like silhouette.",
    Oblong: "a face longer than it is wide with a long, straight cheek line and similar width throughout.",
    Triangle: "a narrow forehead that widens at the jawline, creating an inverted triangle shape.",
    Pear: "a narrow forehead with a wider jawline, similar to a triangle but with more rounded features.",
  }

  const description =
    faceShapeDescriptions[faceShape as keyof typeof faceShapeDescriptions] ||
    "balanced proportions that work well with many eyeglass styles."

  const isFallbackMode = landmarks.length < 68

  // Ensure confidence is a number between 0-100
  const displayConfidence = typeof confidence === "number" ? Math.min(100, Math.max(0, Math.round(confidence))) : 0

  return (
    <div className="w-full">
      {isFallbackMode && (
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3 mb-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-200 font-medium">Simplified Analysis</span>
          </div>
          <p className="text-yellow-300/80">
            Your device is using a simplified analysis mode that provides estimated results. For the most accurate face
            shape analysis, try using a desktop browser like Chrome or Edge.
          </p>
        </div>
      )}
      <div className="bg-card p-4 sm:p-6 rounded-xl border border-border mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
          <div className="w-full sm:w-40 sm:h-40 rounded-lg overflow-hidden flex-shrink-0">
            <FaceImageViewer imageData={imageData} landmarks={landmarks} measurements={measurements} />
            {analysisMode === "extensive" && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                Toggle the eye icon to view facial landmarks
              </p>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 justify-center sm:justify-start">
              <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
                Your Face Shape: <span className="text-[#3B82F6]">{faceShape}</span>
              </h2>

              {analysisMode === "extensive" && (
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {isFallbackMode ? "Estimate" : "Confidence"}:
                  </span>
                  <span
                    className={`font-medium ${
                      displayConfidence > 75
                        ? "text-green-600 dark:text-green-400"
                        : displayConfidence > 50
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {displayConfidence}%
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4">
              Based on our analysis, you have a {faceShape.toLowerCase()} face shape. This shape is characterized by{" "}
              {description}
            </p>

            {alternativeShapes && alternativeShapes.length > 1 && analysisMode === "extensive" && (
              <div className="mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <Info className="w-3 h-3" />
                  <span>Alternative face shape matches:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {alternativeShapes.slice(1, 3).map((alt, index) => (
                    <div key={index} className="bg-muted px-2 py-1 rounded text-xs flex items-center gap-1">
                      <span>{alt.shape}</span>
                      <span className="text-gray-500 dark:text-gray-400">({Math.round(alt.score)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysisMode === "extensive" && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-[#3B82F6] text-sm mb-2"
              >
                {showDetails ? "Hide" : "Show"} measurement details
                <ChevronRight className={`w-4 h-4 transition-transform ${showDetails ? "rotate-90" : ""}`} />
              </button>
            )}

            {showDetails && analysisMode === "extensive" && (
              <div className="bg-muted p-3 rounded-lg mb-4 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Width/Height Ratio:</p>
                    <p>{measurements.widthToHeightRatio.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Forehead/Jaw Ratio:</p>
                    <p>{measurements.foreheadToJawRatio.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Cheekbone/Jaw Ratio:</p>
                    <p>{measurements.cheekboneToJawRatio.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Jaw Angularity:</p>
                    <p>{measurements.jawAngularity.toFixed(1)}°</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card p-4 sm:p-6 rounded-xl border border-border mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold mb-3">Recommended Frame Styles</h3>

        <div className="space-y-3">
          {frameStyles.map((style, index) => (
            <div key={index} className="flex items-center gap-3 bg-muted p-3 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#1a1f36] flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div>
                <p className="font-medium">{style}</p>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">
                  {style === "Square" && "Bold frames with angular lines to contrast with your softer features."}
                  {style === "Rectangle" && "Structured frames that add definition and angles to your face."}
                  {style === "Round" && "Circular frames that soften angular features and add balance."}
                  {style === "Oval" &&
                    "Balanced frames that complement most face shapes with their proportional design."}
                  {style === "Wayfarer" && "Classic slightly angular frames that add structure and definition."}
                  {style === "Cat-Eye" && "Upswept frames that highlight cheekbones and add contrast."}
                  {style === "Aviator" && "Teardrop shaped frames that balance wider foreheads and add curves."}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/frames"
          className="mt-4 w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
        >
          Browse Recommended Frames
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}

export default AnalysisResults
