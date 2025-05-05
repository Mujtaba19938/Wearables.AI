"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import * as faceapi from "face-api.js"

interface ARMeasurementOverlayProps {
  detection: faceapi.WithFaceLandmarks<
    faceapi.WithFaceExpressions<faceapi.WithAge<faceapi.WithGender<faceapi.WithFaceDetection<{}>>>>
  > | null
  canvasRef: React.RefObject<HTMLCanvasElement>
  videoRef: React.RefObject<HTMLVideoElement>
  showMeasurements: boolean
  showLandmarks: boolean
  showFaceShape: boolean
  measurementType: "basic" | "detailed" | "thirds" | "golden"
}

export function ARMeasurementOverlay({
  detection,
  canvasRef,
  videoRef,
  showMeasurements,
  showLandmarks,
  showFaceShape,
  measurementType,
}: ARMeasurementOverlayProps) {
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !detection) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const displaySize = { width: video.videoWidth, height: video.videoHeight }

    // Match canvas dimensions to video
    if (canvas.width !== displaySize.width || canvas.height !== displaySize.height) {
      faceapi.matchDimensions(canvas, displaySize)
    }

    const resizedDetection = faceapi.resizeResults(detection, displaySize)
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw face landmarks if enabled
    if (showLandmarks) {
      // Custom drawing of landmarks with different colors for different parts
      drawCustomLandmarks(ctx, resizedDetection)
    }

    // Draw face shape outline if enabled
    if (showFaceShape) {
      drawFaceShapeOutline(ctx, resizedDetection)
    }

    // Draw measurements if enabled
    if (showMeasurements) {
      drawMeasurements(ctx, resizedDetection, measurementType)
    }

    // Add face shape label
    if (showFaceShape || showMeasurements) {
      const faceShape = determineFaceShape(resizedDetection.landmarks)
      const bottomRight = resizedDetection.detection.box.bottomRight

      // Draw face shape label with background
      ctx.fillStyle = "rgba(0, 120, 255, 0.7)"
      ctx.fillRect(bottomRight.x - 100, bottomRight.y + 10, 100, 30)

      ctx.fillStyle = "white"
      ctx.font = "bold 16px Arial"
      ctx.fillText(faceShape, bottomRight.x - 90, bottomRight.y + 30)
    }
  }, [detection, canvasRef, videoRef, showMeasurements, showLandmarks, showFaceShape, measurementType])

  return null
}

// Helper function to draw custom landmarks with different colors
function drawCustomLandmarks(
  ctx: CanvasRenderingContext2D,
  detection: faceapi.WithFaceLandmarks<
    faceapi.WithFaceExpressions<faceapi.WithAge<faceapi.WithGender<faceapi.WithFaceDetection<{}>>>>
  >,
) {
  const landmarks = detection.landmarks
  const positions = landmarks.positions

  // Draw jawline
  ctx.strokeStyle = "rgba(0, 255, 0, 0.7)"
  ctx.lineWidth = 2
  ctx.beginPath()
  const jawOutline = landmarks.getJawOutline()
  for (let i = 0; i < jawOutline.length; i++) {
    const point = jawOutline[i]
    if (i === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  }
  ctx.stroke()

  // Draw left eye
  ctx.strokeStyle = "rgba(255, 0, 0, 0.7)"
  ctx.beginPath()
  const leftEye = landmarks.getLeftEye()
  for (let i = 0; i < leftEye.length; i++) {
    const point = leftEye[i]
    if (i === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  }
  ctx.closePath()
  ctx.stroke()

  // Draw right eye
  ctx.beginPath()
  const rightEye = landmarks.getRightEye()
  for (let i = 0; i < rightEye.length; i++) {
    const point = rightEye[i]
    if (i === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  }
  ctx.closePath()
  ctx.stroke()

  // Draw nose
  ctx.strokeStyle = "rgba(0, 0, 255, 0.7)"
  ctx.beginPath()
  const nose = landmarks.getNose()
  for (let i = 0; i < nose.length; i++) {
    const point = nose[i]
    if (i === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  }
  ctx.stroke()

  // Draw mouth
  ctx.strokeStyle = "rgba(255, 0, 255, 0.7)"
  ctx.beginPath()
  const mouth = landmarks.getMouth()
  for (let i = 0; i < mouth.length; i++) {
    const point = mouth[i]
    if (i === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  }
  ctx.closePath()
  ctx.stroke()

  // Draw all landmark points
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
  for (let i = 0; i < positions.length; i++) {
    const point = positions[i]
    ctx.beginPath()
    ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Helper function to draw face shape outline
function drawFaceShapeOutline(
  ctx: CanvasRenderingContext2D,
  detection: faceapi.WithFaceLandmarks<
    faceapi.WithFaceExpressions<faceapi.WithAge<faceapi.WithGender<faceapi.WithFaceDetection<{}>>>>
  >,
) {
  const landmarks = detection.landmarks
  const jawOutline = landmarks.getJawOutline()
  const nose = landmarks.getNose()
  const leftEye = landmarks.getLeftEye()
  const rightEye = landmarks.getRightEye()

  // Calculate face shape
  const faceShape = determineFaceShape(landmarks)

  // Draw face shape outline based on detected shape
  ctx.strokeStyle = "rgba(0, 120, 255, 0.7)"
  ctx.lineWidth = 3
  ctx.beginPath()

  // Get key points for drawing
  const topOfHead = { x: nose[0].x, y: jawOutline[0].y - (jawOutline[8].y - jawOutline[0].y) * 0.7 }
  const leftTemple = jawOutline[0]
  const rightTemple = jawOutline[16]
  const leftCheek = jawOutline[4]
  const rightCheek = jawOutline[12]
  const chin = jawOutline[8]

  // Draw based on face shape
  switch (faceShape) {
    case "Oval":
      // Draw oval shape
      ctx.ellipse(
        nose[0].x,
        (topOfHead.y + chin.y) / 2,
        (rightTemple.x - leftTemple.x) / 2,
        (chin.y - topOfHead.y) / 2,
        0,
        0,
        Math.PI * 2,
      )
      break

    case "Round":
      // Draw round shape
      const centerX = nose[0].x
      const centerY = (topOfHead.y + chin.y) / 2
      const radius = Math.min((rightTemple.x - leftTemple.x) / 2, (chin.y - topOfHead.y) / 2)
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      break

    case "Square":
      // Draw square shape with rounded corners
      const width = rightTemple.x - leftTemple.x
      const height = chin.y - topOfHead.y
      const cornerRadius = width * 0.1

      // Top line
      ctx.moveTo(leftTemple.x + cornerRadius, topOfHead.y)
      ctx.lineTo(rightTemple.x - cornerRadius, topOfHead.y)

      // Top right corner
      ctx.quadraticCurveTo(rightTemple.x, topOfHead.y, rightTemple.x, topOfHead.y + cornerRadius)

      // Right line
      ctx.lineTo(rightTemple.x, chin.y - cornerRadius)

      // Bottom right corner
      ctx.quadraticCurveTo(rightTemple.x, chin.y, rightTemple.x - cornerRadius, chin.y)

      // Bottom line
      ctx.lineTo(leftTemple.x + cornerRadius, chin.y)

      // Bottom left corner
      ctx.quadraticCurveTo(leftTemple.x, chin.y, leftTemple.x, chin.y - cornerRadius)

      // Left line
      ctx.lineTo(leftTemple.x, topOfHead.y + cornerRadius)

      // Top left corner
      ctx.quadraticCurveTo(leftTemple.x, topOfHead.y, leftTemple.x + cornerRadius, topOfHead.y)
      break

    case "Heart":
      // Draw heart shape
      ctx.moveTo(nose[0].x, chin.y)

      // Right side
      ctx.quadraticCurveTo(rightCheek.x, (chin.y + rightCheek.y) / 2, rightTemple.x, rightTemple.y)

      // Top
      ctx.quadraticCurveTo(
        (rightTemple.x + nose[0].x) / 2,
        topOfHead.y - (topOfHead.y - rightTemple.y) * 0.5,
        nose[0].x,
        topOfHead.y,
      )

      // Left side
      ctx.quadraticCurveTo(
        (leftTemple.x + nose[0].x) / 2,
        topOfHead.y - (topOfHead.y - leftTemple.y) * 0.5,
        leftTemple.x,
        leftTemple.y,
      )

      ctx.quadraticCurveTo(leftCheek.x, (chin.y + leftCheek.y) / 2, nose[0].x, chin.y)
      break

    case "Diamond":
      // Draw diamond shape
      ctx.moveTo(nose[0].x, topOfHead.y)
      ctx.lineTo(rightCheek.x, (topOfHead.y + chin.y) / 2)
      ctx.lineTo(nose[0].x, chin.y)
      ctx.lineTo(leftCheek.x, (topOfHead.y + chin.y) / 2)
      ctx.closePath()
      break

    case "Oblong":
      // Draw oblong shape
      const oblongWidth = rightTemple.x - leftTemple.x
      const oblongHeight = chin.y - topOfHead.y
      const oblongCornerRadius = oblongWidth * 0.25

      // Top line
      ctx.moveTo(leftTemple.x + oblongCornerRadius, topOfHead.y)
      ctx.lineTo(rightTemple.x - oblongCornerRadius, topOfHead.y)

      // Top right corner
      ctx.quadraticCurveTo(rightTemple.x, topOfHead.y, rightTemple.x, topOfHead.y + oblongCornerRadius)

      // Right line
      ctx.lineTo(rightTemple.x, chin.y - oblongCornerRadius)

      // Bottom right corner
      ctx.quadraticCurveTo(rightTemple.x, chin.y, rightTemple.x - oblongCornerRadius, chin.y)

      // Bottom line
      ctx.lineTo(leftTemple.x + oblongCornerRadius, chin.y)

      // Bottom left corner
      ctx.quadraticCurveTo(leftTemple.x, chin.y, leftTemple.x, chin.y - oblongCornerRadius)

      // Left line
      ctx.lineTo(leftTemple.x, topOfHead.y + oblongCornerRadius)

      // Top left corner
      ctx.quadraticCurveTo(leftTemple.x, topOfHead.y, leftTemple.x + oblongCornerRadius, topOfHead.y)
      break

    default:
      // Default to oval if shape not recognized
      ctx.ellipse(
        nose[0].x,
        (topOfHead.y + chin.y) / 2,
        (rightTemple.x - leftTemple.x) / 2,
        (chin.y - topOfHead.y) / 2,
        0,
        0,
        Math.PI * 2,
      )
  }

  ctx.stroke()
}

// Helper function to draw measurements
function drawMeasurements(
  ctx: CanvasRenderingContext2D,
  detection: faceapi.WithFaceLandmarks<
    faceapi.WithFaceExpressions<faceapi.WithAge<faceapi.WithGender<faceapi.WithFaceDetection<{}>>>>
  >,
  measurementType: "basic" | "detailed" | "thirds" | "golden",
) {
  const landmarks = detection.landmarks
  const positions = landmarks.positions
  const jawOutline = landmarks.getJawOutline()
  const leftEye = landmarks.getLeftEye()
  const rightEye = landmarks.getRightEye()
  const nose = landmarks.getNose()

  // Set styles for measurement lines
  ctx.strokeStyle = "rgba(255, 255, 0, 0.7)"
  ctx.lineWidth = 2
  ctx.font = "14px Arial"
  ctx.fillStyle = "rgba(255, 255, 0, 0.9)"

  // Basic measurements (always shown)
  if (measurementType === "basic" || measurementType === "detailed") {
    // Face width
    ctx.beginPath()
    ctx.moveTo(jawOutline[0].x, jawOutline[0].y)
    ctx.lineTo(jawOutline[16].x, jawOutline[16].y)
    ctx.stroke()

    // Face height
    ctx.beginPath()
    ctx.moveTo(positions[27].x, positions[27].y - 10)
    ctx.lineTo(positions[8].x, positions[8].y + 10)
    ctx.stroke()

    // Add labels
    const faceWidth = Math.abs(jawOutline[16].x - jawOutline[0].x)
    const faceHeight = Math.abs(positions[8].y - positions[27].y + 20)

    ctx.fillText(`Width: ${Math.round(faceWidth)}px`, jawOutline[16].x - 100, jawOutline[16].y - 10)
    ctx.fillText(`Height: ${Math.round(faceHeight)}px`, positions[8].x + 10, positions[8].y)
  }

  // Detailed measurements
  if (measurementType === "detailed") {
    // Jaw width
    ctx.beginPath()
    ctx.moveTo(jawOutline[2].x, jawOutline[2].y)
    ctx.lineTo(jawOutline[14].x, jawOutline[14].y)
    ctx.stroke()

    // Cheek width
    ctx.beginPath()
    ctx.moveTo(jawOutline[4].x, jawOutline[4].y)
    ctx.lineTo(jawOutline[12].x, jawOutline[12].y)
    ctx.stroke()

    // Eye distance
    ctx.beginPath()
    const leftEyeCenter = { x: (leftEye[0].x + leftEye[3].x) / 2, y: (leftEye[0].y + leftEye[3].y) / 2 }
    const rightEyeCenter = { x: (rightEye[0].x + rightEye[3].x) / 2, y: (rightEye[0].y + rightEye[3].y) / 2 }
    ctx.moveTo(leftEyeCenter.x, leftEyeCenter.y)
    ctx.lineTo(rightEyeCenter.x, rightEyeCenter.y)
    ctx.stroke()

    // Add labels
    const jawWidth = Math.abs(jawOutline[14].x - jawOutline[2].x)
    const cheekWidth = Math.abs(jawOutline[12].x - jawOutline[4].x)
    const eyeDistance = Math.abs(rightEyeCenter.x - leftEyeCenter.x)

    ctx.fillText(`Jaw: ${Math.round(jawWidth)}px`, (jawOutline[2].x + jawOutline[14].x) / 2 - 40, jawOutline[2].y + 20)
    ctx.fillText(
      `Cheek: ${Math.round(cheekWidth)}px`,
      (jawOutline[4].x + jawOutline[12].x) / 2 - 40,
      jawOutline[4].y - 10,
    )
    ctx.fillText(
      `Eyes: ${Math.round(eyeDistance)}px`,
      (leftEyeCenter.x + rightEyeCenter.x) / 2 - 40,
      leftEyeCenter.y - 10,
    )
  }

  // Facial thirds
  if (measurementType === "thirds") {
    const topOfFace = positions[27].y - 10
    const bottomOfFace = positions[8].y + 10
    const faceHeight = bottomOfFace - topOfFace

    // Draw lines for facial thirds
    const firstThird = topOfFace + faceHeight / 3
    const secondThird = topOfFace + (faceHeight * 2) / 3

    ctx.strokeStyle = "rgba(255, 165, 0, 0.7)" // Orange
    ctx.setLineDash([5, 5])

    // First third line
    ctx.beginPath()
    ctx.moveTo(jawOutline[0].x - 20, firstThird)
    ctx.lineTo(jawOutline[16].x + 20, firstThird)
    ctx.stroke()

    // Second third line
    ctx.beginPath()
    ctx.moveTo(jawOutline[0].x - 20, secondThird)
    ctx.lineTo(jawOutline[16].x + 20, secondThird)
    ctx.stroke()

    ctx.setLineDash([])

    // Add labels
    ctx.fillStyle = "rgba(255, 165, 0, 0.9)"
    ctx.fillText("Upper Third", jawOutline[0].x, topOfFace + faceHeight / 6)
    ctx.fillText("Middle Third", jawOutline[0].x, topOfFace + faceHeight / 2)
    ctx.fillText("Lower Third", jawOutline[0].x, topOfFace + (faceHeight * 5) / 6)
  }

  // Golden ratio
  if (measurementType === "golden") {
    const faceWidth = Math.abs(jawOutline[16].x - jawOutline[0].x)
    const faceHeight = Math.abs(positions[8].y - positions[27].y + 20)
    const ratio = faceHeight / faceWidth
    const goldenRatio = 1.618
    const goldenRatioScore = 1 - Math.abs(ratio - goldenRatio) / goldenRatio

    // Draw golden ratio spiral (simplified)
    ctx.strokeStyle = "rgba(218, 165, 32, 0.7)" // Golden color
    ctx.lineWidth = 2

    const centerX = (jawOutline[0].x + jawOutline[16].x) / 2
    const centerY = (positions[27].y + positions[8].y) / 2
    const maxRadius = Math.min(faceWidth, faceHeight) / 2

    // Draw spiral
    for (let i = 0; i < 5; i++) {
      const radius = maxRadius * (1 - i * 0.2)
      const startAngle = (i * Math.PI) / 2
      const endAngle = ((i + 1) * Math.PI) / 2

      ctx.beginPath()
      ctx.arc(
        centerX + Math.cos(startAngle) * radius * 0.2,
        centerY + Math.sin(startAngle) * radius * 0.2,
        radius,
        startAngle,
        endAngle,
      )
      ctx.stroke()
    }

    // Add golden ratio score
    ctx.fillStyle = "rgba(218, 165, 32, 0.9)"
    ctx.fillText(`Golden Ratio: ${(goldenRatioScore * 100).toFixed(0)}%`, centerX - 70, positions[27].y - 20)
    ctx.fillText(`(${ratio.toFixed(2)} : 1)`, centerX - 40, positions[27].y - 40)
  }
}

// Helper function to determine face shape from landmarks
function determineFaceShape(landmarks: faceapi.FaceLandmarks68): string {
  // Get key points from landmarks
  const jawPoints = landmarks.getJawOutline()
  const faceWidth = Math.abs(jawPoints[16].x - jawPoints[0].x)
  const jawWidth = Math.abs(jawPoints[14].x - jawPoints[2].x)
  const cheekWidth = Math.abs(jawPoints[12].x - jawPoints[4].x)
  const faceHeight = landmarks.positions[8].y - landmarks.positions[27].y
  const foreheadHeight = landmarks.positions[27].y - jawPoints[0].y
  const chinHeight = landmarks.positions[8].y - landmarks.positions[57].y
  const jawHeight = landmarks.positions[8].y - jawPoints[9].y

  // Calculate ratios
  const widthToHeightRatio = faceWidth / faceHeight
  const jawToFaceWidthRatio = jawWidth / faceWidth
  const cheekToJawRatio = cheekWidth / jawWidth
  const foreheadToChinRatio = foreheadHeight / chinHeight

  // Determine face shape based on ratios
  if (widthToHeightRatio > 0.85 && jawToFaceWidthRatio > 0.78) {
    return "Round"
  } else if (widthToHeightRatio < 0.75 && jawToFaceWidthRatio < 0.7) {
    return "Oval"
  } else if (jawToFaceWidthRatio > 0.85 && cheekToJawRatio < 1.1) {
    return "Square"
  } else if (cheekToJawRatio > 1.15 && foreheadToChinRatio < 0.9) {
    return "Heart"
  } else if (jawToFaceWidthRatio < 0.8 && cheekToJawRatio > 1.05) {
    return "Diamond"
  } else if (widthToHeightRatio < 0.8 && jawToFaceWidthRatio > 0.7 && jawHeight / faceHeight < 0.3) {
    return "Oblong"
  } else if (cheekToJawRatio < 0.9 && jawToFaceWidthRatio > 0.8 && widthToHeightRatio < 0.85) {
    return "Rectangle"
  } else if (jawToFaceWidthRatio < 0.6 && widthToHeightRatio > 0.75) {
    return "Triangle"
  } else {
    return "Oval" // Default to oval if no clear match
  }
}
