import * as faceapi from "face-api.js"

// Track loading state for AR-specific models
let arModelsLoaded = false
let arLoadingPromise: Promise<void> | null = null

// Function to load minimal models needed for AR face tracking
export async function loadARFaceTrackingModels() {
  // If models are already loaded, return immediately
  if (arModelsLoaded) {
    return
  }

  // If models are currently loading, wait for that promise
  if (arLoadingPromise) {
    return arLoadingPromise
  }

  // Start loading models
  arLoadingPromise = (async () => {
    try {
      // Set the models path
      const MODEL_URL = "/models"

      // For AR, we only need the face detector and landmarks
      console.log("Loading TinyFaceDetector model for AR...")
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)

      console.log("Loading FaceLandmark68 model for AR...")
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)

      arModelsLoaded = true
      console.log("AR face tracking models loaded successfully")
    } catch (error) {
      console.error("Error loading AR face tracking models:", error)
      // Don't throw the error, just log it
      // This allows the app to continue functioning even if model loading fails
    } finally {
      arLoadingPromise = null
    }
  })()

  return arLoadingPromise
}

// Function to detect face landmarks for AR positioning
export async function detectFaceLandmarksForAR(videoElement: HTMLVideoElement | HTMLCanvasElement) {
  if (!videoElement || !videoElement.width || !videoElement.height) {
    return null
  }

  try {
    // Check if models are loaded
    if (!faceapi.nets.tinyFaceDetector.isLoaded || !faceapi.nets.faceLandmark68Net.isLoaded) {
      console.warn("Face detection models not loaded yet")
      return null
    }

    // Detect all faces with landmarks
    const detections = await faceapi
      .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
      .withFaceLandmarks()

    if (!detections || !detections.length) {
      return null
    }

    // Get the first face detected (we'll use the most prominent face)
    const face = detections[0]
    if (!face || !face.landmarks) {
      return null
    }

    const landmarks = face.landmarks

    // Extract key points for glasses positioning
    const leftEye = landmarks.getLeftEye()
    const rightEye = landmarks.getRightEye()
    const nose = landmarks.getNose()

    if (!leftEye || !rightEye || !nose || leftEye.length === 0 || rightEye.length === 0 || nose.length === 0) {
      return null
    }

    // Calculate eye midpoints
    const leftEyeMidpoint = {
      x: leftEye.reduce((sum, point) => sum + point.x, 0) / leftEye.length,
      y: leftEye.reduce((sum, point) => sum + point.y, 0) / leftEye.length,
    }

    const rightEyeMidpoint = {
      x: rightEye.reduce((sum, point) => sum + point.x, 0) / rightEye.length,
      y: rightEye.reduce((sum, point) => sum + point.y, 0) / rightEye.length,
    }

    // Calculate center point between eyes (bridge of nose)
    const bridgePoint = {
      x: (leftEyeMidpoint.x + rightEyeMidpoint.x) / 2,
      y: (leftEyeMidpoint.y + rightEyeMidpoint.y) / 2,
    }

    // Calculate face angle (rotation)
    const eyesVector = {
      x: rightEyeMidpoint.x - leftEyeMidpoint.x,
      y: rightEyeMidpoint.y - leftEyeMidpoint.y,
    }
    const angle = Math.atan2(eyesVector.y, eyesVector.x) * (180 / Math.PI)

    // Calculate distance between eyes (for scaling)
    const eyeDistance = Math.sqrt(
      Math.pow(rightEyeMidpoint.x - leftEyeMidpoint.x, 2) + Math.pow(rightEyeMidpoint.y - leftEyeMidpoint.y, 2),
    )

    // Calculate face width for scaling
    const faceWidth = face.detection.box.width

    // Get face bounding box
    const boundingBox = {
      x: face.detection.box.x,
      y: face.detection.box.y,
      width: face.detection.box.width,
      height: face.detection.box.height,
    }

    return {
      leftEye: leftEyeMidpoint,
      rightEye: rightEyeMidpoint,
      bridge: bridgePoint,
      nose: {
        x: nose[0].x,
        y: nose[0].y,
      },
      angle,
      eyeDistance,
      faceWidth,
      boundingBox,
      landmarks: landmarks.positions,
    }
  } catch (error) {
    console.error("Error in AR face landmark detection:", error)
    return null
  }
}

// Function to calculate glasses position based on face landmarks
export function calculateGlassesPosition(faceLandmarks: any, videoWidth: number, videoHeight: number) {
  if (!faceLandmarks) return null

  // Position glasses at the bridge of the nose
  const position = {
    x: faceLandmarks.bridge.x,
    y: faceLandmarks.bridge.y,
  }

  // Scale glasses based on face width
  // The multiplier can be adjusted based on the glasses image proportions
  const scale = (faceLandmarks.eyeDistance / 100) * 2.5

  // Rotation based on face angle
  const rotation = faceLandmarks.angle

  // Calculate glasses dimensions based on scale
  // These values would need to be adjusted based on the actual glasses image
  const glassesWidth = 250 * scale
  const glassesHeight = 85 * scale

  // Calculate offset to center glasses on the bridge
  const offsetX = glassesWidth / 2
  const offsetY = glassesHeight / 3 // Position slightly above the bridge

  return {
    x: position.x - offsetX,
    y: position.y - offsetY,
    width: glassesWidth,
    height: glassesHeight,
    rotation,
    scale,
  }
}
