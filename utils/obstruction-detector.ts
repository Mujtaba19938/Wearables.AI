// Types of face obstructions that can affect analysis accuracy
export type FaceObstruction = {
  type: "glasses" | "hat" | "mask" | "beard" | "hair" | "other" | null
  confidence: number
  message: string
}

/**
 * Analyzes an image to detect common face obstructions
 * This can be used with both face-api.js results and our standalone analyzer
 */
export function detectFaceObstructions(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  landmarks?: Array<{ x: number; y: number }>,
  faceExpressions?: any,
): FaceObstruction | null {
  // If we don't have landmarks, we can't detect obstructions accurately
  if (!landmarks || landmarks.length === 0) {
    return null
  }

  // Check for glasses by analyzing eye region landmarks
  // In face-api.js, landmarks[36-41] are left eye, landmarks[42-47] are right eye
  const hasGlasses = checkForGlasses(imageElement, landmarks)
  if (hasGlasses) {
    return {
      type: "glasses",
      confidence: 0.85,
      message: "Please remove glasses for more accurate face shape analysis",
    }
  }

  // Check for hats/caps by analyzing forehead region
  const hasHat = checkForHat(imageElement, landmarks)
  if (hasHat) {
    return {
      type: "hat",
      confidence: 0.8,
      message: "Please remove hats, caps or hair covering your forehead for accurate analysis",
    }
  }

  // Check for masks by analyzing mouth and nose region
  const hasMask = checkForMask(imageElement, landmarks, faceExpressions)
  if (hasMask) {
    return {
      type: "mask",
      confidence: 0.9,
      message: "Please remove face masks for complete face shape analysis",
    }
  }

  // Check if hair is covering significant parts of the face
  const hairObstruction = checkForHairObstruction(imageElement, landmarks)
  if (hairObstruction) {
    return {
      type: "hair",
      confidence: 0.75,
      message: "Please pull back hair from covering your face for better analysis",
    }
  }

  return null
}

// Helper function to check for glasses
function checkForGlasses(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  landmarks: Array<{ x: number; y: number }>,
): boolean {
  // For full face-api landmarks (68 points)
  if (landmarks.length >= 68) {
    try {
      // Create a temporary canvas to analyze the eye region
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return false

      // Set canvas dimensions
      canvas.width = imageElement.width || (imageElement as HTMLImageElement).naturalWidth || 300
      canvas.height = imageElement.height || (imageElement as HTMLImageElement).naturalHeight || 300

      // Draw the image
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height)

      // Define eye regions based on landmarks
      const leftEyeRegion = {
        x: Math.min(...landmarks.slice(36, 42).map((p) => p.x)),
        y: Math.min(...landmarks.slice(36, 42).map((p) => p.y)),
        width:
          Math.max(...landmarks.slice(36, 42).map((p) => p.x)) - Math.min(...landmarks.slice(36, 42).map((p) => p.x)),
        height:
          Math.max(...landmarks.slice(36, 42).map((p) => p.y)) - Math.min(...landmarks.slice(36, 42).map((p) => p.y)),
      }

      // Expand the region slightly to include potential glasses frames
      leftEyeRegion.x = Math.max(0, leftEyeRegion.x - leftEyeRegion.width * 0.5)
      leftEyeRegion.y = Math.max(0, leftEyeRegion.y - leftEyeRegion.height * 0.5)
      leftEyeRegion.width = Math.min(canvas.width - leftEyeRegion.x, leftEyeRegion.width * 2)
      leftEyeRegion.height = Math.min(canvas.height - leftEyeRegion.y, leftEyeRegion.height * 2)

      // Get image data from the eye region
      const imageData = ctx.getImageData(leftEyeRegion.x, leftEyeRegion.y, leftEyeRegion.width, leftEyeRegion.height)

      // Analyze for straight lines and high contrast edges that might indicate glasses
      // This is a simplified approach - a real implementation would use more sophisticated edge detection
      let edgeCount = 0
      const data = imageData.data

      // Simple horizontal edge detection
      for (let y = 1; y < leftEyeRegion.height - 1; y++) {
        for (let x = 1; x < leftEyeRegion.width - 1; x++) {
          const idx = (y * leftEyeRegion.width + x) * 4
          const idxAbove = ((y - 1) * leftEyeRegion.width + x) * 4

          // Calculate difference between adjacent pixels
          const diff =
            Math.abs(data[idx] - data[idxAbove]) +
            Math.abs(data[idx + 1] - data[idxAbove + 1]) +
            Math.abs(data[idx + 2] - data[idxAbove + 2])

          if (diff > 100) {
            // Threshold for edge detection
            edgeCount++
          }
        }
      }

      // If we detect a significant number of edges, it might be glasses
      const edgeDensity = edgeCount / (leftEyeRegion.width * leftEyeRegion.height)
      return edgeDensity > 0.05 // Threshold determined empirically
    } catch (e) {
      console.error("Error checking for glasses:", e)
      return false
    }
  }

  // For simplified landmarks (fallback mode)
  else {
    // In simplified mode, we can't reliably detect glasses
    // We could implement a more basic check here if needed
    return false
  }
}

// Helper function to check for hats/caps
function checkForHat(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  landmarks: Array<{ x: number; y: number }>,
): boolean {
  // For full face-api landmarks (68 points)
  if (landmarks.length >= 68) {
    try {
      // Create a temporary canvas to analyze the forehead region
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return false

      // Set canvas dimensions
      canvas.width = imageElement.width || (imageElement as HTMLImageElement).naturalWidth || 300
      canvas.height = imageElement.height || (imageElement as HTMLImageElement).naturalHeight || 300

      // Draw the image
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height)

      // Define forehead region based on landmarks
      // Eyebrows are landmarks 17-26
      const eyebrowTop = Math.min(...landmarks.slice(17, 27).map((p) => p.y))
      const foreheadTop = Math.max(0, eyebrowTop - (landmarks[8].y - eyebrowTop) * 0.7) // Estimate forehead top

      const foreheadRegion = {
        x: Math.min(landmarks[0].x, landmarks[17].x),
        y: foreheadTop,
        width: Math.abs(landmarks[16].x - landmarks[0].x),
        height: eyebrowTop - foreheadTop,
      }

      // Get image data from the forehead region
      const imageData = ctx.getImageData(
        foreheadRegion.x,
        foreheadRegion.y,
        foreheadRegion.width,
        foreheadRegion.height,
      )

      // Analyze color consistency and texture in the forehead region
      // Hats often have more uniform color and texture than skin/hair
      const data = imageData.data
      let colorVariance = 0
      const totalPixels = foreheadRegion.width * foreheadRegion.height

      // Calculate average color
      let rSum = 0,
        gSum = 0,
        bSum = 0
      for (let i = 0; i < data.length; i += 4) {
        rSum += data[i]
        gSum += data[i + 1]
        bSum += data[i + 2]
      }

      const rAvg = rSum / totalPixels
      const gAvg = gSum / totalPixels
      const bAvg = bSum / totalPixels

      // Calculate variance
      for (let i = 0; i < data.length; i += 4) {
        colorVariance += Math.abs(data[i] - rAvg) + Math.abs(data[i + 1] - gAvg) + Math.abs(data[i + 2] - bAvg)
      }

      colorVariance /= totalPixels

      // Low variance might indicate a hat (more uniform color)
      return colorVariance < 30 // Threshold determined empirically
    } catch (e) {
      console.error("Error checking for hat:", e)
      return false
    }
  }

  // For simplified landmarks (fallback mode)
  else {
    // In simplified mode, we can't reliably detect hats
    return false
  }
}

// Helper function to check for masks
function checkForMask(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  landmarks: Array<{ x: number; y: number }>,
  faceExpressions?: any,
): boolean {
  // If we have face expressions data from face-api.js, use it
  if (faceExpressions) {
    // If mouth expressions are very low, might indicate a mask
    const mouthExpressions =
      (faceExpressions.happy || 0) + (faceExpressions.sad || 0) + (faceExpressions.surprised || 0)

    if (mouthExpressions < 0.1) {
      return true
    }
  }

  // For full face-api landmarks (68 points)
  if (landmarks.length >= 68) {
    try {
      // Create a temporary canvas to analyze the mouth region
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return false

      // Set canvas dimensions
      canvas.width = imageElement.width || (imageElement as HTMLImageElement).naturalWidth || 300
      canvas.height = imageElement.height || (imageElement as HTMLImageElement).naturalHeight || 300

      // Draw the image
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height)

      // Define mouth region based on landmarks (48-68 are mouth landmarks)
      const mouthRegion = {
        x: Math.min(...landmarks.slice(48, 68).map((p) => p.x)),
        y: Math.min(...landmarks.slice(48, 68).map((p) => p.y)),
        width:
          Math.max(...landmarks.slice(48, 68).map((p) => p.x)) - Math.min(...landmarks.slice(48, 68).map((p) => p.x)),
        height:
          Math.max(...landmarks.slice(48, 68).map((p) => p.y)) - Math.min(...landmarks.slice(48, 68).map((p) => p.y)),
      }

      // Expand the region slightly
      mouthRegion.x = Math.max(0, mouthRegion.x - mouthRegion.width * 0.2)
      mouthRegion.y = Math.max(0, mouthRegion.y - mouthRegion.height * 0.2)
      mouthRegion.width = Math.min(canvas.width - mouthRegion.x, mouthRegion.width * 1.4)
      mouthRegion.height = Math.min(canvas.height - mouthRegion.y, mouthRegion.height * 1.4)

      // Get image data from the mouth region
      const imageData = ctx.getImageData(mouthRegion.x, mouthRegion.y, mouthRegion.width, mouthRegion.height)

      // Analyze color and texture patterns that might indicate a mask
      const data = imageData.data
      let skinTonePixels = 0
      const totalPixels = mouthRegion.width * mouthRegion.height

      // Count pixels that match common skin tone ranges
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Simple skin tone detection
        if (r > g && r > b && r > 60 && r < 200 && g > 40 && g < 180 && b > 20 && b < 170) {
          skinTonePixels++
        }
      }

      // If less than 40% of pixels match skin tones, might be a mask
      return skinTonePixels / totalPixels < 0.4
    } catch (e) {
      console.error("Error checking for mask:", e)
      return false
    }
  }

  // For simplified landmarks (fallback mode)
  else {
    // In simplified mode, we can't reliably detect masks
    return false
  }
}

// Helper function to check for hair obstructing the face
function checkForHairObstruction(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  landmarks: Array<{ x: number; y: number }>,
): boolean {
  // For full face-api landmarks (68 points)
  if (landmarks.length >= 68) {
    // Check if jawline landmarks are clearly visible
    // If many jawline points are close to each other, hair might be obstructing
    const jawPoints = landmarks.slice(0, 17)

    // Calculate average distance between consecutive jaw points
    let totalDistance = 0
    for (let i = 1; i < jawPoints.length; i++) {
      const dx = jawPoints[i].x - jawPoints[i - 1].x
      const dy = jawPoints[i].y - jawPoints[i - 1].y
      totalDistance += Math.sqrt(dx * dx + dy * dy)
    }

    const avgDistance = totalDistance / (jawPoints.length - 1)

    // If average distance is very small, might indicate hair obstruction
    // This threshold would need to be calibrated based on image size
    const expectedMinDistance = (imageElement.width || (imageElement as HTMLImageElement).naturalWidth || 300) * 0.01

    return avgDistance < expectedMinDistance
  }

  // For simplified landmarks (fallback mode)
  else {
    // In simplified mode, we can't reliably detect hair obstruction
    return false
  }
}
