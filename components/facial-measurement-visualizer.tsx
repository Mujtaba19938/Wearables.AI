"use client"

import { useRef, useEffect } from "react"
import type { FacialMeasurements } from "@/types/facial-measurements"

interface FacialMeasurementVisualizerProps {
  measurements: FacialMeasurements
  faceShape: string
}

export function FacialMeasurementVisualizer({ measurements, faceShape }: FacialMeasurementVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height

    // Calculate scale factor to fit measurements on canvas
    const maxDimension = Math.max(measurements.faceWidth, measurements.faceHeight)
    const scale = (Math.min(width, height) * 0.8) / maxDimension

    // Center point
    const centerX = width / 2
    const centerY = height / 2

    // Draw face outline based on face shape
    ctx.strokeStyle = "#3b82f6" // blue-500
    ctx.lineWidth = 2
    ctx.beginPath()

    switch (faceShape) {
      case "Oval":
        drawOvalFace(ctx, centerX, centerY, measurements, scale)
        break
      case "Round":
        drawRoundFace(ctx, centerX, centerY, measurements, scale)
        break
      case "Square":
        drawSquareFace(ctx, centerX, centerY, measurements, scale)
        break
      case "Heart":
        drawHeartFace(ctx, centerX, centerY, measurements, scale)
        break
      case "Diamond":
        drawDiamondFace(ctx, centerX, centerY, measurements, scale)
        break
      case "Oblong":
        drawOblongFace(ctx, centerX, centerY, measurements, scale)
        break
      case "Rectangle":
        drawRectangleFace(ctx, centerX, centerY, measurements, scale)
        break
      case "Triangle":
        drawTriangleFace(ctx, centerX, centerY, measurements, scale)
        break
      default:
        drawOvalFace(ctx, centerX, centerY, measurements, scale)
    }

    ctx.stroke()

    // Draw facial thirds
    const faceTop = centerY - (measurements.faceHeight * scale) / 2
    const faceBottom = centerY + (measurements.faceHeight * scale) / 2

    const upperThirdHeight = measurements.facialThirds.upper * scale
    const middleThirdHeight = measurements.facialThirds.middle * scale
    const lowerThirdHeight = measurements.facialThirds.lower * scale

    // Draw lines for facial thirds
    ctx.strokeStyle = "rgba(59, 130, 246, 0.5)" // blue-500 with opacity
    ctx.setLineDash([5, 5])
    ctx.beginPath()

    // Line between upper and middle third
    const upperMiddleLine = faceTop + upperThirdHeight
    ctx.moveTo(centerX - (measurements.faceWidth * scale) / 2, upperMiddleLine)
    ctx.lineTo(centerX + (measurements.faceWidth * scale) / 2, upperMiddleLine)

    // Line between middle and lower third
    const middleLowerLine = upperMiddleLine + middleThirdHeight
    ctx.moveTo(centerX - (measurements.faceWidth * scale) / 2, middleLowerLine)
    ctx.lineTo(centerX + (measurements.faceWidth * scale) / 2, middleLowerLine)

    ctx.stroke()
    ctx.setLineDash([])

    // Draw key measurements
    ctx.fillStyle = "#3b82f6" // blue-500
    ctx.font = "12px Arial"

    // Width to height ratio
    ctx.fillText(`Width/Height: ${measurements.widthToHeightRatio.toFixed(2)}`, 10, 20)

    // Symmetry score
    ctx.fillText(`Symmetry: ${Math.round(measurements.symmetryScore * 100)}%`, 10, 40)

    // Golden ratio score
    ctx.fillText(`Golden Ratio: ${Math.round(measurements.goldenRatioScore * 100)}%`, 10, 60)

    // Draw facial features (simplified)
    drawFacialFeatures(ctx, centerX, centerY, measurements, scale)
  }, [measurements, faceShape])

  return (
    <div className="w-full flex justify-center">
      <canvas ref={canvasRef} width={300} height={300} className="border rounded-md bg-white dark:bg-gray-900" />
    </div>
  )
}

// Helper functions to draw different face shapes
function drawOvalFace(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  measurements: FacialMeasurements,
  scale: number,
) {
  const width = measurements.faceWidth * scale
  const height = measurements.faceHeight * scale

  ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, Math.PI * 2)
}

function drawRoundFace(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  measurements: FacialMeasurements,
  scale: number,
) {
  const radius = (Math.min(measurements.faceWidth, measurements.faceHeight) * scale) / 2

  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
}

function drawSquareFace(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  measurements: FacialMeasurements,
  scale: number,
) {
  const width = measurements.faceWidth * scale
  const height = measurements.faceHeight * scale
  const cornerRadius = width * 0.1

  roundedRect(ctx, centerX - width / 2, centerY - height / 2, width, height, cornerRadius)
}

function drawHeartFace(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  measurements: FacialMeasurements,
  scale: number,
) {
  const width = measurements.faceWidth * scale
  const height = measurements.faceHeight * scale

  // Top of face (widest part)
  const topY = centerY - height / 2
  const bottomY = centerY + height / 2

  // Draw a heart-like shape
  ctx.moveTo(centerX, bottomY) // Bottom point

  // Right side
  ctx.quadraticCurveTo(centerX + width / 4, bottomY - height / 4, centerX + width / 2, centerY)

  ctx.quadraticCurveTo(centerX + width / 2, topY + height / 4, centerX, topY)

  // Left side
  ctx.quadraticCurveTo(centerX - width / 2, topY + height / 4, centerX - width / 2, centerY)

  ctx.quadraticCurveTo(centerX - width / 4, bottomY - height / 4, centerX, bottomY)
}

function drawDiamondFace(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  measurements: FacialMeasurements,
  scale: number,
) {
  const width = measurements.faceWidth * scale
  const height = measurements.faceHeight * scale

  // Diamond points
  ctx.moveTo(centerX, centerY - height / 2) // Top
  ctx.lineTo(centerX + width / 2, centerY) // Right
  ctx.lineTo(centerX, centerY + height / 2) // Bottom
  ctx.lineTo(centerX - width / 2, centerY) // Left
  ctx.lineTo(centerX, centerY - height / 2) // Back to top
}

function drawOblongFace(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  measurements: FacialMeasurements,
  scale: number,
) {
  const width = measurements.faceWidth * scale
  const height = measurements.faceHeight * scale * 1.1 // Slightly elongate
  const cornerRadius = width * 0.25

  roundedRect(ctx, centerX - width / 2, centerY - height / 2, width, height, cornerRadius)
}

function drawRectangleFace(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  measurements: FacialMeasurements,
  scale: number,
) {
  const width = measurements.faceWidth * scale
  const height = measurements.faceHeight * scale * 1.05 // Slightly elongate
  const cornerRadius = width * 0.05 // Less rounded than square

  roundedRect(ctx, centerX - width / 2, centerY - height / 2, width, height, cornerRadius)
}

function drawTriangleFace(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  measurements: FacialMeasurements,
  scale: number,
) {
  const width = measurements.faceWidth * scale
  const height = measurements.faceHeight * scale

  // Triangle points (inverted - wider at jaw)
  ctx.moveTo(centerX, centerY - height / 2) // Top
  ctx.lineTo(centerX + width / 2, centerY + height / 2) // Bottom right
  ctx.lineTo(centerX - width / 2, centerY + height / 2) // Bottom left
  ctx.lineTo(centerX, centerY - height / 2) // Back to top
}

function drawFacialFeatures(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  measurements: FacialMeasurements,
  scale: number,
) {
  const eyeY = centerY - measurements.faceHeight * scale * 0.1
  const eyeWidth = measurements.eyeWidth * scale
  const eyeDistance = measurements.eyeDistance * scale

  // Draw eyes
  ctx.fillStyle = "rgba(59, 130, 246, 0.7)"

  // Left eye
  ctx.beginPath()
  ctx.ellipse(centerX - eyeDistance / 2, eyeY, eyeWidth / 2, eyeWidth / 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // Right eye
  ctx.beginPath()
  ctx.ellipse(centerX + eyeDistance / 2, eyeY, eyeWidth / 2, eyeWidth / 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw nose
  ctx.fillStyle = "rgba(59, 130, 246, 0.5)"
  ctx.beginPath()
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
  ctx.fill()

  // Draw mouth
  const mouthY = centerY + measurements.faceHeight * scale * 0.2
  ctx.strokeStyle = "rgba(59, 130, 246, 0.7)"
  ctx.beginPath()
  ctx.moveTo(centerX - 15, mouthY)
  ctx.quadraticCurveTo(centerX, mouthY + 10, centerX + 15, mouthY)
  ctx.stroke()
}

// Helper function to draw rounded rectangles
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
}
