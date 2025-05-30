"use client"

import { useEffect, useRef, useState } from "react"
import { useAnimationStore } from "@/store/animation-store"
import { useTheme } from "next-themes"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { style } = useAnimationStore()
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const bubblesRef = useRef<Bubble[]>([])
  const gradientPositionRef = useRef({ x: 0, y: 0 })
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Set mounted to true on client
  useEffect(() => {
    setMounted(true)

    const handleResize = () => {
      if (canvasRef.current) {
        // Get the actual window dimensions
        const width = window.innerWidth
        const height = window.innerHeight

        setDimensions({ width, height })

        // Set canvas size to match window
        const canvas = canvasRef.current

        // Set display size (css pixels)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        // Set actual size in memory (scaled to account for extra pixel density)
        const dpr = window.devicePixelRatio || 1
        canvas.width = width * dpr
        canvas.height = height * dpr

        // Scale context to ensure correct drawing operations
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.scale(dpr, dpr)
        }

        console.log(`Canvas resized to ${width}x${height} with DPR ${dpr}`)

        // Reinitialize animations with new dimensions
        if (style === "particles") {
          initParticles()
        } else if (style === "bubbles") {
          initBubbles()
        } else if (style === "gradient") {
          initGradient()
        }
      }
    }

    // Initialize mouse position to center of screen
    mousePositionRef.current = {
      x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
      y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      handleResize() // Initial sizing

      const handleMouseMove = (e: MouseEvent) => {
        mousePositionRef.current = { x: e.clientX, y: e.clientY }
      }

      window.addEventListener("mousemove", handleMouseMove)

      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("mousemove", handleMouseMove)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [style])

  // Particle animation
  interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    color: string
    connections: number
  }

  const initParticles = () => {
    const particles: Particle[] = []
    const { width, height } = dimensions

    // Calculate number of particles based on screen size
    const particleCount = Math.min(Math.max(Math.floor((width * height) / 10000), 50), 150)

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 2, // Slightly larger particles
        speedX: (Math.random() - 0.5) * 0.3, // Slower movement
        speedY: (Math.random() - 0.5) * 0.3, // Slower movement
        color: Math.random() > 0.5 ? "primary" : "secondary",
        connections: 0,
      })
    }

    particlesRef.current = particles
  }

  // Bubble animation
  interface Bubble {
    x: number
    y: number
    size: number
    speed: number
    color: string
  }

  const initBubbles = () => {
    const bubbles: Bubble[] = []
    const { width, height } = dimensions

    for (let i = 0; i < 50; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: height + Math.random() * 100,
        size: Math.random() * 20 + 5,
        speed: Math.random() * 2 + 0.5,
        color: Math.random() > 0.5 ? "primary" : "secondary",
      })
    }

    bubblesRef.current = bubbles
  }

  // Initialize gradient position
  const initGradient = () => {
    gradientPositionRef.current = {
      x: dimensions.width / 2,
      y: dimensions.height / 2,
    }
  }

  // Main animation effect
  useEffect(() => {
    if (!mounted || !canvasRef.current) return

    // Clean up previous animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Initialize animations based on style
    if (style === "particles") {
      initParticles()
    } else if (style === "bubbles") {
      initBubbles()
    } else if (style === "gradient") {
      initGradient()
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      // Clear the entire canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Get colors based on theme - INCREASED VISIBILITY FOR LIGHT MODE
      const primaryColor =
        resolvedTheme === "dark"
          ? "rgba(59, 130, 246, 0.9)" // Bright blue for dark mode
          : "rgba(59, 130, 246, 0.4)" // Much more visible blue for light mode (increased from 0.7)
      const secondaryColor =
        resolvedTheme === "dark"
          ? "rgba(139, 92, 246, 0.9)" // Bright purple for dark mode
          : "rgba(139, 92, 246, 0.4)" // Much more visible purple for light mode (increased from 0.7)

      // Draw based on selected style
      switch (style) {
        case "particles":
          drawNetworkParticles(ctx, primaryColor, secondaryColor)
          break
        case "waves":
          drawWaves(ctx, dimensions.width, dimensions.height, primaryColor, secondaryColor)
          break
        case "gradient":
          drawGradient(ctx, dimensions.width, dimensions.height, primaryColor, secondaryColor)
          break
        case "bubbles":
          drawBubbles(ctx, primaryColor, secondaryColor)
          break
        case "none":
          // Just clear the canvas
          break
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [style, resolvedTheme, mounted, dimensions])

  const drawNetworkParticles = (ctx: CanvasRenderingContext2D, primaryColor: string, secondaryColor: string) => {
    if (particlesRef.current.length === 0) {
      initParticles()
    }

    // Reset connection count
    particlesRef.current.forEach((particle) => {
      particle.connections = 0
    })

    // Draw connections first (so they appear behind particles)
    particlesRef.current.forEach((particle, index) => {
      // Update position with slight randomness for more natural movement
      particle.x += particle.speedX + (Math.random() - 0.5) * 0.05
      particle.y += particle.speedY + (Math.random() - 0.5) * 0.05

      // Bounce off edges with slight randomness
      if (particle.x < 0 || particle.x > dimensions.width) {
        particle.speedX = -particle.speedX * (0.9 + Math.random() * 0.2)
      }

      if (particle.y < 0 || particle.y > dimensions.height) {
        particle.speedY = -particle.speedY * (0.9 + Math.random() * 0.2)
      }

      // Keep particles within bounds
      particle.x = Math.max(0, Math.min(dimensions.width, particle.x))
      particle.y = Math.max(0, Math.min(dimensions.height, particle.y))

      // Draw connections
      for (let j = index + 1; j < particlesRef.current.length; j++) {
        const otherParticle = particlesRef.current[j]
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Maximum distance for connection - adjusted for screen size
        const maxDistance = Math.min(dimensions.width, dimensions.height) * 0.15

        if (distance < maxDistance && particle.connections < 5 && otherParticle.connections < 5) {
          // Calculate opacity based on distance
          const opacity = 1 - distance / maxDistance

          // Draw line with gradient
          ctx.beginPath()
          ctx.strokeStyle = particle.color === "primary" ? primaryColor : secondaryColor
          // Higher line opacity for light mode
          ctx.globalAlpha = opacity * (resolvedTheme === "dark" ? 0.8 : 0.6) // Increased from 0.7 to 0.6 for light mode
          // Thicker lines for better visibility in light mode too
          ctx.lineWidth = opacity * (resolvedTheme === "dark" ? 2.5 : 2.2) // Increased from 2.0 to 2.2 for light mode
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.stroke()
          ctx.globalAlpha = 1

          // Increment connection count
          particle.connections++
          otherParticle.connections++
        }
      }
    })

    // Draw particles on top of connections
    particlesRef.current.forEach((particle) => {
      // Draw particle
      ctx.beginPath()
      // Larger particles in dark mode for better visibility
      const particleSize = resolvedTheme === "dark" ? particle.size * 1.8 : particle.size * 1.5
      ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2)

      // Much more vibrant colors for particles in both modes
      const particleColor =
        particle.color === "primary"
          ? primaryColor.replace(/[\d.]+\)$/, resolvedTheme === "dark" ? "1.0)" : "0.8)") // Higher opacity in light mode
          : secondaryColor.replace(/[\d.]+\)$/, resolvedTheme === "dark" ? "1.0)" : "0.8)") // Higher opacity in light mode

      ctx.fillStyle = particleColor
      ctx.fill()

      // Add much stronger glow effect in dark mode
      ctx.shadowBlur = resolvedTheme === "dark" ? 20 : 15
      ctx.shadowColor = particleColor
      ctx.fill()
      ctx.shadowBlur = 0
    })
  }

  // Wave animation
  const drawWaves = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    primaryColor: string,
    secondaryColor: string,
  ) => {
    const time = Date.now() * 0.001

    // First wave
    ctx.beginPath()
    ctx.moveTo(0, height / 2)

    for (let x = 0; x <= width; x += 5) {
      // Optimize by drawing fewer points
      const y = Math.sin(x * 0.01 + time) * 50 + height / 2
      ctx.lineTo(x, y)
    }

    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()

    const gradient1 = ctx.createLinearGradient(0, height / 2, 0, height)
    gradient1.addColorStop(0, primaryColor)
    // More visible fade in both modes
    gradient1.addColorStop(1, resolvedTheme === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.15)") // Increased from 0.1 to 0.15 for light mode
    ctx.fillStyle = gradient1
    ctx.fill()

    // Second wave
    ctx.beginPath()
    ctx.moveTo(0, height / 2 + 50)

    for (let x = 0; x <= width; x += 5) {
      // Optimize by drawing fewer points
      const y = Math.sin(x * 0.02 + time * 1.5) * 30 + height / 2 + 50
      ctx.lineTo(x, y)
    }

    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()

    const gradient2 = ctx.createLinearGradient(0, height / 2 + 50, 0, height)
    gradient2.addColorStop(0, secondaryColor)
    // More visible fade in both modes
    gradient2.addColorStop(1, resolvedTheme === "dark" ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.15)") // Increased from 0.1 to 0.15 for light mode
    ctx.fillStyle = gradient2
    ctx.fill()
  }

  // Gradient animation
  const drawGradient = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    primaryColor: string,
    secondaryColor: string,
  ) => {
    // Update gradient position based on mouse
    const targetX = mousePositionRef.current.x || width / 2
    const targetY = mousePositionRef.current.y || height / 2

    // Initialize gradient position if not set
    if (gradientPositionRef.current.x === 0 && gradientPositionRef.current.y === 0) {
      gradientPositionRef.current.x = targetX
      gradientPositionRef.current.y = targetY
    }

    gradientPositionRef.current.x += (targetX - gradientPositionRef.current.x) * 0.05
    gradientPositionRef.current.y += (targetY - gradientPositionRef.current.y) * 0.05

    try {
      const gradient = ctx.createRadialGradient(
        gradientPositionRef.current.x,
        gradientPositionRef.current.y,
        0,
        gradientPositionRef.current.x,
        gradientPositionRef.current.y,
        width * 0.8,
      )

      gradient.addColorStop(0, primaryColor)
      gradient.addColorStop(0.5, secondaryColor)
      // More visible fade in light mode
      gradient.addColorStop(1, resolvedTheme === "dark" ? "rgba(30, 41, 59, 0.1)" : "rgba(200, 200, 255, 0.08)") // Increased from 0.05 to 0.08 for light mode

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    } catch (error) {
      console.error("Error drawing gradient:", error)
    }
  }

  const drawBubbles = (ctx: CanvasRenderingContext2D, primaryColor: string, secondaryColor: string) => {
    if (bubblesRef.current.length === 0) {
      initBubbles()
    }

    bubblesRef.current.forEach((bubble, index) => {
      // Update position
      bubble.y -= bubble.speed

      // Reset if off screen
      if (bubble.y < -bubble.size) {
        bubble.y = dimensions.height + bubble.size
        bubble.x = Math.random() * dimensions.width
      }

      // Draw bubble
      ctx.beginPath()
      // Larger bubbles in dark mode for better visibility
      const bubbleSize = resolvedTheme === "dark" ? bubble.size * 1.5 : bubble.size * 1.2
      ctx.arc(bubble.x, bubble.y, bubbleSize, 0, Math.PI * 2)
      ctx.fillStyle = bubble.color === "primary" ? primaryColor : secondaryColor
      // More opaque in light mode for better visibility
      ctx.globalAlpha = resolvedTheme === "dark" ? 0.7 : 0.4 // Increased from 0.5 to 0.4 for light mode
      ctx.fill()
      ctx.strokeStyle = bubble.color === "primary" ? primaryColor : secondaryColor
      // Thicker stroke in dark mode
      ctx.lineWidth = resolvedTheme === "dark" ? 2 : 1.5
      ctx.stroke()
      ctx.globalAlpha = 1

      // Add highlight
      ctx.beginPath()
      ctx.arc(bubble.x - bubbleSize * 0.3, bubble.y - bubbleSize * 0.3, bubbleSize * 0.2, 0, Math.PI * 2)
      // Brighter highlight in light mode
      ctx.fillStyle = resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.8)" // Increased from 0.7 to 0.8 for light mode
      ctx.fill()
    })
  }

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
      }}
      aria-hidden="true"
    />
  )
}
