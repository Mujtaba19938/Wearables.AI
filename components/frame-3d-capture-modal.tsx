"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Camera, Upload, RotateCw, Check, Loader2, AlertCircle } from "lucide-react"

interface Frame3DCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  frameName: string
  onUploadComplete: (modelUrl: string) => void
}

export function Frame3DCaptureModal(props: Frame3DCaptureModalProps) {
  // Destructure props inside the component to avoid issues
  const { isOpen, onClose, frameName, onUploadComplete } = props

  // Basic state
  const [captureStage, setCaptureStage] = useState<string>("intro")
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [currentAngle, setCurrentAngle] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [cameraReady, setCameraReady] = useState(false)

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const processingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null)

  const totalAngles = 4 // Number of angles to capture for 3D reconstruction
  const angleLabels = ["Front", "Left Side", "Right Side", "Top"]

  // Safe cleanup function for camera
  const cleanupCamera = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop()
          } catch (e) {
            console.error("Error stopping track:", e)
          }
        })
        streamRef.current = null
      }

      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject = null
      }

      setCameraReady(false)
    } catch (e) {
      console.error("Error in cleanup:", e)
    }
  }

  // Initialize camera safely
  const initializeCamera = async () => {
    try {
      setCameraError(null)
      setCameraReady(false)

      // Clean up any existing streams first
      cleanupCamera()

      // Check if mediaDevices API is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera not supported in your browser")
        return
      }

      // Request camera access with fallback options
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      // Store stream in ref for later cleanup
      streamRef.current = stream

      // Set video source if video element exists
      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // Ensure video plays on iOS
        videoRef.current.setAttribute("playsinline", "true")
        videoRef.current.setAttribute("autoplay", "true")
        videoRef.current.muted = true

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                console.log("Camera ready")
                setCameraReady(true)
              })
              .catch((err) => {
                console.error("Error playing video:", err)
                setCameraError("Could not start video stream")
              })
          }
        }
      }
    } catch (error) {
      console.error("Camera error:", error)
      setCameraError("Could not access camera. Please check permissions.")
    }
  }

  // Handle capture button click
  const handleCapture = () => {
    try {
      if (!videoRef.current || !streamRef.current) {
        setCameraError("Camera not initialized")
        return
      }

      // Create canvas for capture
      const canvas = document.createElement("canvas")
      const video = videoRef.current

      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480

      // Draw video frame to canvas
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Get image data
        try {
          const imageUrl = canvas.toDataURL("image/jpeg", 0.8)

          // Update state with new image
          setCapturedImages((prev) => [...prev, imageUrl])

          // Move to next angle or processing
          if (currentAngle < totalAngles - 1) {
            setCurrentAngle((prev) => prev + 1)
            setCameraReady(false)

            // Temporarily stop the camera
            cleanupCamera()

            // Show a brief confirmation before reopening camera
            setTimeout(() => {
              // Reopen camera for next angle
              initializeCamera()
            }, 500)
          } else {
            // All angles captured, move to processing
            setCaptureStage("processing")

            // Clean up camera
            cleanupCamera()

            // Start processing simulation
            simulateProcessing()
          }
        } catch (e) {
          console.error("Error creating image:", e)
          setCameraError("Failed to capture image")
        }
      }
    } catch (e) {
      console.error("Capture error:", e)
      setCameraError("Failed to capture image")
    }
  }

  // Simulate 3D model processing with progress
  const simulateProcessing = () => {
    setProcessingProgress(0)

    // Clear any existing timer
    if (processingTimerRef.current) {
      clearInterval(processingTimerRef.current)
    }

    // Simulate processing with progress updates
    processingTimerRef.current = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          if (processingTimerRef.current) {
            clearInterval(processingTimerRef.current)
          }
          // Move to upload stage
          simulateUpload()
          return 100
        }
        return newProgress
      })
    }, 100)
  }

  // Simulate model upload with progress
  const simulateUpload = () => {
    setCaptureStage("uploading")
    setUploadProgress(0)

    // Clear any existing timer
    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current)
    }

    // Simulate upload with progress updates
    uploadTimerRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          if (uploadTimerRef.current) {
            clearInterval(uploadTimerRef.current)
          }
          // Move to complete stage
          setCaptureStage("complete")
          return 100
        }
        return newProgress
      })
    }, 150)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      // Check file type
      const validFormats = [".glb", ".gltf", ".obj", ".stl"]
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

      if (!validFormats.includes(fileExtension)) {
        alert("Please upload a valid 3D model file (GLB, GLTF, OBJ, or STL)")
        return
      }

      setIsUploading(true)
      setCaptureStage("uploading")
      setUploadProgress(0)

      // Simulate upload with progress
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(uploadInterval)

            // Complete the upload
            setTimeout(() => {
              const mockModelUrl = `/models/${frameName.toLowerCase().replace(/\s+/g, "-")}.glb`
              onUploadComplete(mockModelUrl)
              setIsUploading(false)
              onClose()
            }, 500)

            return 100
          }
          return newProgress
        })
      }, 150)
    } catch (e) {
      console.error("Upload error:", e)
      setIsUploading(false)
      alert("Upload failed. Please try again.")
    }
  }

  // Reset capture state
  const resetCapture = () => {
    cleanupCamera()
    setCapturedImages([])
    setCurrentAngle(0)
    setCameraError(null)
    setCaptureStage("intro")
    setCameraReady(false)

    // Clear any timers
    if (processingTimerRef.current) {
      clearInterval(processingTimerRef.current)
    }
    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current)
    }

    // Reinitialize camera
    setTimeout(() => {
      initializeCamera()
    }, 300)
  }

  // Complete capture process
  const completeCapture = () => {
    const mockModelUrl = `/models/${frameName.toLowerCase().replace(/\s+/g, "-")}.glb`
    onUploadComplete(mockModelUrl)
    onClose()
  }

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Start camera when entering capture stage
  useEffect(() => {
    if (isOpen && captureStage === "capture") {
      initializeCamera()
    }

    // Cleanup on unmount or when leaving capture stage
    return () => {
      cleanupCamera()

      // Clear any timers
      if (processingTimerRef.current) {
        clearInterval(processingTimerRef.current)
      }
      if (uploadTimerRef.current) {
        clearInterval(uploadTimerRef.current)
      }
    }
  }, [isOpen, captureStage])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupCamera()

      // Clear any timers
      if (processingTimerRef.current) {
        clearInterval(processingTimerRef.current)
      }
      if (uploadTimerRef.current) {
        clearInterval(uploadTimerRef.current)
      }
    }
  }, [])

  // Don't render anything if not open
  if (!isOpen) {
    return null
  }

  // Render modal content based on stage
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">3D Frame Capture</h2>
          <button
            onClick={() => {
              cleanupCamera()
              onClose()
            }}
            className="p-1 rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Intro Stage */}
          {captureStage === "intro" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create a 3D model of your eyeglass frames by taking photos from multiple angles or upload an existing 3D
                model.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCaptureStage("capture")}
                  className="flex flex-col items-center justify-center gap-2 p-6 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Camera className="h-8 w-8 text-primary" />
                  <span>Capture Photos</span>
                </button>

                <button
                  onClick={triggerFileInput}
                  className="flex flex-col items-center justify-center gap-2 p-6 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Upload className="h-8 w-8 text-primary" />
                  <span>Upload 3D Model</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".glb,.gltf,.obj,.stl"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </button>
              </div>

              {isUploading && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span>Uploading 3D model...</span>
                </div>
              )}
            </div>
          )}

          {/* Capture Stage */}
          {captureStage === "capture" && (
            <div className="space-y-4">
              {/* Camera/Preview Area */}
              <div className="aspect-square bg-black relative rounded-lg overflow-hidden flex items-center justify-center">
                {/* Camera Error */}
                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                    <p className="text-red-400 font-medium mb-2">Camera Error</p>
                    <p className="text-gray-300 text-sm">{cameraError}</p>
                    <button
                      onClick={() => {
                        setCameraError(null)
                        initializeCamera()
                      }}
                      className="mt-4 px-4 py-2 bg-primary rounded-md text-white"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Loading indicator */}
                {!cameraReady && !cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 text-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-2" />
                    <p className="text-gray-300 text-sm">Initializing camera...</p>
                  </div>
                )}

                {/* Video Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="max-w-full max-h-full"
                  style={{ display: !cameraError ? "block" : "none" }}
                />

                {/* Last Captured Image (shown after first capture) */}
                {capturedImages.length > 0 && currentAngle > 0 && !cameraReady && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <img
                      src={capturedImages[capturedImages.length - 1] || "/placeholder.svg"}
                      alt={`Frame from angle ${currentAngle}`}
                      className="max-w-full max-h-full"
                    />
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-primary font-medium">
                    Angle {currentAngle + 1}/{totalAngles}: {angleLabels[currentAngle]}
                  </span>
                  <p className="text-muted-foreground">Rotate the frame after each capture</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={resetCapture}
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <RotateCw className="h-5 w-5" />
                  </button>

                  <button
                    onClick={handleCapture}
                    disabled={!!cameraError || !cameraReady}
                    className={`px-4 py-2 rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors ${
                      !cameraError && cameraReady ? "bg-primary" : "bg-gray-700 cursor-not-allowed"
                    }`}
                  >
                    {cameraReady ? "Capture" : "Waiting..."}
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto py-2">
                {capturedImages.map((img, idx) => (
                  <div key={idx} className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-border">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {Array.from({ length: totalAngles - capturedImages.length }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="w-16 h-16 flex-shrink-0 rounded-md bg-muted flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground">{capturedImages.length + idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing Stage */}
          {captureStage === "processing" && (
            <div className="py-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Processing 3D Model</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We're creating a 3D model from your photos. This may take a moment...
              </p>

              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">{processingProgress}% complete</p>
            </div>
          )}

          {/* Uploading Stage */}
          {captureStage === "uploading" && (
            <div className="py-8 text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium mb-2">Uploading 3D Model</h3>
              <p className="text-sm text-muted-foreground mb-4">Uploading your 3D model to the cloud...</p>

              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
            </div>
          )}

          {/* Complete Stage */}
          {captureStage === "complete" && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">3D Model Created!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your 3D model has been successfully created and is ready to use.
              </p>
              <button
                onClick={completeCapture}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Save & Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Frame3DCaptureModal
