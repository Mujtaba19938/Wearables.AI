"use client"

import { useEffect, useRef } from "react"

interface FaceLandmarksVisualizationProps {
  imageData: string
  landmarks: Array<{ x: number; y: number }>
  measurements: {
    faceWidth: number
    faceHeight: number
    foreheadWidth: number
    cheekboneWidth: number
    jawWidth: number
    chinWidth: number
    [key: string]: number
  }
}

export function FaceLandmarksVisualization({ imageData, landmarks, measurements }: FaceLandmarksVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !landmarks || landmarks.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Set styles for landmarks
      ctx.lineWidth = 2
      ctx.strokeStyle = "#3B82F6" // Blue color
      ctx.fillStyle = "#3B82F6"

      // Draw facial landmarks
      drawFacialLandmarks(ctx, img, landmarks)

      // Draw measurements
      drawMeasurements(ctx, img, landmarks, measurements)
    }
    img.src = imageData
    imgRef.current = img
  }, [imageData, landmarks, measurements])

  // Function to draw facial landmarks
  const drawFacialLandmarks = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    landmarks: Array<{ x: number; y: number }>,
  ) => {
    // Check if we're using simplified landmarks (from fallback mode)
    const isSimplifiedLandmarks = landmarks.length < 68

    if (isSimplifiedLandmarks) {
      // Draw a simple face outline for fallback mode
      ctx.beginPath()

      // Draw a face outline
      const centerX = img.width / 2
      const centerY = img.height / 2
      const faceWidth = img.width * 0.6
      const faceHeight = img.height * 0.8

      ctx.ellipse(centerX, centerY, faceWidth / 2, faceHeight / 2, 0, 0, 2 * Math.PI)
      ctx.stroke()

      // Draw eyes
      const eyeSize = faceWidth * 0.12
      ctx.beginPath()
      ctx.ellipse(centerX - faceWidth * 0.2, centerY - faceHeight * 0.1, eyeSize, eyeSize / 2, 0, 0, 2 * Math.PI)
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(centerX + faceWidth * 0.2, centerY - faceHeight * 0.1, eyeSize, eyeSize / 2, 0, 0, 2 * Math.PI)
      ctx.stroke()

      // Draw mouth
      ctx.beginPath()
      ctx.ellipse(centerX, centerY + faceHeight * 0.2, faceWidth * 0.25, faceHeight * 0.1, 0, 0, Math.PI)
      ctx.stroke()

      // Draw nose
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - faceHeight * 0.05)
      ctx.lineTo(centerX - faceWidth * 0.05, centerY + faceHeight * 0.1)
      ctx.lineTo(centerX + faceWidth * 0.05, centerY + faceHeight * 0.1)
      ctx.closePath()
      ctx.stroke()

      return
    }

    // For full landmarks (68 points), use the original code:
    // Draw jawline
    ctx.beginPath()
    ctx.moveTo(landmarks[0].x, landmarks[0].y)
    for (let i = 1; i < 17; i++) {
      ctx.lineTo(landmarks[i].x, landmarks[i].y)
    }
    ctx.stroke()

    // Draw eyebrows
    ctx.beginPath()
    ctx.moveTo(landmarks[17].x, landmarks[17].y)
    for (let i = 18; i < 22; i++) {
      ctx.lineTo(landmarks[i].x, landmarks[i].y)
    }
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(landmarks[22].x, landmarks[22].y)
    for (let i = 23; i < 27; i++) {
      ctx.lineTo(landmarks[i].x, landmarks[i].y)
    }
    ctx.stroke()

    // Draw nose
    ctx.beginPath()
    ctx.moveTo(landmarks[27].x, landmarks[27].y)
    for (let i = 28; i < 36; i++) {
      ctx.lineTo(landmarks[i].x, landmarks[i].y)
    }
    ctx.stroke()

    // Draw left eye
    ctx.beginPath()
    ctx.moveTo(landmarks[36].x, landmarks[36].y)
    for (let i = 37; i < 42; i++) {
      ctx.lineTo(landmarks[i].x, landmarks[i].y)
    }
    ctx.lineTo(landmarks[36].x, landmarks[36].y)
    ctx.stroke()

    // Draw right eye
    ctx.beginPath()
    ctx.moveTo(landmarks[42].x, landmarks[42].y)
    for (let i = 43; i < 48; i++) {
      ctx.lineTo(landmarks[i].x, landmarks[i].y)
    }
    ctx.lineTo(landmarks[42].x, landmarks[42].y)
    ctx.stroke()

    // Draw mouth
    ctx.beginPath()
    ctx.moveTo(landmarks[48].x, landmarks[48].y)
    for (let i = 49; i < 60; i++) {
      ctx.lineTo(landmarks[i].x, landmarks[i].y)
    }
    ctx.lineTo(landmarks[48].x, landmarks[48].y)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(landmarks[60].x, landmarks[60].y)
    for (let i = 61; i < 68; i++) {
      ctx.lineTo(landmarks[i].x, landmarks[i].y)
    }
    ctx.lineTo(landmarks[60].x, landmarks[60].y)
    ctx.stroke()
  }

  // Function to draw measurements
  const drawMeasurements = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    landmarks: Array<{ x: number; y: number }>,
    measurements: { [key: string]: number },
  ) => {
    // Check if we're using simplified landmarks (from fallback mode)
    const isSimplifiedLandmarks = landmarks.length < 68

    if (isSimplifiedLandmarks) {
      // For simplified mode, draw basic measurements
      const centerX = img.width / 2
      const centerY = img.height / 2
      const faceWidth = measurements.faceWidth
      const faceHeight = measurements.faceHeight

      // Set styles for measurements
      ctx.lineWidth = 2
      ctx.strokeStyle = "#10B981" // Green color
      ctx.fillStyle = "#10B981"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"

      // Draw face width line
      drawMeasurementLine(ctx, centerX - faceWidth / 2, centerY, centerX + faceWidth / 2, centerY, "Face Width")

      // Draw face height line
      drawMeasurementLine(ctx, centerX, centerY - faceHeight / 2, centerX, centerY + faceHeight / 2, "Face Height")

      // Draw key points
      drawKeyPoint(ctx, centerX, centerY - faceHeight * 0.4, "Forehead")
      drawKeyPoint(ctx, centerX, centerY + faceHeight * 0.4, "Chin")
      drawKeyPoint(ctx, centerX, centerY, "Nose")
      drawKeyPoint(ctx, centerX, centerY + faceHeight * 0.2, "Mouth")

      return
    }

    // For full landmarks (68 points), use the original code:
    const jawOutline = landmarks.slice(0, 17)
    const nose = landmarks.slice(27, 36)
    const leftEye = landmarks.slice(36, 42)
    const rightEye = landmarks.slice(42, 48)
    const mouth = landmarks.slice(48, 68)

    // Calculate key points
    const eyesMidpoint = {
      x: (leftEye[0].x + rightEye[0].x) / 2,
      y: (leftEye[0].y + rightEye[0].y) / 2,
    }
    const foreheadY = eyesMidpoint.y - measurements.faceWidth * 0.1
    const foreheadLeft = { x: jawOutline[0].x, y: foreheadY }
    const foreheadRight = { x: jawOutline[16].x, y: foreheadY }

    // Set styles for measurements
    ctx.lineWidth = 2
    ctx.strokeStyle = "#10B981" // Green color
    ctx.fillStyle = "#10B981"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"

    // Draw face width line
    drawMeasurementLine(ctx, jawOutline[0].x, jawOutline[0].y, jawOutline[16].x, jawOutline[16].y, "Face Width")

    // Draw face height line
    drawMeasurementLine(ctx, eyesMidpoint.x, foreheadY, jawOutline[8].x, jawOutline[8].y, "Face Height")

    // Draw forehead width line
    drawMeasurementLine(ctx, foreheadLeft.x, foreheadLeft.y, foreheadRight.x, foreheadRight.y, "Forehead Width")

    // Draw cheekbone width line
    drawMeasurementLine(ctx, jawOutline[4].x, jawOutline[4].y, jawOutline[12].x, jawOutline[12].y, "Cheekbone Width")

    // Draw jaw width line
    drawMeasurementLine(ctx, jawOutline[3].x, jawOutline[3].y, jawOutline[13].x, jawOutline[13].y, "Jaw Width")

    // Draw chin width line
    drawMeasurementLine(ctx, jawOutline[5].x, jawOutline[5].y, jawOutline[11].x, jawOutline[11].y, "Chin Width")

    // Add key points
    drawKeyPoint(ctx, eyesMidpoint.x, foreheadY, "Forehead")
    drawKeyPoint(ctx, jawOutline[8].x, jawOutline[8].y, "Chin")
    drawKeyPoint(ctx, nose[0].x, nose[0].y, "Nose Bridge")
    drawKeyPoint(ctx, mouth[0].x, mouth[0].y, "Mouth")
  }

  // Helper function to draw a measurement line with label
  const drawMeasurementLine = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    label: string,
  ) => {
    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2
    const angle = Math.atan2(y2 - y1, x2 - x1)
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

    // Draw line
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    // Draw small perpendicular lines at the ends
    const perpLength = 5
    ctx.beginPath()
    ctx.moveTo(x1, y1 - perpLength)
    ctx.lineTo(x1, y1 + perpLength)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x2, y2 - perpLength)
    ctx.lineTo(x2, y2 + perpLength)
    ctx.stroke()

    // Draw label background
    const padding = 2
    const textMetrics = ctx.measureText(label)
    const textWidth = textMetrics.width
    const textHeight = 14 // Approximate height for the font size

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(
      midX - textWidth / 2 - padding,
      midY - textHeight / 2 - padding,
      textWidth + padding * 2,
      textHeight + padding * 2,
    )

    // Draw label
    ctx.fillStyle = "#ffffff"
    ctx.fillText(label, midX, midY + 4)
  }

  // Helper function to draw a key point with label
  const drawKeyPoint = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string) => {
    // Draw point
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI)
    ctx.fillStyle = "#EF4444" // Red color
    ctx.fill()

    // Draw label background
    const padding = 2
    const textMetrics = ctx.measureText(label)
    const textWidth = textMetrics.width
    const textHeight = 14 // Approximate height for the font size

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(
      x - textWidth / 2 - padding,
      y - textHeight - 8 - padding,
      textWidth + padding * 2,
      textHeight + padding * 2,
    )

    // Draw label
    ctx.fillStyle = "#ffffff"
    ctx.fillText(label, x, y - 8)
  }

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <canvas ref={canvasRef} className="w-full h-auto" />
    </div>
  )
}
