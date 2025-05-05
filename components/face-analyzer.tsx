"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Upload, Loader2, AlertCircle, WifiOff, RefreshCw } from "lucide-react"
import { loadFaceApiModels, detectFaceShape, initializeFaceApi } from "@/utils/face-api"
import { detectBrowser, canUseFallbackMode } from "@/utils/browser-detection"

interface FaceAnalyzerProps {
  onAnalysisComplete: (result: {
    shape: string
    measurements: any
    landmarks: any
    imageData: string
  }) => void
}

export function FaceAnalyzer({ onAnalysisComplete }: FaceAnalyzerProps) {
  const [mode, setMode] = useState<"camera" | "upload" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelLoading, setModelLoading] = useState(true)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isOffline, setIsOffline] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [initializationComplete, setInitializationComplete] = useState(false)
  const [browserCompatible, setBrowserCompatible] = useState<boolean | null>(null)
  const [usingFallbackMode, setUsingFallbackMode] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize face-api
  useEffect(() => {
    const initialize = async () => {
      try {
        const initialized = initializeFaceApi()
        setInitializationComplete(initialized)
        if (!initialized) {
          setError("Failed to initialize face analysis. Please try using a different browser.")
        }
      } catch (err) {
        console.error("Initialization error:", err)
        setError("Failed to initialize face analysis. Please try using a different browser.")
      }
    }

    initialize()
  }, [])

  // Check browser compatibility
  useEffect(() => {
    const browserInfo = detectBrowser()
    setBrowserCompatible(browserInfo.compatible)

    if (!browserInfo.compatible && canUseFallbackMode()) {
      setUsingFallbackMode(true)
      setModelLoading(false)
      setModelsLoaded(true)
    }
  }, [])

  // Check online status
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOffline(!navigator.onLine)
    }

    // Set initial status
    setIsOffline(!navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnlineStatusChange)
    window.addEventListener("offline", handleOnlineStatusChange)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnlineStatusChange)
      window.removeEventListener("offline", handleOnlineStatusChange)
    }
  }, [])

  // Load face-api models on component mount
  useEffect(() => {
    if (!initializationComplete) return

    const loadModels = async () => {
      try {
        setModelLoading(true)
        await loadFaceApiModels()
        setModelLoading(false)
        setModelsLoaded(true)
      } catch (err) {
        console.error("Error loading models:", err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Failed to load face analysis models. Please try again later.")
        }
        setModelLoading(false)
      }
    }

    loadModels()

    // Clean up function
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [initializationComplete])

  // Start camera when mode is set to camera
  useEffect(() => {
    if (mode === "camera" && videoRef.current && !stream) {
      startCamera()
    }
  }, [mode, stream])

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please check permissions and try again.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const img = new Image()
        img.onload = async () => {
          try {
            const result = await analyzeImage(img)
            onAnalysisComplete({
              ...result,
              imageData: event.target?.result as string,
            })
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message)
            } else {
              setError("An unknown error occurred during analysis")
            }
            setIsLoading(false)
          }
        }
        img.onerror = () => {
          setError("Failed to load the image. Please try another one.")
          setIsLoading(false)
        }
        img.src = event.target?.result as string
      } catch (err) {
        setError("Failed to process the image")
        setIsLoading(false)
      }
    }
    reader.onerror = () => {
      setError("Failed to read the file")
      setIsLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setError(null)
    setIsLoading(true)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (!context) {
        throw new Error("Could not get canvas context")
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Get image data
      const imageData = canvas.toDataURL("image/jpeg")

      // Analyze the captured image
      const result = await analyzeImage(canvas)

      // Stop the camera
      stopCamera()

      // Pass results to parent component
      onAnalysisComplete({
        ...result,
        imageData,
      })
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred during analysis")
      }
      setIsLoading(false)
    }
  }

  const analyzeImage = async (imageElement: HTMLImageElement | HTMLCanvasElement) => {
    try {
      const result = await detectFaceShape(imageElement)
      return result
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          err.message === "No face detected" ? "No face detected. Please try again with a clearer photo." : err.message,
        )
      }
      throw new Error("Failed to analyze face. Please try again.")
    }
  }

  const handleModeSelect = (selectedMode: "camera" | "upload") => {
    if (mode === selectedMode) {
      setMode(null)
      stopCamera()
    } else {
      setMode(selectedMode)
      if (selectedMode === "upload" && stream) {
        stopCamera()
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const retryModelLoading = async () => {
    setError(null)
    setModelLoading(true)
    try {
      await loadFaceApiModels()
      setModelLoading(false)
      setModelsLoaded(true)
    } catch (err) {
      console.error("Error reloading models:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load face analysis models. Please try again later.")
      }
      setModelLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Offline indicator */}
      {isOffline && (
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3 mb-4 flex items-center gap-2">
          <WifiOff className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-yellow-200 text-sm font-medium">You're offline</p>
            <p className="text-yellow-300/70 text-xs">
              {modelsLoaded
                ? "Face analysis will still work offline"
                : "Face analysis requires internet to load models first"}
            </p>
          </div>
        </div>
      )}

      {/* Browser compatibility warning */}
      {browserCompatible === false && !usingFallbackMode && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-200 text-sm font-medium">Browser compatibility issue detected</p>
            <p className="text-red-300/70 text-xs">Please try using a different browser or device.</p>
          </div>
        </div>
      )}

      {/* Fallback mode notice */}
      {usingFallbackMode && (
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-yellow-200 text-sm font-medium">Using simplified detection mode</p>
            <p className="text-yellow-300/70 text-xs">For better results, try using Chrome on desktop.</p>
          </div>
        </div>
      )}

      {/* Face preview area */}
      <div className="aspect-square w-full bg-[#0a0c14] rounded-lg flex items-center justify-center mb-4 sm:mb-6 overflow-hidden relative">
        {modelLoading ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading face analysis models...</p>
            {isOffline && !modelsLoaded && (
              <p className="text-xs text-red-400 mt-2">
                Cannot load models while offline. Please connect to the internet.
              </p>
            )}
          </div>
        ) : mode === "camera" ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : mode === "upload" ? (
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-12 h-12 text-gray-500 mb-2" />
            <p className="text-gray-400 mb-2">Click to select an image</p>
            <button
              onClick={triggerFileInput}
              className="bg-[#1a1f36] hover:bg-[#252b45] text-white py-2 px-4 rounded-lg text-sm"
            >
              Browse Files
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Camera className="w-12 h-12 mb-2" />
            <p>Select a method below to begin</p>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 animate-spin text-[#3B82F6] mb-4" />
              <p className="text-white text-lg">Analyzing face shape...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-200 text-sm">{error}</p>
            {error.includes("Failed to load face analysis models") && (
              <button
                onClick={retryModelLoading}
                className="flex items-center gap-1 text-xs text-red-300 hover:text-red-200 mt-1"
              >
                <RefreshCw className="w-3 h-3" /> Try again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={() => handleModeSelect("camera")}
          disabled={
            isLoading ||
            (modelLoading && !modelsLoaded && !usingFallbackMode) ||
            !initializationComplete ||
            (browserCompatible === false && !usingFallbackMode)
          }
          className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base transition-all duration-300 ${
            mode === "camera" ? "bg-[#2563EB] text-white" : "bg-[#3B82F6] hover:bg-[#2563EB] text-white"
          } ${
            isLoading ||
            (modelLoading && !modelsLoaded && !usingFallbackMode) ||
            !initializationComplete ||
            (browserCompatible === false && !usingFallbackMode)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          Take Photo
        </button>

        <button
          onClick={() => (mode === "camera" ? captureImage() : handleModeSelect("upload"))}
          disabled={
            isLoading ||
            (modelLoading && !modelsLoaded && !usingFallbackMode) ||
            (mode === "camera" && !stream) ||
            !initializationComplete ||
            (browserCompatible === false && !usingFallbackMode)
          }
          className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base transition-all duration-300 ${
            mode === "camera"
              ? "bg-[#3B82F6] hover:bg-[#2563EB] text-white"
              : mode === "upload"
                ? "bg-[#2563EB] text-white"
                : "bg-[#1a1f36] hover:bg-[#252b45] text-white"
          } ${
            isLoading ||
            (modelLoading && !modelsLoaded && !usingFallbackMode) ||
            (mode === "camera" && !stream) ||
            !initializationComplete ||
            (browserCompatible === false && !usingFallbackMode)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {mode === "camera" ? (
            <>
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              Capture
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              Upload
            </>
          )}
        </button>
      </div>
    </div>
  )
}
