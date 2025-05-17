"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Camera, RefreshCw, Download, Share2 } from "lucide-react"

interface TryOnModalProps {
  isOpen: boolean
  onClose: () => void
  frameName: string
  frameImage: string
  frameColor: string
  modelUrl?: string
}

export function TryOnModal({ isOpen, onClose, frameName, frameImage, frameColor, modelUrl }: TryOnModalProps) {
  const [isARSupported, setIsARSupported] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const arCanvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    // Basic check for WebXR support
    setIsARSupported(!!navigator.xr)

    // Initialize camera if modal is open
    if (isOpen) {
      initCamera()
    }

    return () => {
      // Clean up camera when modal closes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [isOpen])

  const initCamera = async () => {
    try {
      setCameraError(null)

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
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
            videoRef.current
              .play()
              .then(() => setCameraActive(true))
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
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-md m-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Try On: {frameName}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {isARSupported ? (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Using AR to visualize the {frameColor} {frameName} frames.
                  </p>

                  <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                    {cameraActive ? (
                      <>
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                        <canvas ref={arCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

                        {/* Overlay with frame image */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <img
                            src={frameImage || "/placeholder.svg"}
                            alt={frameName}
                            className="w-1/2 opacity-80"
                            style={{ transform: "scale(1.2)" }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        {cameraError ? (
                          <>
                            <p className="text-red-500 mb-4">{cameraError}</p>
                            <button
                              onClick={initCamera}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Try Again
                            </button>
                          </>
                        ) : (
                          <>
                            <Camera className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-500">Initializing camera...</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-center gap-3">
                    <button className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">AR not supported on this device.</p>
                  <img src={frameImage || "/placeholder.svg"} alt={frameName} className="max-w-full max-h-64 mx-auto" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    You can still view the frames in our gallery or visit a store for a physical try-on.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
