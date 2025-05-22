"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera, Download, Eye, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/toast-provider"

interface Frame3DCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onModelCreated?: (url: string) => void
}

export default function Frame3DCaptureModal({ isOpen, onClose, onModelCreated }: Frame3DCaptureModalProps) {
  const [captureState, setCaptureState] = useState<"idle" | "capturing" | "processing" | "complete">("idle")
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { addToast } = useToast()

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCaptureState("idle")
      setModelUrl(null)
    } else {
      // Stop camera when modal closes
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }, [isOpen])

  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        })
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      addToast("Could not access camera. Please check permissions.", "error")
    }
  }

  const captureFrames = async () => {
    setCaptureState("capturing")

    // Simulate capturing multiple frames
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setCaptureState("processing")

    // Simulate processing the 3D model
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // In a real app, this would be the URL to the generated 3D model
    const demoModelUrl = "/3d-glasses-wireframe.png"

    setModelUrl(demoModelUrl)
    setCaptureState("complete")

    if (onModelCreated) {
      onModelCreated(demoModelUrl)
    }
  }

  const handleStartCapture = () => {
    startCamera()
  }

  const downloadModel = () => {
    if (modelUrl) {
      const link = document.createElement("a")
      link.href = modelUrl
      link.download = "eyeglasses-3d-model.glb"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      addToast("3D model downloaded successfully", "success")
    }
  }

  const viewModel = () => {
    if (modelUrl) {
      window.open(modelUrl, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>3D Frame Capture</DialogTitle>
          <DialogDescription>
            Capture your face from multiple angles to create a 3D model for virtual try-on.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          {captureState === "idle" && (
            <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                This is a demo mode. In a real app, this would capture multiple angles of your face to create a 3D
                model.
              </AlertDescription>
            </Alert>
          )}

          <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
            {captureState === "idle" && !videoRef.current?.srcObject && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={handleStartCapture} className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Start Camera
                </Button>
              </div>
            )}

            {captureState === "complete" && modelUrl ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <img
                  src={modelUrl || "/placeholder.svg"}
                  alt="3D Model Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${
                  captureState === "capturing" || captureState === "processing" ? "opacity-50" : ""
                }`}
                muted
                playsInline
              />
            )}

            {captureState === "capturing" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="animate-ping h-8 w-8 rounded-full bg-primary/80 mb-2"></div>
                <p className="text-white font-medium">Capturing frames...</p>
              </div>
            )}

            {captureState === "processing" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
                <p className="text-white font-medium">Processing 3D model...</p>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" width="1280" height="720"></canvas>

          <div className="flex gap-2 w-full justify-center">
            {videoRef.current?.srcObject && captureState === "idle" && (
              <Button onClick={captureFrames}>Capture 3D Model</Button>
            )}

            {captureState === "complete" && modelUrl && (
              <>
                <Button variant="outline" onClick={downloadModel} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button onClick={viewModel} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View in 3D
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
