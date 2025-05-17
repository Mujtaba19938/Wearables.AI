"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, Camera, Upload, Check, CuboidIcon as Cube, RefreshCw, Download, Eye } from "lucide-react"

interface Frame3DCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onModelCreated?: (modelUrl: string) => void
}

type CaptureStage = "front" | "left" | "right" | "top" | "processing" | "uploading" | "complete"

export function Frame3DCaptureModal({ isOpen, onClose, onModelCreated }: Frame3DCaptureModalProps) {
  const [captureStage, setCaptureStage] = useState<CaptureStage>("front")
  const [capturedImages, setCapturedImages] = useState<Record<CaptureStage, string | null>>({
    front: null,
    left: null,
    right: null,
    top: null,
    processing: null,
    uploading: null,
    complete: null,
  })
  const [processingProgress, setProcessingProgress] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [showLastCapture, setShowLastCapture] = useState(false)
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [showDemoNotice, setShowDemoNotice] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const stageTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear all timers and intervals
  const clearAllTimers = useCallback(() => {
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current)
      processingIntervalRef.current = null
    }

    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current)
      uploadIntervalRef.current = null
    }

    if (stageTimeoutRef.current) {
      clearTimeout(stageTimeoutRef.current)
      stageTimeoutRef.current = null
    }
  }, [])

  // Initialize camera
  const initCamera = useCallback(async () => {
    try {
      setCameraError(null)
      setCameraReady(false)

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      console.log("Initializing camera...")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded")
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                console.log("Camera ready")
                setCameraReady(true)
              })
              .catch((err) => {
                console.error("Error playing video:", err)
                setCameraError("Failed to start video stream")
              })
          }
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraError("Could not access camera. Please ensure you have granted camera permissions.")
    }
  }, [])

  // Handle capture
  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current || !cameraReady) return

    // Simulate haptic feedback with console log
    console.log("Capture button pressed - would trigger haptic feedback")

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg")

    // Update captured images
    setCapturedImages((prev) => ({
      ...prev,
      [captureStage]: imageDataUrl,
    }))

    // Show confirmation of capture
    setShowLastCapture(true)

    // Stop camera temporarily to show the captured image
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    // After a brief delay, move to next stage or processing
    stageTimeoutRef.current = setTimeout(() => {
      setShowLastCapture(false)

      // Determine next stage
      let nextStage: CaptureStage
      switch (captureStage) {
        case "front":
          nextStage = "left"
          break
        case "left":
          nextStage = "right"
          break
        case "right":
          nextStage = "top"
          break
        case "top":
          nextStage = "processing"
          break
        default:
          nextStage = "processing"
      }

      setCaptureStage(nextStage)

      // If not moving to processing, reinitialize camera
      if (nextStage !== "processing") {
        initCamera()
      }
    }, 1500)
  }, [captureStage, cameraReady, initCamera])

  // Start processing simulation
  const startProcessingSimulation = useCallback(() => {
    console.log("Starting processing simulation")

    // Clear any existing interval
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current)
      processingIntervalRef.current = null
    }

    setProcessingProgress(0)

    // Simulate processing with progress updates
    processingIntervalRef.current = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + 2

        // When processing is complete, move to upload stage
        if (newProgress >= 100) {
          if (processingIntervalRef.current) {
            clearInterval(processingIntervalRef.current)
            processingIntervalRef.current = null
          }

          // Short delay before moving to upload stage
          stageTimeoutRef.current = setTimeout(() => {
            setCaptureStage("uploading")
            setUploadProgress(0)
          }, 500)

          return 100
        }

        return newProgress
      })
    }, 200)
  }, [])

  // Start upload simulation
  const startUploadSimulation = useCallback(() => {
    console.log("Starting upload simulation")

    // Clear any existing interval
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current)
      uploadIntervalRef.current = null
    }

    setUploadProgress(0)

    // Simulate upload with progress updates
    uploadIntervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 5

        // When upload is complete, move to complete stage
        if (newProgress >= 100) {
          if (uploadIntervalRef.current) {
            clearInterval(uploadIntervalRef.current)
            uploadIntervalRef.current = null
          }

          // Generate a sample model URL that points to a real 3D model
          const sampleModelUrl = "/assets/3d/duck.glb"

          // Store the model URL in state
          setModelUrl(sampleModelUrl)

          // Short delay before moving to complete stage
          stageTimeoutRef.current = setTimeout(() => {
            setCaptureStage("complete")
            setShowDemoNotice(true)
          }, 500)

          return 100
        }

        return newProgress
      })
    }, 150)
  }, [])

  // Handle save and continue
  const handleSaveAndContinue = useCallback(() => {
    console.log("Save and continue clicked")

    // Simulate haptic feedback with console log
    console.log("Save button pressed - would trigger haptic feedback")

    // Clear any existing timers
    clearAllTimers()

    // If we're in the complete stage, close the modal and call onModelCreated if we have a model URL
    if (captureStage === "complete") {
      if (modelUrl && onModelCreated) {
        onModelCreated(modelUrl)
      }
      onClose()
      return
    }

    // Force move to processing stage if all images are captured
    if (capturedImages.front && capturedImages.left && capturedImages.right && capturedImages.top) {
      setCaptureStage("processing")
    } else {
      console.error("Not all images have been captured yet")
      // You could show an error message here
    }
  }, [captureStage, capturedImages, clearAllTimers, onClose, modelUrl, onModelCreated])

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setCaptureStage("front")
      setCapturedImages({
        front: null,
        left: null,
        right: null,
        top: null,
        processing: null,
        uploading: null,
        complete: null,
      })
      setProcessingProgress(0)
      setUploadProgress(0)
      setCameraError(null)
      setShowLastCapture(false)
      setModelUrl(null)
      setShowDemoNotice(false)

      // Initialize camera
      initCamera()
    } else {
      // Clean up when modal closes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      clearAllTimers()
    }

    // Clean up on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      clearAllTimers()
    }
  }, [isOpen, initCamera, clearAllTimers])

  // Watch for processing stage and start simulation
  useEffect(() => {
    if (captureStage === "processing" && processingProgress === 0 && !processingIntervalRef.current) {
      console.log("Auto-starting processing simulation")
      startProcessingSimulation()
    }
  }, [captureStage, processingProgress, startProcessingSimulation])

  // Watch for uploading stage and start simulation
  useEffect(() => {
    if (captureStage === "uploading" && uploadProgress === 0 && !uploadIntervalRef.current) {
      console.log("Auto-starting upload simulation")
      startUploadSimulation()
    }
  }, [captureStage, uploadProgress, startUploadSimulation])

  // Don't render anything if modal is closed
  if (!isOpen) return null

  // Get stage title
  const getStageTitle = () => {
    switch (captureStage) {
      case "front":
        return "Front View"
      case "left":
        return "Left Side View"
      case "right":
        return "Right Side View"
      case "top":
        return "Top View"
      case "processing":
        return "Processing 3D Model"
      case "uploading":
        return "Uploading 3D Model"
      case "complete":
        return "3D Model Created"
      default:
        return "Capture Frame"
    }
  }

  // Get stage description
  const getStageDescription = () => {
    switch (captureStage) {
      case "front":
        return "Position the glasses directly facing the camera"
      case "left":
        return "Rotate the glasses to show the left side"
      case "right":
        return "Rotate the glasses to show the right side"
      case "top":
        return "Position the camera above the glasses"
      case "processing":
        return "We're creating a 3D model from your photos. This may take a moment..."
      case "uploading":
        return "Uploading your 3D model to the cloud..."
      case "complete":
        return "Your 3D model has been created and saved!"
      default:
        return ""
    }
  }

  // Render content based on stage
  const renderContent = () => {
    // For capture stages
    if (["front", "left", "right", "top"].includes(captureStage)) {
      if (showLastCapture) {
        return (
          <div className="relative w-full h-64 md:h-80 bg-gray-900 rounded-md overflow-hidden">
            <img
              src={capturedImages[captureStage as CaptureStage] || ""}
              alt={`Captured ${captureStage} view`}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-green-500 rounded-full p-2">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        )
      }

      if (cameraError) {
        return (
          <div className="w-full h-64 md:h-80 bg-gray-900 rounded-md flex flex-col items-center justify-center p-4">
            <p className="text-red-500 mb-4">{cameraError}</p>
            <button onClick={initCamera} className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        )
      }

      return (
        <div className="relative w-full h-64 md:h-80 bg-gray-900 rounded-md overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
          <canvas ref={canvasRef} className="hidden" />

          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                <p className="text-white">Initializing camera...</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              onClick={handleCapture}
              disabled={!cameraReady}
              className="w-16 h-16 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center disabled:opacity-50"
            >
              {cameraReady ? (
                <Camera className="w-8 h-8 text-blue-500" />
              ) : (
                <span className="text-xs text-blue-500">Waiting...</span>
              )}
            </button>
          </div>
        </div>
      )
    }

    // For processing stage
    if (captureStage === "processing") {
      return (
        <div className="w-full p-6 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-6"></div>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">{getStageDescription()}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{processingProgress}% complete</p>

          {processingProgress === 0 && (
            <button
              onClick={startProcessingSimulation}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Processing
            </button>
          )}
        </div>
      )
    }

    // For uploading stage
    if (captureStage === "uploading") {
      return (
        <div className="w-full p-6 flex flex-col items-center">
          <Upload className="w-12 h-12 text-blue-500 mb-6" />
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">{getStageDescription()}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{uploadProgress}% complete</p>

          {uploadProgress === 0 && (
            <button
              onClick={startUploadSimulation}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Start Upload
            </button>
          )}
        </div>
      )
    }

    // For complete stage
    if (captureStage === "complete") {
      return (
        <div className="w-full p-6 flex flex-col items-center">
          <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 mb-6">
            <Check className="w-12 h-12 text-green-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">{getStageDescription()}</p>
          <Cube className="w-24 h-24 text-blue-500 mb-4" />

          {showDemoNotice && (
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 text-center">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                <strong>Demo Mode:</strong> This is a demonstration of the 3D model creation feature.
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                In a production app, a real 3D model would be generated from your photos.
              </p>
            </div>
          )}

          {modelUrl && (
            <div className="flex flex-col items-center mt-4 w-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Sample 3D model ready:</p>
              <div className="flex space-x-3 mt-2">
                <a
                  href={modelUrl}
                  download="sample-frame-model.glb"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
                <a
                  href={`https://viewer.vercel.app/?model=${encodeURIComponent(modelUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View in 3D</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  // Determine if Save & Continue button should be enabled
  const isSaveButtonEnabled = () => {
    if (captureStage === "front" || captureStage === "left" || captureStage === "right" || captureStage === "top") {
      return capturedImages[captureStage] !== null
    }

    if (captureStage === "processing") {
      return processingProgress === 100
    }

    if (captureStage === "uploading") {
      return uploadProgress === 100
    }

    return captureStage === "complete"
  }

  // Get Save & Continue button text
  const getSaveButtonText = () => {
    if (captureStage === "complete") {
      return "Close"
    }

    if (captureStage === "processing" && processingProgress < 100) {
      return `Processing (${processingProgress}%)`
    }

    if (captureStage === "uploading" && uploadProgress < 100) {
      return `Uploading (${uploadProgress}%)`
    }

    return "Save & Continue"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">3D Frame Capture</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{getStageTitle()}</h3>
          {renderContent()}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={handleSaveAndContinue}
            disabled={!isSaveButtonEnabled()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getSaveButtonText()}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Frame3DCaptureModal
