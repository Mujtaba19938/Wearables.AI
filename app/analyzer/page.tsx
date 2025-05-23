"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Upload, Info, Sliders, BarChart2, ChevronRight, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { loadFaceDetectionModels, detectFaces, analyzeFaceShape, drawFaceLandmarks } from "@/utils/face-detection"
import { useToast } from "@/components/toast-provider"

export default function AnalyzerPage() {
  const [analysisMode, setAnalysisMode] = useState<"camera" | "upload">("camera")
  const [analysisType, setAnalysisType] = useState<"simple" | "detailed">("simple")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [modelsLoading, setModelsLoading] = useState(false)
  const [detectionError, setDetectionError] = useState<string | null>(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [faceAnalysisResult, setFaceAnalysisResult] = useState<any>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const animationRef = useRef<number | null>(null)

  const router = useRouter()
  const { addToast } = useToast()

  // Load face detection models on component mount
  useEffect(() => {
    const loadModels = async () => {
      if (!modelsLoaded && !modelsLoading) {
        setModelsLoading(true)
        try {
          const success = await loadFaceDetectionModels()
          setModelsLoaded(success)
          if (success) {
            addToast("Face detection models loaded successfully", "success")
          } else {
            addToast("Failed to load face detection models", "error")
          }
        } catch (error) {
          console.error("Error loading models:", error)
          addToast("Error loading face detection models", "error")
        } finally {
          setModelsLoading(false)
        }
      }
    }

    loadModels()

    return () => {
      // Clean up animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [addToast, modelsLoaded, modelsLoading])

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
              // Start face detection when camera is active
              startFaceDetection()
            })
          }
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraActive(false)
      setDetectionError("Could not access camera. Please check permissions.")
      addToast("Camera access denied. Please check permissions.", "error")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setCameraActive(false)
    }

    // Stop face detection loop
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }

  // Start face detection loop for live camera
  const startFaceDetection = () => {
    if (!videoRef.current || !overlayCanvasRef.current || !modelsLoaded) return

    const video = videoRef.current
    const canvas = overlayCanvasRef.current

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const detectFacesInVideo = async () => {
      if (!video || !canvas || video.paused || video.ended || !modelsLoaded) {
        return
      }

      try {
        // Detect faces in the video stream
        const detections = await detectFaces(video)

        // Draw landmarks on the overlay canvas
        drawFaceLandmarks(canvas, detections)

        // Update face detected state
        setFaceDetected(detections.length > 0)
        setDetectionError(null)

        // Continue detection loop
        animationRef.current = requestAnimationFrame(detectFacesInVideo)
      } catch (error) {
        console.error("Error in face detection loop:", error)
        setDetectionError("Error detecting faces. Please try again.")
        setFaceDetected(false)
      }
    }

    // Start the detection loop
    detectFacesInVideo()
  }

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Get image data URL
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
        setCapturedImage(imageDataUrl)

        // Stop camera after capturing
        stopCamera()

        // Create an image element for face detection
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = async () => {
          imageRef.current = img
          await analyzeCapturedImage(img)
        }
        img.src = imageDataUrl
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        addToast("Please select an image file", "error")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageData = e.target.result as string
          setCapturedImage(imageData)

          // Create an image element for face detection
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = async () => {
            imageRef.current = img
            await analyzeCapturedImage(img)
          }
          img.src = imageData
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeCapturedImage = async (image: HTMLImageElement) => {
    if (!modelsLoaded) {
      setDetectionError("Face detection models not loaded. Please try again.")
      addToast("Face detection models not loaded", "error")
      return
    }

    try {
      // Detect faces in the image
      const detections = await detectFaces(image)

      if (detections.length === 0) {
        setFaceDetected(false)
        setDetectionError("No face detected. Please try again with a clearer photo.")
        addToast("No face detected in the image", "error")
        return
      }

      // Use the first detected face
      const detection = detections[0]

      // Analyze face shape
      const analysis = analyzeFaceShape(detection.landmarks)

      if (!analysis) {
        setDetectionError("Could not analyze face shape. Please try again.")
        addToast("Face analysis failed", "error")
        return
      }

      // Set face detected and analysis result
      setFaceDetected(true)
      setFaceAnalysisResult(analysis)
      setDetectionError(null)

      // Draw landmarks on canvas if available
      if (overlayCanvasRef.current) {
        const canvas = overlayCanvasRef.current
        canvas.width = image.width
        canvas.height = image.height
        drawFaceLandmarks(canvas, detections)
      }

      console.log("Face analysis result:", analysis)
    } catch (error) {
      console.error("Error analyzing face:", error)
      setFaceDetected(false)
      setDetectionError("Error analyzing face. Please try again.")
      addToast("Face analysis failed", "error")
    }
  }

  const resetCapture = () => {
    setCapturedImage(null)
    setFaceDetected(false)
    setFaceAnalysisResult(null)
    setDetectionError(null)

    if (analysisMode === "camera") {
      initCamera()
    }
  }

  const startAnalysis = async () => {
    if (!capturedImage) {
      if (analysisMode === "camera") {
        if (!faceDetected) {
          addToast("Please ensure your face is clearly visible", "error")
          return
        }
        captureImage()
        return
      } else {
        // Trigger file input click
        fileInputRef.current?.click()
        return
      }
    }

    if (!faceDetected || !faceAnalysisResult) {
      addToast("No face detected or analysis failed. Please try again.", "error")
      return
    }

    setIsAnalyzing(true)

    try {
      // Simulate analysis process with different durations based on analysis type
      const analysisDuration = analysisType === "simple" ? 1500 : 3000

      await new Promise((resolve) => setTimeout(resolve, analysisDuration))

      // Navigate to results page with the analysis result
      router.push(`/results?result=true&type=${analysisType}&faceShape=${faceAnalysisResult.shape}`)
    } catch (error) {
      console.error("Error during analysis:", error)
      addToast("Analysis failed. Please try again.", "error")
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 text-center">Face Shape Analyzer</h1>

        <p className="text-gray-400 mb-6 text-center text-sm">
          Take a photo or upload an image to analyze your face shape and get personalized eyewear recommendations.
        </p>

        {/* Analysis mode selector */}
        <div className="flex gap-3 mb-6 w-full">
          <button
            onClick={() => {
              setAnalysisMode("camera")
              setCapturedImage(null)
              setFaceDetected(false)
              setFaceAnalysisResult(null)
              setDetectionError(null)
            }}
            className={`flex-1 py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
              analysisMode === "camera" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Camera</span>
          </button>
          <button
            onClick={() => {
              setAnalysisMode("upload")
              setCapturedImage(null)
              setFaceDetected(false)
              setFaceAnalysisResult(null)
              setDetectionError(null)
            }}
            className={`flex-1 py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
              analysisMode === "upload" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </button>
        </div>

        <h2 className="text-sm font-medium mb-3 text-center">Choose Analysis Type</h2>

        {/* Analysis type selector */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div
            onClick={() => setAnalysisType("simple")}
            className={`cursor-pointer rounded-md p-4 border transition-all ${
              analysisType === "simple"
                ? "border-blue-500 bg-[#1e293b]"
                : "border-gray-700 bg-[#1e293b]/50 hover:bg-[#1e293b]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <BarChart2 className={`h-5 w-5 ${analysisType === "simple" ? "text-blue-500" : "text-gray-400"}`} />
              {analysisType === "simple" && (
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
            <h3 className="font-medium text-sm mb-1">Simple Analysis</h3>
            <p className="text-xs text-gray-400">Quick face shape detection with basic eyewear recommendations.</p>
          </div>

          <div
            onClick={() => setAnalysisType("detailed")}
            className={`cursor-pointer rounded-md p-4 border transition-all ${
              analysisType === "detailed"
                ? "border-blue-500 bg-[#1e293b]"
                : "border-gray-700 bg-[#1e293b]/50 hover:bg-[#1e293b]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sliders className={`h-5 w-5 ${analysisType === "detailed" ? "text-blue-500" : "text-gray-400"}`} />
              {analysisType === "detailed" && (
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
            <h3 className="font-medium text-sm mb-1">Detailed Analysis</h3>
            <p className="text-xs text-gray-400">
              Advanced facial feature analysis with comprehensive recommendations.
            </p>
          </div>
        </div>

        {/* Camera view or upload area */}
        <div className="w-full aspect-square bg-[#1e293b] rounded-md mb-6 flex items-center justify-center overflow-hidden relative">
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
              <canvas ref={overlayCanvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
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

              {/* Face detection status */}
              {faceDetected && (
                <div className="absolute bottom-2 left-2 bg-green-500/80 text-white px-2 py-1 rounded-md text-xs flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Face Detected
                </div>
              )}

              {detectionError && (
                <div className="absolute bottom-2 left-2 bg-red-500/80 text-white px-2 py-1 rounded-md text-xs flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {detectionError}
                </div>
              )}
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
              <canvas ref={overlayCanvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
              {!cameraActive && (
                <div className="text-center p-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-600 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm">
                    {modelsLoading
                      ? "Loading face detection models..."
                      : "Camera access will be requested when you start the analysis"}
                  </p>
                  {!modelsLoaded && !modelsLoading && (
                    <button
                      onClick={() => loadFaceDetectionModels()}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Load Face Detection Models
                    </button>
                  )}
                </div>
              )}

              {/* Face detection status for camera */}
              {cameraActive && (
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs flex items-center">
                  {faceDetected ? (
                    <div className="bg-green-500/80 text-white px-2 py-1 rounded-md flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Face Detected
                    </div>
                  ) : (
                    <div className="bg-yellow-500/80 text-white px-2 py-1 rounded-md flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Position your face in the frame
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-600 flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm">Click to select an image from your device</p>
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
                className="mt-4 inline-block py-2 px-4 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Select Image
              </label>

              {!modelsLoaded && !modelsLoading && (
                <button
                  onClick={() => loadFaceDetectionModels()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md block mx-auto"
                >
                  Load Face Detection Models
                </button>
              )}

              {modelsLoading && <p className="mt-2 text-blue-400 text-sm">Loading face detection models...</p>}
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Analysis features based on type */}
        <div className="w-full mb-4 bg-[#1e293b] p-4 rounded-md">
          <h3 className="font-medium text-sm mb-2">
            {analysisType === "simple" ? "Simple Analysis Features" : "Detailed Analysis Features"}
          </h3>
          <ul className="space-y-2 text-sm">
            {analysisType === "simple" ? (
              <>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                  <span className="text-gray-300">Basic face shape detection (oval, round, square, etc.)</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                  <span className="text-gray-300">General eyewear style recommendations</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                  <span className="text-gray-300">Quick processing (under 5 seconds)</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                  <span className="text-gray-300">Advanced face shape analysis with confidence scores</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                  <span className="text-gray-300">Facial feature measurements (face width, jawline, etc.)</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                  <span className="text-gray-300">Personalized frame size recommendations</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                  <span className="text-gray-300">Color palette suggestions based on skin tone</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                  <span className="text-gray-300">Detailed processing (may take 10-15 seconds)</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Photo tips toggle */}
        <button onClick={() => setShowTips(!showTips)} className="flex items-center gap-2 text-blue-400 mb-2 text-sm">
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
              className="w-full bg-[#1e293b] p-4 rounded-md mb-4 overflow-hidden"
            >
              <h3 className="font-medium text-sm mb-2">For best results:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
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
        <p className="text-xs text-gray-500 mb-6 text-center">
          <strong className="text-gray-400">Privacy:</strong> Your photos are processed locally on your device and are
          not stored or sent to any server.
        </p>

        {/* Start analysis button */}
        <button
          onClick={startAnalysis}
          disabled={isAnalyzing || (!capturedImage && analysisMode === "upload") || modelsLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{analysisType === "simple" ? "Analyzing Face Shape..." : "Performing Detailed Analysis..."}</span>
            </>
          ) : modelsLoading ? (
            <span>Loading Face Detection Models...</span>
          ) : capturedImage ? (
            <span>Start {analysisType === "simple" ? "Simple" : "Detailed"} Analysis</span>
          ) : (
            <span>Capture & Analyze</span>
          )}
        </button>

        {/* Back link */}
        <Link href="/" className="mt-6 text-gray-400 hover:text-gray-200 transition-colors text-sm">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
