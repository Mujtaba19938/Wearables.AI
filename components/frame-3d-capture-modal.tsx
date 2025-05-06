"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Camera, Upload, RotateCw, Check, Loader2 } from "lucide-react"

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

  const totalAngles = 4 // Number of angles to capture for 3D reconstruction

  if (!isOpen) return null

  const handleCapture = () => {
    // In a real implementation, this would access the camera and take a photo
    // For this demo, we'll simulate capturing images

    // Simulate a new captured image
    const newImage = `/placeholder.svg?height=300&width=300&query=eyeglasses from angle ${currentAngle}`

    setCapturedImages([...capturedImages, newImage])

    if (currentAngle < totalAngles - 1) {
      setCurrentAngle(currentAngle + 1)
    } else {
      // All angles captured, move to processing
      setCaptureStage("processing")

      // Simulate processing time
      setTimeout(() => {
        setCaptureStage("complete")
      }, 2000)
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

          {captureStage === "capture" && (
            <div className="space-y-4">
              <div className="aspect-square bg-black relative rounded-lg overflow-hidden flex items-center justify-center">
                {capturedImages.length > 0 && currentAngle > 0 ? (
                  <img
                    src={capturedImages[capturedImages.length - 1] || "/placeholder.svg"}
                    alt={`Frame from angle ${currentAngle - 1}`}
                    className="max-w-full max-h-full"
                  />
                ) : (
                  <div className="text-center p-4">
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
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
