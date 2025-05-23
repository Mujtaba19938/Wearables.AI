// Device Motion and Orientation Utility
import type { GestureState } from "./touch-gestures"

// Interface for device motion data
export interface DeviceMotionData {
  accelerationX: number
  accelerationY: number
  accelerationZ: number
  rotationRate: {
    alpha: number // rotation around z-axis
    beta: number // rotation around x-axis (front to back)
    gamma: number // rotation around y-axis (left to right)
  }
}

// Interface for device orientation data
export interface DeviceOrientationData {
  alpha: number // rotation around z-axis
  beta: number // rotation around x-axis (front to back)
  gamma: number // rotation around y-axis (left to right)
}

// Class to handle device motion and orientation
export class DeviceMotionHandler {
  private isSupported = false
  private isActive = false
  private hasPermission = false
  private onMotionCallback: ((data: DeviceMotionData) => void) | null = null
  private onOrientationCallback: ((data: DeviceOrientationData) => void) | null = null
  private smoothingFactor = 0.3 // Lower = more smoothing
  private motionData: DeviceMotionData = {
    accelerationX: 0,
    accelerationY: 0,
    accelerationZ: 0,
    rotationRate: {
      alpha: 0,
      beta: 0,
      gamma: 0,
    },
  }
  private orientationData: DeviceOrientationData = {
    alpha: 0,
    beta: 0,
    gamma: 0,
  }

  constructor() {
    this.checkSupport()
  }

  // Check if device motion and orientation are supported
  private checkSupport(): void {
    this.isSupported = window && ("DeviceMotionEvent" in window || "DeviceOrientationEvent" in window)
  }

  // Check if permission is needed (iOS 13+)
  private async checkPermission(): Promise<boolean> {
    // For iOS 13+, permission is required
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof (DeviceMotionEvent as any).requestPermission === "function"
    ) {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission()
        this.hasPermission = permissionState === "granted"
        return this.hasPermission
      } catch (error) {
        console.error("Error requesting device motion permission:", error)
        this.hasPermission = false
        return false
      }
    }

    // For other browsers, no permission needed
    this.hasPermission = true
    return true
  }

  // Request permission if needed and start listening to events
  public async start(
    onMotion?: (data: DeviceMotionData) => void,
    onOrientation?: (data: DeviceOrientationData) => void,
    smoothingFactor?: number,
  ): Promise<boolean> {
    if (!this.isSupported) {
      console.warn("Device motion and orientation are not supported")
      return false
    }

    if (smoothingFactor !== undefined) {
      this.smoothingFactor = Math.max(0, Math.min(1, smoothingFactor))
    }

    this.onMotionCallback = onMotion || null
    this.onOrientationCallback = onOrientation || null

    const hasPermission = await this.checkPermission()
    if (!hasPermission) {
      console.warn("No permission for device motion and orientation")
      return false
    }

    this.attachEventListeners()
    this.isActive = true
    return true
  }

  // Stop listening to events
  public stop(): void {
    if (!this.isActive) return

    this.detachEventListeners()
    this.isActive = false
  }

  // Attach event listeners
  private attachEventListeners(): void {
    if ("DeviceMotionEvent" in window) {
      window.addEventListener("devicemotion", this.handleDeviceMotion)
    }

    if ("DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", this.handleDeviceOrientation)
    }
  }

  // Detach event listeners
  private detachEventListeners(): void {
    if ("DeviceMotionEvent" in window) {
      window.removeEventListener("devicemotion", this.handleDeviceMotion)
    }

    if ("DeviceOrientationEvent" in window) {
      window.removeEventListener("deviceorientation", this.handleDeviceOrientation)
    }
  }

  // Handle device motion event
  private handleDeviceMotion = (event: DeviceMotionEvent): void => {
    // Extract acceleration data
    const accelerationX = event.accelerationIncludingGravity?.x || 0
    const accelerationY = event.accelerationIncludingGravity?.y || 0
    const accelerationZ = event.accelerationIncludingGravity?.z || 0

    // Extract rotation rate data
    const rotationRateAlpha = event.rotationRate?.alpha || 0
    const rotationRateBeta = event.rotationRate?.beta || 0
    const rotationRateGamma = event.rotationRate?.gamma || 0

    // Apply smoothing (exponential moving average)
    this.motionData.accelerationX = this.applySmoothing(this.motionData.accelerationX, accelerationX)
    this.motionData.accelerationY = this.applySmoothing(this.motionData.accelerationY, accelerationY)
    this.motionData.accelerationZ = this.applySmoothing(this.motionData.accelerationZ, accelerationZ)
    this.motionData.rotationRate.alpha = this.applySmoothing(this.motionData.rotationRate.alpha, rotationRateAlpha)
    this.motionData.rotationRate.beta = this.applySmoothing(this.motionData.rotationRate.beta, rotationRateBeta)
    this.motionData.rotationRate.gamma = this.applySmoothing(this.motionData.rotationRate.gamma, rotationRateGamma)

    // Call the callback with the updated data
    if (this.onMotionCallback) {
      this.onMotionCallback(this.motionData)
    }
  }

  // Handle device orientation event
  private handleDeviceOrientation = (event: DeviceOrientationEvent): void => {
    // Extract orientation data
    const alpha = event.alpha || 0
    const beta = event.beta || 0
    const gamma = event.gamma || 0

    // Apply smoothing (exponential moving average)
    this.orientationData.alpha = this.applySmoothing(this.orientationData.alpha, alpha)
    this.orientationData.beta = this.applySmoothing(this.orientationData.beta, beta)
    this.orientationData.gamma = this.applySmoothing(this.orientationData.gamma, gamma)

    // Call the callback with the updated data
    if (this.onOrientationCallback) {
      this.onOrientationCallback(this.orientationData)
    }
  }

  // Apply smoothing using exponential moving average
  private applySmoothing(currentValue: number, newValue: number): number {
    return currentValue * (1 - this.smoothingFactor) + newValue * this.smoothingFactor
  }

  // Get current motion data
  public getMotionData(): DeviceMotionData {
    return { ...this.motionData }
  }

  // Get current orientation data
  public getOrientationData(): DeviceOrientationData {
    return { ...this.orientationData }
  }

  // Check if device motion and orientation are supported
  public isDeviceMotionSupported(): boolean {
    return this.isSupported
  }

  // Check if device motion and orientation are active
  public isDeviceMotionActive(): boolean {
    return this.isActive
  }
}

// Create a camera motion controller to apply device motion to camera view
export class CameraMotionController {
  private motionHandler: DeviceMotionHandler
  private videoElement: HTMLElement | null = null
  private canvasElement: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private isActive = false
  private transform = {
    translateX: 0,
    translateY: 0,
    scale: 1,
  }
  private lastOrientation = {
    gamma: 0,
    beta: 0,
  }
  private maxTranslation = 50 // Maximum pixel translation
  private sensitivity = 2.0 // Motion sensitivity
  private gestureState: GestureState | null = null

  constructor() {
    this.motionHandler = new DeviceMotionHandler()
  }

  // Initialize the controller with video and canvas elements
  public init(videoElement: HTMLElement, canvasElement: HTMLCanvasElement): boolean {
    this.videoElement = videoElement
    this.canvasElement = canvasElement
    this.ctx = canvasElement.getContext("2d")

    if (!this.ctx) {
      console.error("Could not get canvas context")
      return false
    }

    return true
  }

  // Start the camera motion controller
  public async start(sensitivity?: number): Promise<boolean> {
    if (!this.videoElement || !this.canvasElement || !this.ctx) {
      console.error("Camera motion controller not initialized")
      return false
    }

    if (sensitivity !== undefined) {
      this.sensitivity = Math.max(0.1, Math.min(5, sensitivity))
    }

    // Reset transform
    this.transform = {
      translateX: 0,
      translateY: 0,
      scale: 1,
    }

    // Start device motion handler
    const started = await this.motionHandler.start(
      undefined, // No motion callback needed
      this.handleOrientation.bind(this),
      0.2, // Smoothing factor
    )

    if (!started) {
      console.warn("Could not start device motion handler")
      return false
    }

    this.isActive = true
    return true
  }

  // Stop the camera motion controller
  public stop(): void {
    if (!this.isActive) return

    this.motionHandler.stop()
    this.isActive = false
  }

  // Set gesture state
  public setGestureState(state: GestureState | null): void {
    this.gestureState = state
    this.applyTransform()
  }

  // Handle device orientation data
  private handleOrientation(data: DeviceOrientationData): void {
    if (!this.isActive) return

    // Calculate delta from last orientation
    const deltaGamma = data.gamma - this.lastOrientation.gamma
    const deltaBeta = data.beta - this.lastOrientation.beta

    // Update last orientation
    this.lastOrientation.gamma = data.gamma
    this.lastOrientation.beta = data.beta

    // Calculate translation based on orientation
    // Note: We're using negative gamma to correct the direction
    // This ensures tilting right moves the view right (not mirrored)
    const translateX = Math.max(
      -this.maxTranslation,
      Math.min(this.maxTranslation, this.transform.translateX - deltaGamma * this.sensitivity),
    )

    const translateY = Math.max(
      -this.maxTranslation,
      Math.min(this.maxTranslation, this.transform.translateY + deltaBeta * this.sensitivity),
    )

    // Update transform
    this.transform.translateX = translateX
    this.transform.translateY = translateY

    // Apply transform
    this.applyTransform()
  }

  // Apply transform to the video element
  private applyTransform(): void {
    if (!this.videoElement) return

    // Combine motion and gesture transforms
    let translateX = this.transform.translateX
    let translateY = this.transform.translateY
    let scale = this.transform.scale

    // Apply gesture state if available
    if (this.gestureState) {
      translateX += this.gestureState.translateX
      translateY += this.gestureState.translateY
      scale = this.gestureState.scale
    }

    // Apply transform using CSS
    this.videoElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
  }

  // Check if device motion is supported
  public isMotionSupported(): boolean {
    return this.motionHandler.isDeviceMotionSupported()
  }

  // Check if controller is active
  public isControllerActive(): boolean {
    return this.isActive
  }

  // Set motion sensitivity
  public setSensitivity(sensitivity: number): void {
    this.sensitivity = Math.max(0.1, Math.min(5, sensitivity))
  }

  // Get current transform
  public getTransform(): { translateX: number; translateY: number; scale: number } {
    return { ...this.transform }
  }

  // Reset transform
  public resetTransform(): void {
    this.transform = {
      translateX: 0,
      translateY: 0,
      scale: 1,
    }

    this.applyTransform()
  }
}

// Create and initialize a camera motion controller
export function createCameraMotionController(
  videoElement: HTMLElement,
  canvasElement: HTMLCanvasElement,
  sensitivity?: number,
): CameraMotionController {
  const controller = new CameraMotionController()
  controller.init(videoElement, canvasElement)

  if (sensitivity !== undefined) {
    controller.setSensitivity(sensitivity)
  }

  return controller
}
