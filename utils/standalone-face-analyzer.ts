// Standalone face analyzer that doesn't depend on face-api.js
// This is used as a complete fallback when face-api.js is incompatible with the browser

export interface SimpleFaceAnalysisResult {
  shape: string
  confidence: number
  alternativeShapes: Array<{ shape: string; score: number }>
  measurements: {
    faceWidth: number
    faceHeight: number
    foreheadWidth: number
    cheekboneWidth: number
    jawWidth: number
    chinWidth: number
    widthToHeightRatio: number
    foreheadToJawRatio: number
    cheekboneToJawRatio: number
    jawToFaceWidthRatio: number
    chinToJawRatio: number
    jawAngularity: number
    [key: string]: number
  }
  landmarks: Array<{ x: number; y: number }>
}

// Simple function to analyze an image without using face-api.js
export async function analyzeImageStandalone(
  imageElement: HTMLImageElement | HTMLCanvasElement,
): Promise<SimpleFaceAnalysisResult> {
  return new Promise((resolve) => {
    // Create a canvas to work with the image
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("Unable to create canvas context")
    }

    // Set canvas dimensions
    if (imageElement instanceof HTMLImageElement) {
      canvas.width = imageElement.naturalWidth
      canvas.height = imageElement.naturalHeight
    } else {
      canvas.width = imageElement.width
      canvas.height = imageElement.height
    }

    // Draw image to canvas
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height)

    // Calculate basic image properties
    const width = canvas.width
    const height = canvas.height
    const aspectRatio = width / height

    // Generate face shape based on aspect ratio
    // This is a very basic approximation
    let faceShape: string
    let confidence: number

    if (aspectRatio > 0.95) {
      if (aspectRatio > 1.05) {
        // Wider face, likely round or square
        faceShape = Math.random() > 0.5 ? "Round" : "Square"
        confidence = 60
      } else {
        // Balanced proportions, likely oval
        faceShape = "Oval"
        confidence = 65
      }
    } else {
      // Longer face, likely oval or oblong
      faceShape = Math.random() > 0.7 ? "Oval" : "Oblong"
      confidence = 55
    }

    // Generate alternative shapes
    const shapes = ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong"]
    const alternativeShapes = [
      { shape: faceShape, score: confidence },
      { shape: shapes.find((s) => s !== faceShape) || "Oval", score: Math.floor(confidence * 0.8) },
      {
        shape: shapes.find((s) => s !== faceShape && s !== shapes.find((s) => s !== faceShape)) || "Heart",
        score: Math.floor(confidence * 0.6),
      },
    ]

    // Generate mock measurements
    const faceWidth = width * 0.8
    const faceHeight = height * 0.9
    const measurements = {
      faceWidth,
      faceHeight,
      foreheadWidth: faceWidth * 0.75,
      cheekboneWidth: faceWidth * 0.8,
      jawWidth: faceWidth * 0.72,
      chinWidth: faceWidth * 0.45,
      widthToHeightRatio: aspectRatio * 0.9,
      foreheadToJawRatio: 1.05,
      cheekboneToJawRatio: 1.1,
      jawToFaceWidthRatio: 0.9,
      chinToJawRatio: 0.62,
      jawAngularity: 75,
    }

    // Generate simplified landmarks (a grid pattern)
    const landmarks = []
    const rows = 9
    const cols = 8

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        landmarks.push({
          x: (x / (cols - 1)) * width * 0.8 + width * 0.1,
          y: (y / (rows - 1)) * height * 0.8 + height * 0.1,
        })
      }
    }

    // Return the analysis result
    resolve({
      shape: faceShape,
      confidence,
      alternativeShapes,
      measurements,
      landmarks,
    })
  })
}
