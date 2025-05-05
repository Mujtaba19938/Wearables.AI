"use client"

import { useState, useEffect } from "react"
import { FaceAnalyzer } from "@/components/face-analyzer"
import { AnalysisResults } from "@/components/analysis-results"
import { FacialMeasurementsCard } from "@/components/facial-measurements-card"
import { Shield, WifiOff } from "lucide-react"
import { areModelsLoaded } from "@/utils/face-api"

export default function AnalyzerPage() {
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [modelsReady, setModelsReady] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<{
    shape: string
    confidence?: number
    alternativeShapes?: Array<{ shape: string; score: number }>
    measurements: any
    landmarks: any
    imageData: string
  } | null>(null)
  const [usingFallbackMode, setUsingFallbackMode] = useState(false)

  // Check online status and models
  useEffect(() => {
    const checkStatus = () => {
      setIsOffline(!navigator.onLine)
      setModelsReady(areModelsLoaded())
    }

    checkStatus()

    const handleOnlineStatusChange = () => {
      checkStatus()
    }

    window.addEventListener("online", handleOnlineStatusChange)
    window.addEventListener("offline", handleOnlineStatusChange)

    // Check models status periodically
    const interval = setInterval(() => {
      setModelsReady(areModelsLoaded())
    }, 2000)

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange)
      window.removeEventListener("offline", handleOnlineStatusChange)
      clearInterval(interval)
    }
  }, [])

  // Check if using fallback mode
  useEffect(() => {
    const checkFallbackMode = async () => {
      try {
        // Dynamic import to avoid server-side rendering issues
        const { canUseFallbackMode } = await import("@/utils/browser-detection")
        if (typeof canUseFallbackMode === "function") {
          setUsingFallbackMode(canUseFallbackMode())
        }
      } catch (err) {
        console.error("Error checking fallback mode:", err)
      }
    }

    checkFallbackMode()
  }, [])

  const handleAnalysisComplete = (results: {
    shape: string
    confidence?: number
    alternativeShapes?: Array<{ shape: string; score: number }>
    measurements: any
    landmarks: any
    imageData: string
  }) => {
    setAnalysisResults(results)
    setAnalysisComplete(true)
  }

  const resetAnalysis = () => {
    setAnalysisComplete(false)
    setAnalysisResults(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-center">
          {analysisComplete ? "Analysis Results" : "Face Analyzer"}
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 text-center">
          {analysisComplete
            ? "Here are your personalized eyewear recommendations"
            : "Take or upload a photo to analyze your face shape"}
        </p>

        {isOffline && !modelsReady && !analysisComplete && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 text-center">
            <WifiOff className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-red-200 mb-1">Offline Mode Limited</h3>
            <p className="text-sm text-red-300/80">
              You need to connect to the internet at least once to download the face analysis models before using
              offline mode.
            </p>
          </div>
        )}

        {isOffline && modelsReady && !analysisComplete && (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-green-500 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-lg font-bold text-green-200 mb-1">Offline Mode Ready</h3>
            <p className="text-sm text-green-300/80">
              Face analysis models are loaded and ready to use in offline mode.
            </p>
          </div>
        )}

        {analysisComplete && analysisResults ? (
          <>
            <AnalysisResults
              faceShape={analysisResults.shape}
              confidence={analysisResults.confidence}
              alternativeShapes={analysisResults.alternativeShapes}
              measurements={analysisResults.measurements}
              landmarks={analysisResults.landmarks}
              imageData={analysisResults.imageData}
            />

            {/* Add the facial measurements card */}
            <FacialMeasurementsCard measurements={analysisResults.measurements} />

            <button
              onClick={resetAnalysis}
              className="w-full bg-[#1a1f36] hover:bg-[#252b45] text-white py-3 rounded-lg font-medium transition-all duration-300 mt-2"
            >
              Try Another Photo
            </button>
          </>
        ) : (
          <>
            {!analysisComplete && usingFallbackMode && (
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-yellow-500 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-lg font-bold text-yellow-200 mb-1">Using Simplified Analysis</h3>
                <p className="text-sm text-yellow-300/80">
                  Your device is using a simplified face analysis mode with less precise results. For the best
                  experience, try using a desktop browser.
                </p>
              </div>
            )}
            <FaceAnalyzer onAnalysisComplete={handleAnalysisComplete} />

            <div className="flex items-center gap-3 bg-[#0f1117] p-3 sm:p-4 rounded-xl border border-[#1a1c25] mt-4">
              <Shield className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
              <p className="text-xs sm:text-sm text-[#3B82F6]">
                Your privacy is important to us. All analysis is done on-device.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
