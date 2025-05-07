import type { FrameMeasurements } from "@/components/frame-measurements-display"

// Face measurement types
export interface FaceMeasurements {
  faceWidth: number
  faceHeight: number
  noseBridgeWidth: number
  templeToTempleDistance: number
  faceShape: string
  cheekboneWidth: number
  jawWidth: number
  foreheadWidth: number
}

// Fit prediction result
export interface FitPredictionResult {
  overallScore: number // 0-100
  widthFit: {
    score: number // 0-100
    status: "too narrow" | "too wide" | "good fit"
    message: string
  }
  heightFit: {
    score: number // 0-100
    status: "too short" | "too tall" | "good fit"
    message: string
  }
  bridgeFit: {
    score: number // 0-100
    status: "too narrow" | "too wide" | "good fit"
    message: string
  }
  styleFit: {
    score: number // 0-100
    status: "not ideal" | "acceptable" | "good match" | "excellent match"
    message: string
  }
  recommendations: string[]
}

// Frame shape compatibility with face shapes
const frameShapeCompatibility: Record<string, Record<string, number>> = {
  Round: {
    Square: 95,
    Rectangle: 90,
    Diamond: 75,
    Heart: 80,
    Oval: 85,
    Oblong: 85,
    Triangle: 60,
    Round: 65,
  },
  Square: {
    Round: 95,
    Oval: 90,
    Heart: 85,
    Diamond: 70,
    Square: 65,
    Rectangle: 70,
    Oblong: 80,
    Triangle: 65,
  },
  Rectangle: {
    Round: 90,
    Oval: 85,
    Heart: 80,
    Diamond: 75,
    Square: 70,
    Rectangle: 65,
    Oblong: 85,
    Triangle: 70,
  },
  Aviator: {
    Triangle: 95,
    Diamond: 90,
    Square: 85,
    Heart: 80,
    Oval: 85,
    Oblong: 90,
    Round: 75,
    Rectangle: 80,
  },
  "Cat-Eye": {
    Heart: 95,
    Diamond: 90,
    Oval: 85,
    Round: 80,
    Square: 75,
    Rectangle: 70,
    Oblong: 80,
    Triangle: 85,
  },
  Wayfarer: {
    Round: 90,
    Oval: 85,
    Heart: 80,
    Diamond: 85,
    Square: 75,
    Rectangle: 70,
    Oblong: 80,
    Triangle: 75,
  },
  Oval: {
    Square: 90,
    Rectangle: 85,
    Diamond: 80,
    Heart: 85,
    Oval: 75,
    Oblong: 80,
    Triangle: 75,
    Round: 70,
  },
}

/**
 * Predicts how well a frame will fit based on face and frame measurements
 */
export function predictFrameFit(
  faceMeasurements: FaceMeasurements,
  frameMeasurements: FrameMeasurements,
  frameShape: string,
): FitPredictionResult {
  // Width fit calculation
  const idealFrameWidth = faceMeasurements.templeToTempleDistance * 0.95
  const widthDifference = Math.abs(frameMeasurements.totalWidth - idealFrameWidth)
  const widthFitPercentage = Math.max(0, 100 - (widthDifference / idealFrameWidth) * 100)

  let widthStatus: "too narrow" | "too wide" | "good fit" = "good fit"
  let widthMessage = "This frame width should fit your face well."

  if (frameMeasurements.totalWidth < idealFrameWidth - 10) {
    widthStatus = "too narrow"
    widthMessage = "This frame may be too narrow for your face width."
  } else if (frameMeasurements.totalWidth > idealFrameWidth + 10) {
    widthStatus = "too wide"
    widthMessage = "This frame may be too wide for your face width."
  }

  // Height fit calculation
  const idealLensHeight = faceMeasurements.faceHeight * 0.3
  const heightDifference = Math.abs(frameMeasurements.lensHeight - idealLensHeight)
  const heightFitPercentage = Math.max(0, 100 - (heightDifference / idealLensHeight) * 100)

  let heightStatus: "too short" | "too tall" | "good fit" = "good fit"
  let heightMessage = "The lens height should complement your face proportions."

  if (frameMeasurements.lensHeight < idealLensHeight - 8) {
    heightStatus = "too short"
    heightMessage = "These lenses may appear too small for your face height."
  } else if (frameMeasurements.lensHeight > idealLensHeight + 8) {
    heightStatus = "too tall"
    heightMessage = "These lenses may appear too large for your face height."
  }

  // Bridge fit calculation
  const idealBridgeWidth = faceMeasurements.noseBridgeWidth + 2
  const bridgeDifference = Math.abs(frameMeasurements.bridgeWidth - idealBridgeWidth)
  const bridgeFitPercentage = Math.max(0, 100 - (bridgeDifference / idealBridgeWidth) * 100)

  let bridgeStatus: "too narrow" | "too wide" | "good fit" = "good fit"
  let bridgeMessage = "The bridge width should fit comfortably on your nose."

  if (frameMeasurements.bridgeWidth < idealBridgeWidth - 3) {
    bridgeStatus = "too narrow"
    bridgeMessage = "This bridge may be too tight on your nose."
  } else if (frameMeasurements.bridgeWidth > idealBridgeWidth + 3) {
    bridgeStatus = "too wide"
    bridgeMessage = "This bridge may be too loose on your nose."
  }

  // Style fit calculation based on face shape compatibility
  const faceShape = faceMeasurements.faceShape
  const normalizedFrameShape = normalizeFrameShape(frameShape)

  let styleFitPercentage = 75 // Default if not found in compatibility matrix
  if (frameShapeCompatibility[normalizedFrameShape] && frameShapeCompatibility[normalizedFrameShape][faceShape]) {
    styleFitPercentage = frameShapeCompatibility[normalizedFrameShape][faceShape]
  }

  let styleStatus: "not ideal" | "acceptable" | "good match" | "excellent match" = "acceptable"
  let styleMessage = "This frame style is acceptable for your face shape."

  if (styleFitPercentage >= 90) {
    styleStatus = "excellent match"
    styleMessage = "This frame style is an excellent match for your face shape."
  } else if (styleFitPercentage >= 80) {
    styleStatus = "good match"
    styleMessage = "This frame style is a good match for your face shape."
  } else if (styleFitPercentage < 70) {
    styleStatus = "not ideal"
    styleMessage = "This frame style may not be ideal for your face shape."
  }

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    widthFitPercentage * 0.3 + heightFitPercentage * 0.2 + bridgeFitPercentage * 0.2 + styleFitPercentage * 0.3,
  )

  // Generate recommendations
  const recommendations: string[] = []

  if (widthStatus !== "good fit") {
    recommendations.push(
      widthStatus === "too narrow"
        ? "Look for frames with a wider total width."
        : "Consider frames with a narrower total width.",
    )
  }

  if (heightStatus !== "good fit") {
    recommendations.push(
      heightStatus === "too short"
        ? "Try frames with taller lenses for better proportion."
        : "Consider frames with shorter lenses for better proportion.",
    )
  }

  if (bridgeStatus !== "good fit") {
    recommendations.push(
      bridgeStatus === "too narrow"
        ? "Look for frames with a wider bridge measurement."
        : "Try frames with a narrower bridge measurement.",
    )
  }

  if (styleStatus === "not ideal") {
    // Suggest better frame shapes for this face shape
    const betterShapes = getBetterFrameShapesForFace(faceShape)
    if (betterShapes.length > 0) {
      recommendations.push(`For your ${faceShape} face shape, consider ${betterShapes.join(", ")} frames.`)
    }
  }

  // If everything is good, add a positive recommendation
  if (recommendations.length === 0) {
    recommendations.push("This frame is a great match for your face measurements and shape!")
  }

  return {
    overallScore,
    widthFit: {
      score: Math.round(widthFitPercentage),
      status: widthStatus,
      message: widthMessage,
    },
    heightFit: {
      score: Math.round(heightFitPercentage),
      status: heightStatus,
      message: heightMessage,
    },
    bridgeFit: {
      score: Math.round(bridgeFitPercentage),
      status: bridgeStatus,
      message: bridgeMessage,
    },
    styleFit: {
      score: Math.round(styleFitPercentage),
      status: styleStatus,
      message: styleMessage,
    },
    recommendations,
  }
}

/**
 * Normalizes frame shape names to match our compatibility matrix
 */
function normalizeFrameShape(frameShape: string): string {
  const shape = frameShape.toLowerCase()

  if (shape.includes("round")) return "Round"
  if (shape.includes("square")) return "Square"
  if (shape.includes("rectangle")) return "Rectangle"
  if (shape.includes("aviator")) return "Aviator"
  if (shape.includes("cat")) return "Cat-Eye"
  if (shape.includes("wayfarer")) return "Wayfarer"
  if (shape.includes("oval")) return "Oval"

  // Default to Oval if no match
  return "Oval"
}

/**
 * Gets better frame shapes for a given face shape
 */
function getBetterFrameShapesForFace(faceShape: string): string[] {
  const betterShapes: string[] = []

  // Find the top 2 frame shapes for this face shape
  Object.entries(frameShapeCompatibility).forEach(([frameShape, compatibilities]) => {
    if (compatibilities[faceShape] && compatibilities[faceShape] >= 85) {
      betterShapes.push(frameShape)
    }
  })

  return betterShapes.slice(0, 2)
}

/**
 * Extracts face measurements from face analysis results
 */
export function extractFaceMeasurementsFromAnalysis(analysisResults: any): FaceMeasurements {
  // Default values in case some measurements are missing
  const defaultMeasurements: FaceMeasurements = {
    faceWidth: 140,
    faceHeight: 180,
    noseBridgeWidth: 16,
    templeToTempleDistance: 145,
    faceShape: "Oval",
    cheekboneWidth: 130,
    jawWidth: 120,
    foreheadWidth: 125,
  }

  // If no analysis results, return defaults
  if (!analysisResults || !analysisResults.measurements) {
    return defaultMeasurements
  }

  // Extract measurements from analysis results
  const { measurements } = analysisResults

  return {
    faceWidth: measurements.faceWidth || defaultMeasurements.faceWidth,
    faceHeight: measurements.faceHeight || defaultMeasurements.faceHeight,
    noseBridgeWidth: measurements.noseBridgeWidth || defaultMeasurements.noseBridgeWidth,
    templeToTempleDistance: measurements.faceWidth * 1.05 || defaultMeasurements.templeToTempleDistance,
    faceShape: analysisResults.shape || defaultMeasurements.faceShape,
    cheekboneWidth: measurements.cheekboneWidth || defaultMeasurements.cheekboneWidth,
    jawWidth: measurements.jawWidth || defaultMeasurements.jawWidth,
    foreheadWidth: measurements.foreheadWidth || defaultMeasurements.foreheadWidth,
  }
}
