"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"

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
  const arCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Basic check for WebXR support
    setIsARSupported(!!navigator.xr)

    // Placeholder for actual AR initialization logic
    if (isOpen && isARSupported) {
      console.log("AR Session Started (Placeholder)")
      // TODO: Implement AR session initialization here
    }

    return () => {
      // Placeholder for AR cleanup logic
      console.log("AR Session Ended (Placeholder)")
      // TODO: Implement AR session cleanup here
    }
  }, [isOpen, isARSupported])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-md">
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
              {modelUrl ? (
                <canvas ref={arCanvasRef} className="w-full aspect-square bg-gray-100 dark:bg-gray-900"></canvas>
              ) : (
                <div className="w-full aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  3D Model Loading...
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="text-red-500">AR not supported on this device.</p>
              <img src={frameImage || "/placeholder.svg"} alt={frameName} className="max-w-full max-h-64 mx-auto" />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
