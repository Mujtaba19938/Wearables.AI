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

export function Frame3DCaptureModal({ isOpen, onClose, frameName, onUploadComplete }: Frame3DCaptureModalProps) {
  const [captureStage, setCaptureStage] = useState<"intro" | "capture" | "processing" | "complete">("intro")
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [currentAngle, setCurrentAngle] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const totalAngles = 4 // Number of angles to capture for 3D reconstruction

  if (!isOpen) return null

  const handleCapture = () => {
    if (!videoRef.current) return

    // Create a canvas to capture the current video frame
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight

    // Draw the current video frame to the canvas
    const ctx = canvas.getContext("2d")
    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

      // Convert the canvas to an image URL
      const imageUrl = canvas.toDataURL("image/jpeg")

      // Add to captured images
      setCapturedImages([...capturedImages, imageUrl])

      if (currentAngle < totalAngles - 1) {
        setCurrentAngle(currentAngle + 1)
      } else {
        // All angles captured, move to processing
        setCaptureStage("processing")

        // Stop the camera stream
        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop())
          setCameraStream(null)
        }

        // Simulate processing time
        setTimeout(() => {
          setCaptureStage("complete")
        }, 2000)
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is a 3D model format
    const validFormats = [".glb", ".gltf", ".obj", ".stl"]
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

    if (!validFormats.includes(fileExtension)) {
      alert("Please upload a valid 3D model file (GLB, GLTF, OBJ, or STL)")
      return
    }

    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      // In a real implementation, this would upload the file to a server
      // and return a URL to the uploaded model
      const mockModelUrl = `/models/${frameName.toLowerCase().replace(/\s+/g, "-")}.glb`
      onUploadComplete(mockModelUrl)
      setIsUploading(false)
      onClose()
    }, 2000)
  }

  const resetCapture = () => {
    // Stop the camera if it's active
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }

    setCapturedImages([])
    setCurrentAngle(0)
    setCaptureStage("intro")
  }

  const completeCapture = () => {
    // In a real implementation, this would send the images for 3D reconstruction
    // and return a URL to the generated 3D model
    const mockModelUrl = `/models/${frameName.toLowerCase().replace(/\s+/g, "-")}.glb`
    onUploadComplete(mockModelUrl)
    onClose()
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const initializeCamera = async () => {
    try {
      setCameraError(null)

      // Check if mediaDevices API is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera access is not supported in your browser. Please try using a different browser.")
        return
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      setCameraStream(stream)

      // Set the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraInitialized(true)
    } catch (error) {
      console.error("Error accessing camera:", error)

      // Provide more specific error messages based on error type
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setCameraError("Camera access denied. Please allow camera permissions in your browser settings.")
        } else if (error.name === "NotFoundError") {
          setCameraError("No camera detected. Please ensure your device has a working camera.")
        } else if (error.name === "NotReadableError" || error.name === "AbortError") {
          setCameraError("Cannot access camera. It may be in use by another application.")
        } else {
          setCameraError(`Camera error: ${error.message}`)
        }
      } else {
        setCameraError("Failed to access camera. Please check your device and try again.")
      }
    }
  }

  useEffect(() => {
    let isMounted = true // Add a flag to track component mount status

    if (isOpen) {
      if (captureStage === "capture" && !isCameraInitialized) {
        initializeCamera()
      }
    } else {
      // Clean up camera stream when modal closes
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
        setCameraStream(null)
        setIsCameraInitialized(false)
      }
    }

    // Clean up camera stream when component unmounts
    return () => {
      isMounted = false // Set the flag to false when component unmounts
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
        setCameraStream(null)
      }
      setIsCameraInitialized(false)
    }
  }, [cameraStream, isOpen, captureStage, isCameraInitialized])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full overflow-hidden border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">3D Frame Capture</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {captureStage === "intro" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create a 3D model of your eyeglass frames by taking photos from multiple angles or upload an existing 3D
                model.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setCaptureStage("capture")
                  }}
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

          {captureStage === "capture" && (
            <div className="space-y-4">
              <div className="aspect-square bg-black relative rounded-lg overflow-hidden flex items-center justify-center">
                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                    <p className="text-red-400 font-medium mb-2">Camera Error</p>
                    <p className="text-gray-300 text-sm">{cameraError}</p>
                    <button
                      onClick={() => setCaptureStage("intro")}
                      className="mt-4 px-4 py-2 bg-primary rounded-md text-white"
                    >
                      Go Back
                    </button>
                  </div>
                )}
                {
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="max-w-full max-h-full"
                    style={{ display: currentAngle === 0 || capturedImages.length === 0 ? "block" : "none" }}
                  />
                }

                {capturedImages.length > 0 && currentAngle > 0 && (
                  <img
                    src={capturedImages[capturedImages.length - 1] || "/placeholder.svg"}
                    alt={`Frame from angle ${currentAngle - 1}`}
                    className="max-w-full max-h-full"
                  />
                )}

                {!cameraStream && (
                  <div className="text-center p-4 absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                    <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-400">
                      Position your frame for angle {currentAngle + 1}/{totalAngles}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-primary font-medium">
                    Angle {currentAngle + 1}/{totalAngles}
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
                    disabled={!cameraStream}
                    className={`px-4 py-2 rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors ${
                      cameraStream ? "bg-primary" : "bg-gray-700 cursor-not-allowed"
                    }`}
                  >
                    Capture
                  </button>
                </div>
              </div>

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

          {captureStage === "processing" && (
            <div className="py-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Processing 3D Model</h3>
              <p className="text-sm text-muted-foreground">
                We're creating a 3D model from your photos. This may take a moment...
              </p>
            </div>
          )}

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
