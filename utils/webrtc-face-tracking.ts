// WebRTC Face Tracking Utility

// Face tracking result interface
export interface FaceTrackingResult {
  detected: boolean
  x: number
  y: number
  width: number
  height: number
  confidence: number
}

// Face tracking options
export interface FaceTrackingOptions {
  minFaceSize: number
  scaleFactor: number
  minNeighbors: number
  edgesDensity: number
}

// Default tracking options
export const defaultTrackingOptions: FaceTrackingOptions = {
  minFaceSize: 0.2, // Minimum face size as a percentage of frame height
  scaleFactor: 1.1, // Scale factor for multi-scale detection
  minNeighbors: 5, // Minimum neighbors for detection filtering
  edgesDensity: 0.1, // Edge density for face detection
}

// Class to handle WebRTC face tracking
export class WebRTCFaceTracker {
  private video: HTMLVideoElement | null = null
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private tracking = false
  private lastResult: FaceTrackingResult | null = null
  private options: FaceTrackingOptions
  private frameCounter = 0
  private frameSkip = 2 // Process every nth frame
  private trackingData = {
    skinColorLower: [0, 0, 0],
    skinColorUpper: [255, 255, 255],
    calibrated: false,
  }
  private onTrackCallback: ((result: FaceTrackingResult) => void) | null = null

  constructor(options: Partial<FaceTrackingOptions> = {}) {
    this.options = { ...defaultTrackingOptions, ...options }
  }

  // Initialize the tracker with video and canvas elements
  public init(video: HTMLVideoElement, canvas: HTMLCanvasElement): boolean {
    this.video = video
    this.canvas = canvas
    this.ctx = canvas.getContext("2d", { willReadFrequently: true })

    if (!this.ctx) {
      console.error("Could not get canvas context")
      return false
    }

    // Set canvas size to match video
    this.updateCanvasSize()

    return true
  }

  // Update canvas size to match video dimensions
  private updateCanvasSize(): void {
    if (!this.video || !this.canvas) return

    const { videoWidth, videoHeight } = this.video
    if (videoWidth && videoHeight) {
      this.canvas.width = videoWidth
      this.canvas.height = videoHeight
    }
  }

  // Start face tracking
  public startTracking(callback?: (result: FaceTrackingResult) => void): void {
    if (!this.video || !this.canvas || !this.ctx) {
      console.error("Tracker not initialized")
      return
    }

    this.tracking = true
    this.onTrackCallback = callback || null

    // Start the tracking loop
    this.trackingLoop()
  }

  // Stop face tracking
  public stopTracking(): void {
    this.tracking = false
    this.lastResult = null
  }

  // Main tracking loop
  private trackingLoop = (): void => {
    if (!this.tracking || !this.video || !this.canvas || !this.ctx) return

    // Skip frames to improve performance
    this.frameCounter++
    if (this.frameCounter % this.frameSkip === 0) {
      this.updateCanvasSize()
      this.detectFace()
    }

    // Continue the loop
    requestAnimationFrame(this.trackingLoop)
  }

  // Detect face in the current video frame
  private detectFace(): void {
    if (!this.video || !this.ctx || !this.canvas) return

    try {
      // Draw the current video frame to the canvas
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)

      // If not calibrated, try to calibrate skin color
      if (!this.trackingData.calibrated) {
        this.calibrateSkinColor()
      }

      // Detect face using skin color segmentation
      const faceRegion = this.detectFaceRegion()

      // Update last result
      this.lastResult = faceRegion

      // Call the callback with the result
      if (this.onTrackCallback && faceRegion) {
        this.onTrackCallback(faceRegion)
      }

      // Visualize the detection if a face was found
      if (faceRegion && faceRegion.detected) {
        this.visualizeDetection(faceRegion)
      }
    } catch (error) {
      console.error("Error in face detection:", error)
    }
  }

  // Calibrate skin color based on center of frame
  private calibrateSkinColor(): void {
    if (!this.ctx || !this.canvas) return

    // Sample the center of the frame for skin color
    const centerX = Math.floor(this.canvas.width / 2)
    const centerY = Math.floor(this.canvas.height / 3) // Sample from upper third (likely forehead)
    const sampleSize = Math.floor(this.canvas.width * 0.05) // 5% of width

    try {
      // Get image data from the center region
      const imageData = this.ctx.getImageData(
        centerX - sampleSize / 2,
        centerY - sampleSize / 2,
        sampleSize,
        sampleSize,
      )
      const data = imageData.data

      // Calculate average RGB
      let totalR = 0,
        totalG = 0,
        totalB = 0
      let pixelCount = 0

      for (let i = 0; i < data.length; i += 4) {
        totalR += data[i]
        totalG += data[i + 1]
        totalB += data[i + 2]
        pixelCount++
      }

      if (pixelCount > 0) {
        const avgR = totalR / pixelCount
        const avgG = totalG / pixelCount
        const avgB = totalB / pixelCount

        // Set skin color range based on average color
        // YCbCr color space is better for skin detection
        // Convert RGB to YCbCr-like range
        this.trackingData.skinColorLower = [Math.max(0, avgR * 0.7), Math.max(0, avgG * 0.7), Math.max(0, avgB * 0.7)]
        this.trackingData.skinColorUpper = [
          Math.min(255, avgR * 1.3),
          Math.min(255, avgG * 1.3),
          Math.min(255, avgB * 1.3),
        ]
        this.trackingData.calibrated = true
      }
    } catch (error) {
      console.error("Error calibrating skin color:", error)
    }
  }

  // Detect face region using skin color segmentation
  private detectFaceRegion(): FaceTrackingResult {
    if (!this.ctx || !this.canvas) {
      return { detected: false, x: 0, y: 0, width: 0, height: 0, confidence: 0 }
    }

    try {
      // Get full frame image data
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      const data = imageData.data

      // Create a binary mask for skin pixels
      const maskCanvas = document.createElement("canvas")
      maskCanvas.width = this.canvas.width
      maskCanvas.height = this.canvas.height
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true })

      if (!maskCtx) {
        return { detected: false, x: 0, y: 0, width: 0, height: 0, confidence: 0 }
      }

      const maskImageData = maskCtx.createImageData(maskCanvas.width, maskCanvas.height)
      const maskData = maskImageData.data

      // Apply skin color filter
      let skinPixelCount = 0
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Check if pixel is within skin color range
        if (
          r >= this.trackingData.skinColorLower[0] &&
          r <= this.trackingData.skinColorUpper[0] &&
          g >= this.trackingData.skinColorLower[1] &&
          g <= this.trackingData.skinColorUpper[1] &&
          b >= this.trackingData.skinColorLower[2] &&
          b <= this.trackingData.skinColorUpper[2]
        ) {
          // Set mask pixel to white
          maskData[i] = 255
          maskData[i + 1] = 255
          maskData[i + 2] = 255
          maskData[i + 3] = 255
          skinPixelCount++
        } else {
          // Set mask pixel to black
          maskData[i] = 0
          maskData[i + 1] = 0
          maskData[i + 2] = 0
          maskData[i + 3] = 255
        }
      }

      // Put the mask on the canvas
      maskCtx.putImageData(maskImageData, 0, 0)

      // Find the largest connected region (face)
      const minFacePixels = this.canvas.width * this.canvas.height * 0.02 // At least 2% of frame

      if (skinPixelCount < minFacePixels) {
        return { detected: false, x: 0, y: 0, width: 0, height: 0, confidence: 0 }
      }

      // Find bounding box of skin pixels
      let minX = this.canvas.width
      let minY = this.canvas.height
      let maxX = 0
      let maxY = 0
      let pixelCount = 0

      // Sample every 4th pixel for performance
      for (let y = 0; y < this.canvas.height; y += 4) {
        for (let x = 0; x < this.canvas.width; x += 4) {
          const index = (y * this.canvas.width + x) * 4
          if (maskData[index] > 0) {
            minX = Math.min(minX, x)
            minY = Math.min(minY, y)
            maxX = Math.max(maxX, x)
            maxY = Math.max(maxY, y)
            pixelCount++
          }
        }
      }

      // Calculate face region
      const width = maxX - minX
      const height = maxY - minY

      // Validate face region
      const minSize = this.canvas.height * this.options.minFaceSize
      const aspectRatio = width / height

      // Face should have reasonable aspect ratio and size
      const validAspectRatio = aspectRatio > 0.5 && aspectRatio < 1.5
      const validSize = width > minSize && height > minSize

      if (!validSize || !validAspectRatio) {
        return { detected: false, x: 0, y: 0, width: 0, height: 0, confidence: 0 }
      }

      // Calculate confidence based on pixel density
      const regionArea = width * height
      const density = pixelCount / (regionArea / 16) // Adjust for sampling rate
      const confidence = Math.min(1, Math.max(0, density))

      // Return face region with some padding
      const padding = Math.min(width, height) * 0.1
      return {
        detected: true,
        x: Math.max(0, minX - padding),
        y: Math.max(0, minY - padding),
        width: Math.min(this.canvas.width - minX, width + padding * 2),
        height: Math.min(this.canvas.height - minY, height + padding * 2),
        confidence,
      }
    } catch (error) {
      console.error("Error detecting face region:", error)
      return { detected: false, x: 0, y: 0, width: 0, height: 0, confidence: 0 }
    }
  }

  // Visualize the face detection
  private visualizeDetection(result: FaceTrackingResult): void {
    if (!this.ctx) return

    // Draw face rectangle
    this.ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(result.x, result.y, result.width, result.height)

    // Draw confidence text
    this.ctx.fillStyle = "rgba(0, 255, 0, 0.8)"
    this.ctx.font = "12px Arial"
    this.ctx.fillText(`Confidence: ${Math.round(result.confidence * 100)}%`, result.x, result.y - 5)

    // Draw face landmarks (simplified)
    const centerX = result.x + result.width / 2
    const centerY = result.y + result.height / 2
    const eyeY = result.y + result.height * 0.35
    const eyeDistance = result.width * 0.25

    // Draw eyes
    this.ctx.fillStyle = "rgba(0, 150, 255, 0.8)"
    this.ctx.beginPath()
    this.ctx.arc(centerX - eyeDistance, eyeY, 5, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.beginPath()
    this.ctx.arc(centerX + eyeDistance, eyeY, 5, 0, Math.PI * 2)
    this.ctx.fill()

    // Draw nose
    this.ctx.fillStyle = "rgba(255, 150, 0, 0.8)"
    this.ctx.beginPath()
    this.ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
    this.ctx.fill()

    // Draw mouth
    this.ctx.strokeStyle = "rgba(255, 0, 150, 0.8)"
    this.ctx.beginPath()
    this.ctx.arc(centerX, result.y + result.height * 0.7, result.width * 0.2, 0, Math.PI)
    this.ctx.stroke()
  }

  // Get the last tracking result
  public getLastResult(): FaceTrackingResult | null {
    return this.lastResult
  }

  // Reset the tracker
  public reset(): void {
    this.lastResult = null
    this.trackingData.calibrated = false
  }
}

// Helper function to create and initialize a face tracker
export function createFaceTracker(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options?: Partial<FaceTrackingOptions>,
): WebRTCFaceTracker | null {
  try {
    const tracker = new WebRTCFaceTracker(options)
    const initialized = tracker.init(video, canvas)
    return initialized ? tracker : null
  } catch (error) {
    console.error("Error creating face tracker:", error)
    return null
  }
}
