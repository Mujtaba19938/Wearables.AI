import * as faceapi from "face-api.js"

// Track loading state
let modelsLoaded = false
let loadingPromise: Promise<void> | null = null
let loadingError: Error | null = null

// Function to load models
export async function loadFaceApiModels() {
  // If models are already loaded, return immediately
  if (modelsLoaded) {
    return
  }

  // If there was a previous loading error, throw it again
  if (loadingError) {
    throw loadingError
  }

  // If models are currently loading, wait for that promise
  if (loadingPromise) {
    return loadingPromise
  }

  // Start loading models
  loadingPromise = (async () => {
    try {
      // Check if we're online
      if (!navigator.onLine) {
        throw new Error("You are offline. Please connect to the internet to load face analysis models.")
      }

      // Set the models path
      const MODEL_URL = "/models"

      // Load all required models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ])

      modelsLoaded = true
      loadingError = null
      console.log("Face-API models loaded successfully")
    } catch (error) {
      console.error("Error loading Face-API models:", error)
      if (error instanceof Error) {
        loadingError = error
      } else {
        loadingError = new Error("Failed to load face analysis models")
      }
      throw loadingError
    } finally {
      loadingPromise = null
    }
  })()

  return loadingPromise
}

// Check if models are loaded
export function areModelsLoaded() {
  return modelsLoaded
}

// Replace the existing detectFaceShape function with this enhanced version:
export async function detectFaceShape(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
  if (!modelsLoaded) {
    await loadFaceApiModels()
  }

  // Detect all faces with landmarks
  const detections = await faceapi
    .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()

  if (!detections.length) {
    throw new Error("No face detected")
  }

  // Get the first face detected
  const face = detections[0]
  const landmarks = face.landmarks

  // Extract key facial landmarks
  const jawOutline = landmarks.getJawOutline()
  const nose = landmarks.getNose()
  const leftEye = landmarks.getLeftEye()
  const rightEye = landmarks.getRightEye()
  const mouth = landmarks.getMouth()

  // Calculate comprehensive face measurements

  // Face width at different points
  const faceWidth = jawOutline[16].x - jawOutline[0].x
  const foreheadWidth = Math.abs(jawOutline[0].x - jawOutline[16].x) * 0.8 // Approximate forehead width
  const cheekboneWidth = Math.abs(jawOutline[4].x - jawOutline[12].x)
  const jawWidth = Math.abs(jawOutline[3].x - jawOutline[13].x)
  const chinWidth = Math.abs(jawOutline[5].x - jawOutline[11].x)

  // Face height measurements
  const faceHeight = jawOutline[8].y - ((leftEye[0].y + rightEye[0].y) / 2 - faceWidth * 0.1)
  const foreheadHeight = nose[0].y - ((leftEye[0].y + rightEye[0].y) / 2 - faceWidth * 0.1)
  const midFaceHeight = mouth[0].y - nose[0].y
  const lowerFaceHeight = jawOutline[8].y - mouth[0].y

  // Calculate key ratios for face shape determination
  const widthToHeightRatio = faceWidth / faceHeight
  const foreheadToJawRatio = foreheadWidth / jawWidth
  const cheekboneToJawRatio = cheekboneWidth / jawWidth
  const jawToFaceWidthRatio = jawWidth / faceWidth
  const chinToJawRatio = chinWidth / jawWidth
  const foreheadToLowerFaceRatio = foreheadHeight / lowerFaceHeight

  // Calculate face thirds (ideal face is divided into equal thirds)
  const upperThird = foreheadHeight
  const middleThird = midFaceHeight
  const lowerThird = lowerFaceHeight
  const thirdRatio = Math.max(upperThird, middleThird, lowerThird) / Math.min(upperThird, middleThird, lowerThird)

  // Calculate jaw angle (for determining angularity)
  const jawAngleLeft =
    Math.atan2(jawOutline[5].y - jawOutline[3].y, jawOutline[5].x - jawOutline[3].x) * (180 / Math.PI)

  const jawAngleRight =
    Math.atan2(jawOutline[11].y - jawOutline[13].y, jawOutline[11].x - jawOutline[13].x) * (180 / Math.PI)

  const jawAngularity = Math.abs(jawAngleLeft) + Math.abs(jawAngleRight)

  // Calculate face shape scores
  const scores = {
    oval: 0,
    round: 0,
    square: 0,
    heart: 0,
    diamond: 0,
    oblong: 0,
    triangle: 0,
    pear: 0,
  }

  // Oval face characteristics
  // - Balanced proportions
  // - Face length about 1.5x width
  // - Gentle curves
  // - Forehead slightly wider than jaw
  scores.oval += widthToHeightRatio >= 0.65 && widthToHeightRatio <= 0.75 ? 2 : 0
  scores.oval += foreheadToJawRatio >= 1.0 && foreheadToJawRatio <= 1.2 ? 2 : 0
  scores.oval += thirdRatio < 1.2 ? 2 : 0
  scores.oval += jawAngularity < 80 ? 1 : 0

  // Round face characteristics
  // - Width and height similar
  // - Soft jawline
  // - Full cheeks
  // - Rounded chin
  scores.round += widthToHeightRatio >= 0.8 ? 3 : 0
  scores.round += jawAngularity < 70 ? 2 : 0
  scores.round += chinToJawRatio > 0.7 ? 2 : 0
  scores.round += cheekboneToJawRatio < 1.1 ? 1 : 0

  // Square face characteristics
  // - Width and height similar
  // - Strong jawline
  // - Minimal taper from forehead to jaw
  // - Angular features
  scores.square += widthToHeightRatio >= 0.75 && widthToHeightRatio <= 0.85 ? 2 : 0
  scores.square += foreheadToJawRatio >= 0.9 && foreheadToJawRatio <= 1.1 ? 2 : 0
  scores.square += jawAngularity > 85 ? 3 : 0
  scores.square += jawToFaceWidthRatio > 0.85 ? 1 : 0

  // Heart face characteristics
  // - Wider forehead
  // - Narrow jawline
  // - Pointed chin
  scores.heart += foreheadToJawRatio > 1.3 ? 3 : 0
  scores.heart += chinToJawRatio < 0.6 ? 2 : 0
  scores.heart += cheekboneToJawRatio > 1.15 ? 1 : 0
  scores.heart += widthToHeightRatio < 0.75 ? 1 : 0

  // Diamond face characteristics
  // - Narrow forehead
  // - Strong cheekbones
  // - Narrow jawline
  // - Pointed chin
  scores.diamond += cheekboneToJawRatio > 1.25 ? 3 : 0
  scores.diamond += cheekboneWidth > foreheadWidth ? 2 : 0
  scores.diamond += chinToJawRatio < 0.65 ? 1 : 0
  scores.diamond += foreheadToJawRatio < 1.1 ? 1 : 0

  // Oblong face characteristics
  // - Long face
  // - Narrow width
  // - Similar width at forehead, cheekbones, and jaw
  scores.oblong += widthToHeightRatio < 0.65 ? 3 : 0
  scores.oblong += foreheadToJawRatio >= 0.9 && foreheadToJawRatio <= 1.1 ? 2 : 0
  scores.oblong += cheekboneToJawRatio >= 0.9 && cheekboneToJawRatio <= 1.1 ? 2 : 0
  scores.oblong += thirdRatio > 1.3 ? 1 : 0

  // Triangle face characteristics
  // - Narrow forehead
  // - Wide jawline
  scores.triangle += foreheadToJawRatio < 0.8 ? 3 : 0
  scores.triangle += jawToFaceWidthRatio > 0.9 ? 2 : 0
  scores.triangle += cheekboneToJawRatio < 0.9 ? 2 : 0

  // Pear/trapezoid face characteristics
  // - Narrow forehead
  // - Wide jawline
  // - Rounded features
  scores.pear += foreheadToJawRatio < 0.85 ? 2 : 0
  scores.pear += jawToFaceWidthRatio > 0.85 ? 2 : 0
  scores.pear += jawAngularity < 75 ? 2 : 0
  scores.pear += chinToJawRatio > 0.7 ? 1 : 0

  // Find the face shape with the highest score
  let maxScore = 0
  let detectedShape = "Oval" // Default

  for (const [shape, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      detectedShape = shape.charAt(0).toUpperCase() + shape.slice(1)
    }
  }

  // Calculate confidence score (0-100%)
  const totalPossibleScore = 7 // Maximum points for any face shape
  const confidence = Math.min(100, Math.round((maxScore / totalPossibleScore) * 100))

  // Get the top 3 face shapes for alternative recommendations
  const sortedShapes = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([shape, score]) => ({
      shape: shape.charAt(0).toUpperCase() + shape.slice(1),
      score: Math.min(100, Math.round((score / totalPossibleScore) * 100)),
    }))

  // Return face shape and measurements
  return {
    shape: detectedShape,
    confidence,
    alternativeShapes: sortedShapes,
    measurements: {
      faceWidth,
      faceHeight,
      foreheadWidth,
      cheekboneWidth,
      jawWidth,
      chinWidth,
      widthToHeightRatio,
      foreheadToJawRatio,
      cheekboneToJawRatio,
      jawToFaceWidthRatio,
      chinToJawRatio,
      jawAngularity,
    },
    landmarks: face.landmarks.positions,
  }
}
