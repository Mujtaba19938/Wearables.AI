// Touch Gesture Handler Utility

// Interface for gesture state
export interface GestureState {
  scale: number
  translateX: number
  translateY: number
  lastScale: number
  lastTranslateX: number
  lastTranslateY: number
}

// Interface for gesture options
export interface GestureOptions {
  minScale?: number
  maxScale?: number
  maxTranslate?: number
  onGestureStart?: () => void
  onGestureChange?: (state: GestureState) => void
  onGestureEnd?: (state: GestureState) => void
}

// Class to handle touch gestures (pinch zoom and swipe)
export class TouchGestureHandler {
  private element: HTMLElement
  private isActive = false
  private initialDistance = 0
  private initialScale = 1
  private initialTouchX = 0
  private initialTouchY = 0
  private lastTouchX = 0
  private lastTouchY = 0
  private touchStartTime = 0
  private isSwiping = false
  private isPinching = false
  private touchCount = 0
  private minScale: number
  private maxScale: number
  private maxTranslate: number
  private onGestureStart: (() => void) | undefined
  private onGestureChange: ((state: GestureState) => void) | undefined
  private onGestureEnd: ((state: GestureState) => void) | undefined
  private state: GestureState = {
    scale: 1,
    translateX: 0,
    translateY: 0,
    lastScale: 1,
    lastTranslateX: 0,
    lastTranslateY: 0,
  }

  constructor(element: HTMLElement, options: GestureOptions = {}) {
    this.element = element
    this.minScale = options.minScale || 1
    this.maxScale = options.maxScale || 3
    this.maxTranslate = options.maxTranslate || 200
    this.onGestureStart = options.onGestureStart
    this.onGestureChange = options.onGestureChange
    this.onGestureEnd = options.onGestureEnd
  }

  // Start listening to touch events
  public start(): void {
    if (this.isActive) return

    this.element.addEventListener("touchstart", this.handleTouchStart)
    this.element.addEventListener("touchmove", this.handleTouchMove)
    this.element.addEventListener("touchend", this.handleTouchEnd)
    this.element.addEventListener("touchcancel", this.handleTouchEnd)

    this.isActive = true
  }

  // Stop listening to touch events
  public stop(): void {
    if (!this.isActive) return

    this.element.removeEventListener("touchstart", this.handleTouchStart)
    this.element.removeEventListener("touchmove", this.handleTouchMove)
    this.element.removeEventListener("touchend", this.handleTouchEnd)
    this.element.removeEventListener("touchcancel", this.handleTouchEnd)

    this.isActive = false
  }

  // Reset gesture state
  public reset(): void {
    this.state = {
      scale: 1,
      translateX: 0,
      translateY: 0,
      lastScale: 1,
      lastTranslateX: 0,
      lastTranslateY: 0,
    }

    if (this.onGestureChange) {
      this.onGestureChange(this.state)
    }
  }

  // Handle touch start event
  private handleTouchStart = (event: TouchEvent): void => {
    event.preventDefault()

    this.touchCount = event.touches.length
    this.touchStartTime = Date.now()

    if (this.touchCount === 1) {
      // Single touch - prepare for swipe
      this.initialTouchX = event.touches[0].clientX
      this.initialTouchY = event.touches[0].clientY
      this.lastTouchX = this.initialTouchX
      this.lastTouchY = this.initialTouchY
      this.isSwiping = true
      this.isPinching = false
    } else if (this.touchCount === 2) {
      // Two touches - prepare for pinch zoom
      this.initialDistance = this.getDistance(
        event.touches[0].clientX,
        event.touches[0].clientY,
        event.touches[1].clientX,
        event.touches[1].clientY,
      )
      this.initialScale = this.state.scale
      this.isSwiping = false
      this.isPinching = true

      // Calculate the midpoint of the two touches
      const midX = (event.touches[0].clientX + event.touches[1].clientX) / 2
      const midY = (event.touches[0].clientY + event.touches[1].clientY) / 2
      this.initialTouchX = midX
      this.initialTouchY = midY
      this.lastTouchX = midX
      this.lastTouchY = midY
    }

    if (this.onGestureStart) {
      this.onGestureStart()
    }
  }

  // Handle touch move event
  private handleTouchMove = (event: TouchEvent): void => {
    event.preventDefault()

    if (this.touchCount !== event.touches.length) {
      // Touch count changed, update
      this.touchCount = event.touches.length

      if (this.touchCount === 1) {
        // Switched from pinch to swipe
        this.initialTouchX = event.touches[0].clientX
        this.initialTouchY = event.touches[0].clientY
        this.lastTouchX = this.initialTouchX
        this.lastTouchY = this.initialTouchY
        this.isSwiping = true
        this.isPinching = false
      } else if (this.touchCount === 2) {
        // Switched from swipe to pinch
        this.initialDistance = this.getDistance(
          event.touches[0].clientX,
          event.touches[0].clientY,
          event.touches[1].clientX,
          event.touches[1].clientY,
        )
        this.initialScale = this.state.scale
        this.isSwiping = false
        this.isPinching = true

        // Calculate the midpoint of the two touches
        const midX = (event.touches[0].clientX + event.touches[1].clientX) / 2
        const midY = (event.touches[0].clientY + event.touches[1].clientY) / 2
        this.initialTouchX = midX
        this.initialTouchY = midY
        this.lastTouchX = midX
        this.lastTouchY = midY
      }
    }

    if (this.isPinching && this.touchCount === 2) {
      // Handle pinch zoom
      const currentDistance = this.getDistance(
        event.touches[0].clientX,
        event.touches[0].clientY,
        event.touches[1].clientX,
        event.touches[1].clientY,
      )

      // Calculate new scale
      let newScale = (currentDistance / this.initialDistance) * this.initialScale
      newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale))

      // Calculate the midpoint of the two touches
      const midX = (event.touches[0].clientX + event.touches[1].clientX) / 2
      const midY = (event.touches[0].clientY + event.touches[1].clientY) / 2

      // Calculate translation (pan during pinch)
      const deltaX = midX - this.lastTouchX
      const deltaY = midY - this.lastTouchY

      // Update last touch position
      this.lastTouchX = midX
      this.lastTouchY = midY

      // Update state
      this.state.scale = newScale
      this.state.translateX += deltaX
      this.state.translateY += deltaY

      // Limit translation
      this.state.translateX = Math.max(-this.maxTranslate, Math.min(this.maxTranslate, this.state.translateX))
      this.state.translateY = Math.max(-this.maxTranslate, Math.min(this.maxTranslate, this.state.translateY))

      // Notify gesture change
      if (this.onGestureChange) {
        this.onGestureChange(this.state)
      }
    } else if (this.isSwiping && this.touchCount === 1) {
      // Handle swipe
      const currentX = event.touches[0].clientX
      const currentY = event.touches[0].clientY

      // Calculate delta from last position
      const deltaX = currentX - this.lastTouchX
      const deltaY = currentY - this.lastTouchY

      // Update last touch position
      this.lastTouchX = currentX
      this.lastTouchY = currentY

      // Update state
      this.state.translateX += deltaX
      this.state.translateY += deltaY

      // Limit translation
      this.state.translateX = Math.max(-this.maxTranslate, Math.min(this.maxTranslate, this.state.translateX))
      this.state.translateY = Math.max(-this.maxTranslate, Math.min(this.maxTranslate, this.state.translateY))

      // Notify gesture change
      if (this.onGestureChange) {
        this.onGestureChange(this.state)
      }
    }
  }

  // Handle touch end event
  private handleTouchEnd = (event: TouchEvent): void => {
    // Store the last state values
    this.state.lastScale = this.state.scale
    this.state.lastTranslateX = this.state.translateX
    this.state.lastTranslateY = this.state.translateY

    // Reset flags
    this.isSwiping = false
    this.isPinching = false
    this.touchCount = event.touches.length

    // Notify gesture end
    if (this.onGestureEnd) {
      this.onGestureEnd(this.state)
    }
  }

  // Calculate distance between two points
  private getDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1
    const dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Get current gesture state
  public getState(): GestureState {
    return { ...this.state }
  }

  // Set gesture state
  public setState(state: Partial<GestureState>): void {
    this.state = { ...this.state, ...state }

    // Ensure scale is within bounds
    this.state.scale = Math.max(this.minScale, Math.min(this.maxScale, this.state.scale))

    // Ensure translation is within bounds
    this.state.translateX = Math.max(-this.maxTranslate, Math.min(this.maxTranslate, this.state.translateX))
    this.state.translateY = Math.max(-this.maxTranslate, Math.min(this.maxTranslate, this.state.translateY))

    if (this.onGestureChange) {
      this.onGestureChange(this.state)
    }
  }

  // Check if handler is active
  public isGestureHandlerActive(): boolean {
    return this.isActive
  }
}

// Create and initialize a touch gesture handler
export function createTouchGestureHandler(element: HTMLElement, options: GestureOptions = {}): TouchGestureHandler {
  const handler = new TouchGestureHandler(element, options)
  return handler
}
