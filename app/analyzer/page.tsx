"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, Info, Sliders, BarChart2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export default function AnalyzerPage() {
  const [analysisMode, setAnalysisMode] = useState<"camera" | "upload">("camera")
  const [analysisType, setAnalysisType] = useState<"simple" | "detailed">("simple")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  // Only show the theme toggle after mounting to avoid hydration mismatch

  const initCamera = async () => {
    try {
      if (streamRef.current) {
        stopCamera()
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              setCameraActive(true)
            })
          }
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setCameraActive(false)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageDataUrl)
        stopCamera()
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setCapturedImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const resetCapture = () => {
    setCapturedImage(null)
    if (analysisMode === "camera") {
      initCamera()
    }
  }

  const startAnalysis = () => {
    if (!capturedImage) {
      if (analysisMode === "camera") {
        captureImage()
        return
      } else {
        // Trigger file input click
        fileInputRef.current?.click()
        return
      }
    }

    setIsAnalyzing(true)

    // Simulate analysis process with different durations based on analysis type
    const analysisDuration = analysisType === "simple" ? 2000 : 4000

    setTimeout(() => {
      setIsAnalyzing(false)
      // Use router.push instead of window.location.href
      router.push(`/results?result=true&type=${analysisType}`)
    }, analysisDuration)
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
      {/* Theme toggle */}

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Face Shape Analyzer</h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
          Take a photo or upload an image to analyze your face shape and get personalized eyewear recommendations.
        </p>

        {/* Analysis mode selector */}
        <div className="flex gap-4 mb-6 w-full">
          <button
            onClick={() => {
              setAnalysisMode("camera")
              setCapturedImage(null)
            }}
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
            onClick={() => {
              setAnalysisMode("upload")
              setCapturedImage(null)
            }}
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

        {/* Analysis type selector */}
        <div className="w-full mb-8">
          <h2 className="text-lg font-medium mb-3 text-center">Choose Analysis Type</h2>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setAnalysisType("simple")}
              className={`cursor-pointer rounded-lg p-4 border-2 transition-all ${
                analysisType === "simple"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <BarChart2 className={`h-6 w-6 ${analysisType === "simple" ? "text-blue-500" : "text-gray-500"}`} />
                {analysisType === "simple" && (
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
              <h3 className="font-medium mb-1">Simple Analysis</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Quick face shape detection with basic eyewear recommendations.
              </p>
            </div>

            <div
              onClick={() => setAnalysisType("detailed")}
              className={`cursor-pointer rounded-lg p-4 border-2 transition-all ${
                analysisType === "detailed"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sliders className={`h-6 w-6 ${analysisType === "detailed" ? "text-blue-500" : "text-gray-500"}`} />
                {analysisType === "detailed" && (
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
              <h3 className="font-medium mb-1">Detailed Analysis</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Advanced facial feature analysis with comprehensive recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Camera view or upload area */}
        <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
              <button
                onClick={resetCapture}
                className="absolute top-2 right-2 bg-gray-800/70 text-white p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : analysisMode === "camera" ? (
            <>
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
                autoPlay
                playsInline
                muted
              />
              {!cameraActive && (
                <div className="text-center p-4">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Camera access will be requested when you start the analysis
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-4">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-500 dark:text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">Click to select an image from your device</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <label
                htmlFor="image-upload"
                className="mt-4 inline-block py-2 px-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Select Image
              </label>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Analysis features based on type */}
        <div className="w-full mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={analysisType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
            >
              <h3 className="font-medium mb-2">
                {analysisType === "simple" ? "Simple Analysis Features" : "Detailed Analysis Features"}
              </h3>
              <ul className="space-y-2 text-sm">
                {analysisType === "simple" ? (
                  <>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                      <span>Basic face shape detection (oval, round, square, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                      <span>General eyewear style recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                      <span>Quick processing (under 5 seconds)</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                      <span>Advanced face shape analysis with confidence scores</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                      <span>Facial feature measurements (face width, jawline, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                      <span>Personalized frame size recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                      <span>Color palette suggestions based on skin tone</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                      <span>Detailed processing (may take 10-15 seconds)</span>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Photo tips toggle */}
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2"
        >
          <Info className="h-4 w-4" />
          <span>{showTips ? "Hide photo tips" : "Show photo tips"}</span>
        </button>

        {/* Photo tips */}
        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 overflow-hidden"
            >
              <h3 className="font-medium mb-2">For best results:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Ensure good, even lighting on your face</li>
                <li>Remove glasses, hats, and hair covering your face</li>
                <li>Look directly at the camera with a neutral expression</li>
                <li>Use a plain background if possible</li>
                <li>Keep your face centered in the frame</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

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
              <span>{analysisType === "simple" ? "Analyzing Face Shape..." : "Performing Detailed Analysis..."}</span>
            </>
          ) : capturedImage ? (
            <span>Start {analysisType === "simple" ? "Simple" : "Detailed"} Analysis</span>
          ) : (
            <span>{analysisMode === "camera" ? "Capture & Analyze" : "Select & Analyze"}</span>
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
