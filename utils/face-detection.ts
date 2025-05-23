import * as faceapi from "face-api.js"

// Track if models are loaded to avoid reloading
let modelsLoaded = false

/**
 * Load face-api.js models
 */
export async function loadFaceDetectionModels() {
  if (modelsLoaded) return

  try {
    // Set the models path
    const MODEL_URL = "/models"

    // Load the required models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ])

    console.log("Face detection models loaded successfully")
    modelsLoaded = true
    return true
  } catch (error) {
    console.error("Error loading face detection models:", error)
    return false
  }
}

/**
 * Detect faces in an image
 */
export async function detectFaces(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
  if (!modelsLoaded) {
    await loadFaceDetectionModels()
  }

  try {
    // Detect all faces and get landmarks
    const detections = await faceapi
      .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 }))
      .withFaceLandmarks()
      .withFaceExpressions()

    return detections
  } catch (error) {
    console.error("Error detecting faces:", error)
    return []
  }
}

/**
 * Analyze face shape based on landmarks
 */
export function analyzeFaceShape(landmarks: faceapi.FaceLandmarks68) {
  if (!landmarks) return null

  // Get face measurements
  const jawPoints = landmarks.getJawOutline()
  const nose = landmarks.getNose()
  const leftEye = landmarks.getLeftEye()
  const rightEye = landmarks.getRightEye()
  const mouth = landmarks.getMouth()

  // Calculate face width (distance between jaw edges)
  const faceWidth = Math.abs(jawPoints[0].x - jawPoints[16].x)

  // Calculate face height (from chin to forehead)
  const faceHeight = Math.abs(jawPoints[8].y - landmarks.positions[27].y)

  // Calculate forehead width
  const foreheadWidth = Math.abs(landmarks.positions[0].x - landmarks.positions[16].x)

  // Calculate jawline width
  const jawWidth = Math.abs(jawPoints[3].x - jawPoints[13].x)

  // Calculate cheekbone width
  const cheekboneWidth = Math.abs(jawPoints[2].x - jawPoints[14].x)

  // Calculate ratios
  const widthToHeightRatio = faceWidth / faceHeight
  const foreheadToJawRatio = foreheadWidth / jawWidth
  const cheekboneToJawRatio = cheekboneWidth / jawWidth

  // Determine face shape based on ratios
  let faceShape = ""
  let confidence = 0

  // Face shape determination logic
  if (widthToHeightRatio > 0.85 && widthToHeightRatio < 0.95 && foreheadToJawRatio < 1.2) {
    // Oval face shape
    faceShape = "Oval"
    confidence = 0.8 + (0.95 - widthToHeightRatio) * 2
  } else if (widthToHeightRatio >= 0.95 && cheekboneToJawRatio < 1.1) {
    // Round face shape
    faceShape = "Round"
    confidence = 0.7 + (widthToHeightRatio - 0.95) * 2
  } else if (foreheadToJawRatio < 1.1 && cheekboneToJawRatio < 1.1) {
    // Square face shape
    faceShape = "Square"
    confidence = 0.75 + (1.1 - foreheadToJawRatio) * 2
  } else if (foreheadToJawRatio > 1.3) {
    // Heart face shape
    faceShape = "Heart"
    confidence = 0.7 + (foreheadToJawRatio - 1.3) * 0.5
  } else if (cheekboneToJawRatio > 1.3 && foreheadToJawRatio < 1.2) {
    // Diamond face shape
    faceShape = "Diamond"
    confidence = 0.7 + (cheekboneToJawRatio - 1.3) * 0.5
  } else if (widthToHeightRatio < 0.8) {
    // Rectangle face shape
    faceShape = "Rectangle"
    confidence = 0.7 + (0.8 - widthToHeightRatio) * 2
  } else if (foreheadToJawRatio < 0.9) {
    // Triangle face shape
    faceShape = "Triangle"
    confidence = 0.7 + (0.9 - foreheadToJawRatio) * 2
  } else {
    // Default to Oval if no clear match
    faceShape = "Oval"
    confidence = 0.6
  }

  // Ensure confidence is between 0 and 1
  confidence = Math.min(Math.max(confidence, 0), 1)

  // Calculate measurements in cm (approximate)
  const pixelToCmRatio = 0.026458 // Approximate ratio
  const measurements = {
    faceWidth: (faceWidth * pixelToCmRatio).toFixed(1),
    faceHeight: (faceHeight * pixelToCmRatio).toFixed(1),
    jawWidth: (jawWidth * pixelToCmRatio).toFixed(1),
    foreheadWidth: (foreheadWidth * pixelToCmRatio).toFixed(1),
    cheekboneWidth: (cheekboneWidth * pixelToCmRatio).toFixed(1),
  }

  return {
    shape: faceShape,
    confidence: confidence,
    measurements,
    widthToHeightRatio,
    foreheadToJawRatio,
    cheekboneToJawRatio,
  }
}

/**
 * Draw face landmarks on canvas
 */
export function drawFaceLandmarks(
  canvas: HTMLCanvasElement,
  detections: faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>[],
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw each detection
  detections.forEach((detection) => {
    // Draw face detection box
    const box = detection.detection.box
    ctx.strokeStyle = "#43a047"
    ctx.lineWidth = 2
    ctx.strokeRect(box.x, box.y, box.width, box.height)

    // Draw face landmarks
    const landmarks = detection.landmarks
    const points = landmarks.positions

    // Draw all points
    ctx.fillStyle = "#2196f3"
    points.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw jawline
    ctx.strokeStyle = "#e91e63"
    ctx.lineWidth = 2
    ctx.beginPath()
    const jawPoints = landmarks.getJawOutline()
    ctx.moveTo(jawPoints[0].x, jawPoints[0].y)
    jawPoints.forEach((point) => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.stroke()

    // Draw eyes
    ctx.strokeStyle = "#9c27b0"
    const leftEye = landmarks.getLeftEye()
    ctx.beginPath()
    ctx.moveTo(leftEye[0].x, leftEye[0].y)
    leftEye.forEach((point) => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.closePath()
    ctx.stroke()

    const rightEye = landmarks.getRightEye()
    ctx.beginPath()
    ctx.moveTo(rightEye[0].x, rightEye[0].y)
    rightEye.forEach((point) => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.closePath()
    ctx.stroke()

    // Draw nose
    ctx.strokeStyle = "#ff9800"
    const nose = landmarks.getNose()
    ctx.beginPath()
    ctx.moveTo(nose[0].x, nose[0].y)
    nose.forEach((point) => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.stroke()

    // Draw mouth
    ctx.strokeStyle = "#03a9f4"
    const mouth = landmarks.getMouth()
    ctx.beginPath()
    ctx.moveTo(mouth[0].x, mouth[0].y)
    mouth.forEach((point) => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.closePath()
    ctx.stroke()
  })
}

/**
 * Get face shape recommendations
 */
export function getFaceShapeRecommendations(faceShape: string) {
  const recommendations = {
    Oval: {
      description: "You have an oval face shape, characterized by balanced proportions and a gently rounded jawline.",
      frames: ["Rectangle", "Square", "Aviator", "Wayfarer"],
      colors: ["Tortoise", "Brown", "Gold", "Black"],
      avoid: ["Oversized frames", "Very small frames"],
    },
    Round: {
      description: "You have a round face shape, characterized by soft curves and similar width and length dimensions.",
      frames: ["Rectangle", "Square", "Wayfarer", "Angular frames"],
      colors: ["Black", "Blue", "Tortoise", "Dark colors"],
      avoid: ["Round frames", "Small frames"],
    },
    Square: {
      description:
        "You have a square face shape, characterized by a strong jawline and forehead with similar width dimensions.",
      frames: ["Round", "Oval", "Rimless", "Semi-rimless"],
      colors: ["Burgundy", "Brown", "Gray", "Soft colors"],
      avoid: ["Square frames", "Geometric shapes"],
    },
    Heart: {
      description:
        "You have a heart-shaped face, characterized by a wider forehead that narrows down to a pointed chin.",
      frames: ["Oval", "Light rimmed", "Cat-eye", "Bottom-heavy frames"],
      colors: ["Light brown", "Transparent", "Rose gold", "Light colors"],
      avoid: ["Top-heavy frames", "Decorative temples"],
    },
    Diamond: {
      description:
        "You have a diamond face shape, characterized by a narrow forehead and jawline with wider cheekbones.",
      frames: ["Cat-eye", "Oval", "Rimless", "Frames with detailing on top"],
      colors: ["Purple", "Blue", "Black", "Bright colors"],
      avoid: ["Narrow frames", "Angular frames"],
    },
    Rectangle: {
      description:
        "You have a rectangular face shape, characterized by a longer face with a forehead, cheekbones, and jawline of similar width.",
      frames: ["Round", "Square with softer edges", "Oversized", "Decorative temples"],
      colors: ["Dark brown", "Green", "Tortoise", "Bold colors"],
      avoid: ["Small frames", "Rectangle frames"],
    },
    Triangle: {
      description:
        "You have a triangular face shape, characterized by a wider jawline that narrows towards the forehead.",
      frames: ["Cat-eye", "Browline", "Decorative temples", "Top-heavy frames"],
      colors: ["Black", "Navy", "Crystal", "Dark colors"],
      avoid: ["Bottom-heavy frames", "Low-sitting frames"],
    },
  }

  return recommendations[faceShape as keyof typeof recommendations] || recommendations.Oval
}
