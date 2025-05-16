"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Camera, Upload, Info } from "lucide-react"
import Link from "next/link"

export default function AnalyzerPage() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [analysisMode, setAnalysisMode] = useState<"camera" | "upload">("camera")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showTips, setShowTips] = useState(false)

  // Only show the theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const startAnalysis = () => {
    setIsAnalyzing(true)
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false)
      // Redirect to results page or show results
      window.location.href = "/?result=true"
    }, 3000)
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
      {/* Theme toggle */}
      {mounted && (
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      )}

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Face Shape Analyzer</h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
          Take a photo or upload an image to analyze your face shape and get personalized eyewear recommendations.
        </p>

        {/* Analysis mode selector */}
        <div className="flex gap-4 mb-8 w-full">
          <button
            onClick={() => setAnalysisMode("camera")}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              analysisMode === "camera"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            }`}
          >
            <Camera className="h-5 w-5" />
            <span>Camera</span>
          </button>
          <button
            onClick={() => setAnalysisMode("upload")}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              analysisMode === "upload"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            }`}
          >
            <Upload className="h-5 w-5" />
            <span>Upload</span>
          </button>
        </div>

        {/* Camera view or upload area */}
        <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
          {analysisMode === "camera" ? (
            <div className="text-center p-4">
              <Camera className="h-12 w-12 mx-auto mb-4 text-gray-500 dark:text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                Camera access will be requested when you start the analysis
              </p>
            </div>
          ) : (
            <div className="text-center p-4">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-500 dark:text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">Click to select an image from your device</p>
              <input type="file" accept="image/*" className="hidden" id="image-upload" />
              <label
                htmlFor="image-upload"
                className="mt-4 inline-block py-2 px-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Select Image
              </label>
            </div>
          )}
        </div>

        {/* Photo tips toggle */}
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-6"
        >
          <Info className="h-4 w-4" />
          <span>{showTips ? "Hide photo tips" : "Show photo tips"}</span>
        </button>

        {/* Photo tips */}
        {showTips && (
          <div className="w-full bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">For best results:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Ensure good, even lighting on your face</li>
              <li>Remove glasses, hats, and hair covering your face</li>
              <li>Look directly at the camera with a neutral expression</li>
              <li>Use a plain background if possible</li>
              <li>Keep your face centered in the frame</li>
            </ul>
          </div>
        )}

        {/* Privacy notice */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 text-center">
          <strong>Privacy:</strong> Your photos are processed locally on your device and are not stored or sent to any
          server.
        </p>

        {/* Start analysis button */}
        <button
          onClick={startAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Start Analysis</span>
          )}
        </button>

        {/* Back link */}
        <Link
          href="/"
          className="mt-6 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
