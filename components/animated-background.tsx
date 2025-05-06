"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { isLowPowerDevice } from "@/utils/performance-utils"
import { useAnimationStore } from "@/store/animation-store"

export type AnimationStyle = "particles" | "waves" | "geometric" | "constellation" | "minimal"

// Update the component props at the top
interface AnimatedBackgroundProps {
  reducedMotion?: boolean
  lowPowerMode?: boolean
}

export function AnimatedBackground({ reducedMotion = false, lowPowerMode = false }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const { animationStyle } = useAnimationStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    let isDarkTheme = theme === "dark"
    const isLowPower = isLowPowerDevice()

    // Track if animation is currently running
    let isAnimating = true

    // Last timestamp for throttling redraws
    let lastDrawTime = 0

    // Animation properties
    let time = 0
    let hue = 0

    // Resize handler to make the canvas fill the screen
    const handleResize = () => {
      // Use device pixel ratio for sharper rendering
      const dpr = window.devicePixelRatio || 1

      // Set display size (css pixels)
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"

      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr

      // Scale context to ensure correct drawing operations
      ctx.scale(dpr, dpr)

      // Clear any existing content
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Initialize particles
      initParticles()

      // Force a redraw
      draw(performance.now())
    }

    // Initialize particles based on theme and device power
    const initParticles = () => {
      particles = []

      // Adjust particle count based on animation style
      let baseCount = 15000
      let maxParticles = 60

      switch (animationStyle) {
        case "particles":
          baseCount = isLowPower ? 15000 : 10000
          maxParticles = isLowPower ? 30 : 60
          break
        case "waves":
          baseCount = isLowPower ? 20000 : 15000
          maxParticles = isLowPower ? 20 : 40
          break
        case "geometric":
          baseCount = isLowPower ? 25000 : 20000
          maxParticles = isLowPower ? 15 : 30
          break
        case "constellation":
          baseCount = isLowPower ? 18000 : 12000
          maxParticles = isLowPower ? 25 : 50
          break
        case "minimal":
          baseCount = isLowPower ? 30000 : 25000
          maxParticles = isLowPower ? 10 : 20
          break
      }

      // Increase particle count for light mode to make it more noticeable
      if (!isDarkTheme) {
        maxParticles = Math.floor(maxParticles * 1.5)
      }

      let particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / baseCount), maxParticles)

      // Honor user preferences for reduced motion
      if (reducedMotion) {
        console.log("Respecting reduced motion preference - using minimal animations")
        // Override animation style to minimal
        particleCount = 5 // Very few particles
      }

      // For low power devices, reduce animation complexity
      let speedFactor = isLowPower ? 0.05 : 0.1

      if (lowPowerMode && !reducedMotion) {
        console.log("Low power device detected - optimizing animations")
        // Reduce particle count and animation complexity
        particleCount = Math.floor(particleCount * 0.5)
        // Slow down animations
        speedFactor *= 0.7
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(isDarkTheme, speedFactor))
      }
    }

    // Particle class
    class Particle {
      x: number
      y: number
      radius: number
      color: string
      velocity: { x: number; y: number }
      alpha: number
      originalAlpha: number
      angle: number
      rotationSpeed: number
      size: number

      constructor(isDark: boolean, speedFactor: number) {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight

        // Increase particle size for light mode
        this.radius = isDark ? Math.random() * 1.5 + 0.5 : Math.random() * 2.5 + 1

        // Adjust velocity based on animation style

        if (animationStyle === "waves") {
          speedFactor = isLowPower ? 0.03 : 0.06
        } else if (animationStyle === "geometric") {
          speedFactor = isLowPower ? 0.02 : 0.04
        } else if (animationStyle === "constellation") {
          speedFactor = isLowPower ? 0.04 : 0.08
        } else if (animationStyle === "minimal") {
          speedFactor = isLowPower ? 0.01 : 0.02
        }

        // Increase speed slightly for light mode
        if (!isDark) {
          speedFactor *= 1.2
        }

        this.velocity = {
          x: (Math.random() - 0.5) * speedFactor,
          y: (Math.random() - 0.5) * speedFactor,
        }

        // Increase alpha/opacity for light mode
        this.alpha = isDark ? Math.random() * 0.4 + 0.1 : Math.random() * 0.6 + 0.2
        this.originalAlpha = this.alpha

        // For geometric animation
        this.angle = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.01
        // Increase size for light mode
        this.size = isDark ? Math.random() * 3 + 1 : Math.random() * 4 + 2

        if (isDark) {
          // Dark theme colors: dark blue, violet
          const hue = Math.random() * 60 + 240 // 240-300 range (blue to violet)
          this.color = `hsla(${hue}, 70%, 60%, ${this.alpha})`
        } else {
          // Light theme colors: darker blues and purples for better contrast
          const hue = Math.random() * 60 + 210 // 210-270 range (blue to purple)
          // Use darker and more saturated colors for light mode
          this.color = `hsla(${hue}, 80%, 40%, ${this.alpha})`
        }
      }

      update() {
        if (animationStyle === "geometric") {
          // For geometric, rotate around center point
          this.angle += this.rotationSpeed
          const distance = Math.sqrt(
            Math.pow(this.x - window.innerWidth / 2, 2) + Math.pow(this.y - window.innerHeight / 2, 2),
          )
          const normalizedDistance = Math.min(distance / (window.innerWidth / 2), 1)

          // Move in circular patterns
          this.x += Math.cos(this.angle) * normalizedDistance * 0.5
          this.y += Math.sin(this.angle) * normalizedDistance * 0.5
        } else if (animationStyle === "waves") {
          // For waves, add vertical oscillation
          this.y += Math.sin(time * 0.001 + this.x * 0.01) * 0.2
          this.x += this.velocity.x
        } else if (animationStyle === "constellation") {
          // For constellation, move with slight attraction to center
          const dx = window.innerWidth / 2 - this.x
          const dy = window.innerHeight / 2 - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 50) {
            this.velocity.x += (dx / distance) * 0.01
            this.velocity.y += (dy / distance) * 0.01
          }

          // Limit velocity
          const maxVel = 0.2
          this.velocity.x = Math.max(Math.min(this.velocity.x, maxVel), -maxVel)
          this.velocity.y = Math.max(Math.min(this.velocity.y, maxVel), -maxVel)

          this.x += this.velocity.x
          this.y += this.velocity.y
        } else {
          // Default particle movement
          this.x += this.velocity.x
          this.y += this.velocity.y
        }

        // Wrap around edges
        if (this.x < -50) this.x = window.innerWidth + 50
        if (this.x > window.innerWidth + 50) this.x = -50
        if (this.y < -50) this.y = window.innerHeight + 50
        if (this.y > window.innerHeight + 50) this.y = -50
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (animationStyle === "geometric") {
          // Draw shapes instead of circles
          ctx.save()
          ctx.translate(this.x, this.y)
          ctx.rotate(this.angle)

          if (Math.random() > 0.7) {
            // Draw square
            ctx.fillStyle = this.color
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
          } else {
            // Draw triangle
            ctx.beginPath()
            ctx.moveTo(0, -this.size / 2)
            ctx.lineTo(this.size / 2, this.size / 2)
            ctx.lineTo(-this.size / 2, this.size / 2)
            ctx.closePath()
            ctx.fillStyle = this.color
            ctx.fill()
          }

          ctx.restore()
        } else {
          // Draw circle for other styles
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.fillStyle = this.color
          ctx.fill()
        }
      }
    }

    // Draw gradient background based on theme
    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight)

      if (isDarkTheme) {
        // Dark theme gradient: black to dark blue
        gradient.addColorStop(0, "#0a0a1a")
        gradient.addColorStop(1, "#1a1a3a")
      } else {
        // Light theme gradient: white to light blue (slightly more blue tint)
        gradient.addColorStop(0, "#f0f4fa")
        gradient.addColorStop(1, "#e0ebf5")
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    }

    // Draw flowing wave effect
    const drawWaves = (timestamp: number) => {
      // Skip if not waves or minimal style
      if (animationStyle !== "waves" && animationStyle !== "particles") return

      // Reduce wave count on low-power devices
      const waveCount = isLowPower ? 1 : isDarkTheme ? 2 : 3 // More waves for light mode

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()

        const amplitude = isDarkTheme ? 15 + i * 8 : 20 + i * 10 // Increased amplitude for light mode
        const period = window.innerWidth / (isDarkTheme ? 2 : 3)
        // Reduce animation speed significantly
        const speedFactor = isLowPower ? 0.0001 : 0.0002
        const speed = isDarkTheme ? speedFactor : speedFactor * 1.2 // Slightly faster for light mode

        ctx.moveTo(0, window.innerHeight / 2)

        // Increase step size for better performance
        const step = isLowPower ? 20 : 10
        for (let x = 0; x < window.innerWidth; x += step) {
          const y = Math.sin(x / period + timestamp * speed + i) * amplitude + window.innerHeight / 2
          ctx.lineTo(x, y)
        }

        ctx.lineTo(window.innerWidth, window.innerHeight)
        ctx.lineTo(0, window.innerHeight)
        ctx.closePath()

        // Increased alpha for light mode
        const alpha = isDarkTheme ? 0.03 : 0.08
        if (isDarkTheme) {
          // Dark theme wave colors
          const hue = 250 + i * 20 // Blue to violet
          ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${alpha})`
        } else {
          // Light theme wave colors - darker and more saturated
          const hue = 210 + i * 15 // Blue to indigo
          ctx.fillStyle = `hsla(${hue}, 70%, 40%, ${alpha})`
        }

        ctx.fill()
      }
    }

    // Draw fluid animation
    const drawFluid = (timestamp: number) => {
      if (animationStyle !== "waves") return

      // Create a fluid-like effect
      const fluidLayers = isLowPower ? 2 : 3

      for (let i = 0; i < fluidLayers; i++) {
        ctx.beginPath()

        const baseY = window.innerHeight * (0.5 + i * 0.1)
        const amplitude = isDarkTheme ? 20 - i * 5 : 25 - i * 5 // Increased for light mode
        const frequency = 0.01 - i * 0.002
        const speed = 0.0005 - i * 0.0001

        ctx.moveTo(0, baseY)

        for (let x = 0; x < window.innerWidth; x += 10) {
          const y =
            baseY +
            Math.sin(x * frequency + timestamp * speed) * amplitude +
            (Math.sin(x * frequency * 2 + timestamp * speed * 1.5) * amplitude) / 2

          ctx.lineTo(x, y)
        }

        ctx.lineTo(window.innerWidth, window.innerHeight)
        ctx.lineTo(0, window.innerHeight)
        ctx.closePath()

        // Increased alpha for light mode
        const alpha = isDarkTheme ? 0.04 - i * 0.01 : 0.1 - i * 0.02
        const hue = isDarkTheme ? 260 + i * 15 : 220 + i * 15

        // More saturated colors for light mode
        const saturation = isDarkTheme ? 70 : 80
        const lightness = isDarkTheme ? 50 : 40 // Darker for light mode for better contrast

        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
        ctx.fill()
      }
    }

    // Draw geometric patterns
    const drawGeometricPatterns = (timestamp: number) => {
      if (animationStyle !== "geometric") return

      // Draw grid lines
      const gridSize = isLowPower ? 50 : 30
      // Increased line alpha for light mode
      const lineAlpha = isDarkTheme ? 0.05 : 0.12

      // Darker lines for light mode
      ctx.strokeStyle = isDarkTheme ? `rgba(100, 120, 255, ${lineAlpha})` : `rgba(50, 80, 180, ${lineAlpha})`

      ctx.lineWidth = isDarkTheme ? 0.5 : 1 // Thicker lines for light mode

      // Vertical lines
      for (let x = 0; x < window.innerWidth; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, window.innerHeight)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < window.innerHeight; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(window.innerWidth, y)
        ctx.stroke()
      }

      // Draw some circles at grid intersections
      // Increased circle alpha for light mode
      const circleAlpha = isDarkTheme ? 0.1 : 0.2
      ctx.fillStyle = isDarkTheme ? `rgba(120, 130, 255, ${circleAlpha})` : `rgba(60, 90, 200, ${circleAlpha})`

      for (let x = 0; x < window.innerWidth; x += gridSize * 2) {
        for (let y = 0; y < window.innerHeight; y += gridSize * 2) {
          if (Math.random() > 0.7) {
            ctx.beginPath()
            // Larger circles for light mode
            const circleSize = isDarkTheme ? gridSize / 4 : gridSize / 3
            ctx.arc(x, y, circleSize, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    // Connect particles with lines if they're close enough
    const connectParticles = () => {
      // Skip for minimal style or on low-power devices with certain styles
      if (animationStyle === "minimal" || (isLowPower && animationStyle !== "constellation")) return

      const maxDistance = window.innerWidth * (animationStyle === "constellation" ? 0.08 : 0.05)
      const particleLimit = Math.min(particles.length, animationStyle === "constellation" ? 50 : 30)

      for (let i = 0; i < particleLimit; i++) {
        for (let j = i + 1; j < particleLimit; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            // Increased opacity for light mode
            let opacity = isDarkTheme ? 0.1 * (1 - distance / maxDistance) : 0.25 * (1 - distance / maxDistance)

            // Increase opacity for constellation style
            if (animationStyle === "constellation") {
              opacity *= 1.5
            }

            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)

            // Darker and more visible lines for light mode
            ctx.strokeStyle = isDarkTheme ? `rgba(120, 130, 255, ${opacity})` : `rgba(50, 80, 180, ${opacity})`

            ctx.lineWidth = isDarkTheme ? 0.5 : 1 // Thicker lines for light mode
            ctx.stroke()
          }
        }
      }
    }

    // Main draw function
    const draw = (timestamp: number) => {
      // Update time
      time = timestamp

      // Update hue for color cycling
      hue = (hue + 0.1) % 360

      // Throttle drawing on scroll for mobile devices
      if (timestamp - lastDrawTime < 16.67) {
        // ~60fps
        animationFrameId = requestAnimationFrame(draw)
        return
      }

      lastDrawTime = timestamp

      // Clear with proper size
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Draw background gradient
      drawBackground()

      // Draw flowing waves
      drawWaves(timestamp)

      // Draw fluid animation
      drawFluid(timestamp)

      // Draw geometric patterns
      drawGeometricPatterns(timestamp)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      // Connect particles with lines
      connectParticles()

      // Continue animation loop if still animating
      if (isAnimating) {
        animationFrameId = requestAnimationFrame(draw)
      }
    }

    // Handle scroll events - pause animation during scroll
    const handleScroll = () => {
      // Don't restart animation if already running
      if (!isAnimating) {
        isAnimating = true
        animationFrameId = requestAnimationFrame(draw)
      }
    }

    // Handle visibility change to pause when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isAnimating = false
        cancelAnimationFrame(animationFrameId)
      } else {
        isAnimating = true
        animationFrameId = requestAnimationFrame(draw)
      }
    }

    // Start everything
    handleResize()
    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Start animation
    isAnimating = true
    animationFrameId = requestAnimationFrame(draw)

    // Update when theme changes
    const updateTheme = () => {
      isDarkTheme = theme === "dark"
      initParticles()
      // Force redraw with new theme
      draw(performance.now())
    }

    updateTheme()

    // Clean up
    return () => {
      isAnimating = false
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme, animationStyle, reducedMotion, lowPowerMode])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        willChange: "transform", // Hardware acceleration hint
        transform: "translateZ(0)", // Force GPU acceleration
      }}
      aria-hidden="true"
    />
  )
}
