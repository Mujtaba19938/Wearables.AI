"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { loadARFaceTrackingModels, detectFaceLandmarksForAR, calculateGlassesPosition } from "@/utils/ar-face-tracking"

interface ARGlassesOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>
  frameImage: string
  isDebugMode?: boolean
  onFaceDetected?: (isDetected: boolean) => void
}

export function ARGlassesOverlay({ videoRef, frameImage, isDebugMode = false, onFaceDetected }: ARGlassesOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glassesImageRef = useRef<HTMLImageElement | null>(null)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [isFaceDetected, setIsFaceDetected] = useState(false)
  const animationFrameRef = useRef<number | null>(null)
  const lastPositionRef = useRef<any>(null)
  const [hasError, setHasError] = useState(false)

  // Load face tracking models on component mount
  useEffect(() => {
    let isMounted = true

    const loadModels = async () => {
      if (!isMounted) return

      setIsModelLoading(true)
      try {
        await loadARFaceTrackingModels()
        if (isMounted) {
          setIsModelLoading(false)
        }
      } catch (error) {
        console.error("Failed to load AR face tracking models:", error)
        if (isMounted) {
          setIsModelLoading(false)
          setHasError(true)
        }
      }
    }

    // Preload glasses image
    const glassesImage = new Image()
    glassesImage.crossOrigin = "anonymous"
    glassesImage.src = frameImage
    glassesImage.onload = () => {
      if (isMounted) {
        glassesImageRef.current = glassesImage
      }
    }
    glassesImage.onerror = () => {
      console.error("Failed to load glasses image:", frameImage)
      if (isMounted) {
        setHasError(true)
      }
    }

    loadModels()

    return () => {
      isMounted = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [frameImage])

  // Start face tracking when video is playing
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || isModelLoading || hasError) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Set canvas dimensions to match video
    const resizeCanvas = () => {
      if (video && canvas) {
        const width = video.videoWidth || video.clientWidth
        const height = video.videoHeight || video.clientHeight

        if (width && height) {
          canvas.width = width
          canvas.height = height
        }
      }
    }

    // Initialize canvas size
    const handleVideoMetadata = () => {
      resizeCanvas()
    }

    // Update canvas size when video dimensions change
    video.addEventListener("loadedmetadata", handleVideoMetadata)

    // Also try to resize immediately in case the video is already loaded
    resizeCanvas()

    // Function to track face and render glasses
    const trackFaceAndRender = async () => {
      if (!video || !canvas || !ctx || !glassesImageRef.current) {
        animationFrameRef.current = requestAnimationFrame(trackFaceAndRender)
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      try {
        // Only proceed if video is actually playing
        if (video.readyState < 2 || video.paused || video.ended) {
          animationFrameRef.current = requestAnimationFrame(trackFaceAndRender)
          return
        }

        // Detect face landmarks
        const faceLandmarks = await detectFaceLandmarksForAR(video)

        // Update face detection state
        const faceDetected = !!faceLandmarks
        if (faceDetected !== isFaceDetected) {
          setIsFaceDetected(faceDetected)
          onFaceDetected?.(faceDetected)
        }

        if (faceLandmarks) {
          // Calculate glasses position
          const glassesPosition = calculateGlassesPosition(faceLandmarks, canvas.width, canvas.height)

          // Apply smoothing to prevent jitter
          if (lastPositionRef.current && glassesPosition) {
            const smoothingFactor = 0.7 // Higher = more smoothing
            glassesPosition.x = lastPositionRef.current.x * smoothingFactor + glassesPosition.x * (1 - smoothingFactor)
            glassesPosition.y = lastPositionRef.current.y * smoothingFactor + glassesPosition.y * (1 - smoothingFactor)
            glassesPosition.rotation =
              lastPositionRef.current.rotation * smoothingFactor + glassesPosition.rotation * (1 - smoothingFactor)
            glassesPosition.scale =
              lastPositionRef.current.scale * smoothingFactor + glassesPosition.scale * (1 - smoothingFactor)
          }

          lastPositionRef.current = glassesPosition

          if (glassesPosition && glassesImageRef.current) {
            // Save context state
            ctx.save()

            // Move to the center point for rotation
            ctx.translate(glassesPosition.x + glassesPosition.width / 2, glassesPosition.y + glassesPosition.height / 2)

            // Rotate around the center
            ctx.rotate((glassesPosition.rotation * Math.PI) / 180)

            // Draw the glasses image
            ctx.drawImage(
              glassesImageRef.current,
              -glassesPosition.width / 2,
              -glassesPosition.height / 2,
              glassesPosition.width,
              glassesPosition.height,
            )

            // Restore context state
            ctx.restore()
          }

          // Draw debug visualization if enabled
          if (isDebugMode) {
            ctx.save()
            ctx.fillStyle = "rgba(0, 255, 0, 0.3)"
            ctx.fillRect(
              faceLandmarks.boundingBox.x,
              faceLandmarks.boundingBox.y,
              faceLandmarks.boundingBox.width,
              faceLandmarks.boundingBox.height,
            )

            // Draw face landmarks
            ctx.fillStyle = "#00ff00"
            faceLandmarks.landmarks.forEach((point: { x: number; y: number }) => {
              ctx.beginPath()
              ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI)
              ctx.fill()
            })
            ctx.restore()
          }
        }
      } catch (error) {
        console.error("Error in face tracking:", error)
      }

      // Continue tracking
      animationFrameRef.current = requestAnimationFrame(trackFaceAndRender)
    }

    // Start tracking
    trackFaceAndRender()

    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      video.removeEventListener("loadedmetadata", handleVideoMetadata)
    }
  }, [videoRef, canvasRef, isModelLoading, frameImage, isDebugMode, isFaceDetected, onFaceDetected, hasError])

  if (hasError) {
    return null
  }

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" aria-hidden="true" />
  )
}
