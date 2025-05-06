"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { isLowPowerDevice } from "@/utils/performance-utils"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    let isDarkTheme = theme === "dark"
    const isLowPower = isLowPowerDevice()

    // Resize handler to make the canvas fill the screen
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Initialize particles based on theme and device power
    const initParticles = () => {
      particles = []
      // Reduce particle count for low-power devices
      const baseCount = isLowPower ? 10000 : 15000
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / baseCount), isLowPower ? 50 : 100)

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas, isDarkTheme))
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

      constructor(canvas: HTMLCanvasElement, isDark: boolean) {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = Math.random() * 2 + 1
        // Reduce movement speed on low-power devices
        const speedFactor = isLowPower ? 0.1 : 0.2
        this.velocity = {
          x: (Math.random() - 0.5) * speedFactor,
          y: (Math.random() - 0.5) * speedFactor,
        }
        this.alpha = Math.random() * 0.5 + 0.1

        if (isDark) {
          // Dark theme colors: dark blue, violet
          const hue = Math.random() * 60 + 240 // 240-300 range (blue to violet)
          this.color = `hsla(${hue}, 70%, 60%, ${this.alpha})`
        } else {
          // Light theme colors: light blue, light gray
          const hue = Math.random() * 30 + 200 // 200-230 range (light blue)
          this.color = `hsla(${hue}, 70%, 80%, ${this.alpha})`
        }
      }

      update(canvas: HTMLCanvasElement) {
        this.x += this.velocity.x
        this.y += this.velocity.y

        // Bounce off edges with some damping
        if (this.x < 0 || this.x > canvas.width) {
          this.velocity.x = -this.velocity.x * 0.8
        }

        if (this.y < 0 || this.y > canvas.height) {
          this.velocity.y = -this.velocity.y * 0.8
        }

        // Wrap around if they go too far
        if (this.x < -50) this.x = canvas.width + 50
        if (this.x > canvas.width + 50) this.x = -50
        if (this.y < -50) this.y = canvas.height + 50
        if (this.y > canvas.height + 50) this.y = -50
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Draw gradient background based on theme
    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)

      if (isDarkTheme) {
        // Dark theme gradient: black to dark blue
        gradient.addColorStop(0, "#0a0a1a")
        gradient.addColorStop(1, "#1a1a3a")
      } else {
        // Light theme gradient: white to light blue
        gradient.addColorStop(0, "#f8f9fa")
        gradient.addColorStop(1, "#e6f0f9")
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Draw flowing wave effect
    const drawWaves = (timestamp: number) => {
      // Reduce wave count on low-power devices
      const waveCount = isLowPower ? (isDarkTheme ? 2 : 1) : isDarkTheme ? 3 : 2

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()

        const amplitude = isDarkTheme ? 20 + i * 10 : 10 + i * 5
        const period = canvas.width / (isDarkTheme ? 2 : 3)
        // Reduce animation speed on low-power devices
        const speedFactor = isLowPower ? 0.5 : 1
        const speed = isDarkTheme ? 0.0005 * speedFactor : 0.0002 * speedFactor

        ctx.moveTo(0, canvas.height / 2)

        // Increase step size for low-power devices to reduce calculations
        const step = isLowPower ? 10 : 5
        for (let x = 0; x < canvas.width; x += step) {
          const y = Math.sin(x / period + timestamp * speed + i) * amplitude + canvas.height / 2
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        const alpha = isDarkTheme ? 0.05 : 0.03
        if (isDarkTheme) {
          // Dark theme wave colors
          const hue = 250 + i * 20 // Blue to violet
          ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${alpha})`
        } else {
          // Light theme wave colors
          const hue = 210 + i * 10 // Light blue
          ctx.fillStyle = `hsla(${hue}, 60%, 80%, ${alpha})`
        }

        ctx.fill()
      }
    }

    // Connect particles with lines if they're close enough
    const connectParticles = () => {
      // Skip this expensive operation on low-power devices or reduce its complexity
      if (isLowPower && particles.length > 30) return

      const maxDistance = canvas.width * (isLowPower ? 0.05 : 0.07)

      for (let i = 0; i < particles.length; i++) {
        // On low-power devices, only check connections for a subset of particles
        const checkLimit = isLowPower ? Math.min(i + 5, particles.length) : particles.length
        for (let j = i + 1; j < checkLimit; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = isDarkTheme ? 0.15 * (1 - distance / maxDistance) : 0.08 * (1 - distance / maxDistance)

            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = isDarkTheme ? `rgba(120, 130, 255, ${opacity})` : `rgba(150, 180, 220, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient
      drawBackground()

      // Draw flowing waves
      drawWaves(timestamp)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(canvas)
        particle.draw(ctx)
      })

      // Connect particles with lines
      connectParticles()

      // Throttle frame rate on low-power devices
      if (isLowPower) {
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(animate)
        }, 1000 / 30) // Cap at 30fps for low-power devices
      } else {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    // Start everything
    handleResize()
    window.addEventListener("resize", handleResize)
    animationFrameId = requestAnimationFrame(animate)

    // Update when theme changes
    const updateTheme = () => {
      isDarkTheme = theme === "dark"
      initParticles()
    }

    updateTheme()

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" aria-hidden="true" />
  )
}
