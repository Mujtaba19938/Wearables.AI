"use client"

import { useState, useEffect } from "react"
import { getOptimalImageSize, isSlowConnection } from "@/utils/device-utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  blur?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width: defaultWidth = 800,
  height: defaultHeight = 600,
  className = "",
  priority = false,
  blur = false,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState("")

  useEffect(() => {
    // Determine if we're using a placeholder or actual image
    const isPlaceholder = src.startsWith("/placeholder.svg")

    if (isPlaceholder) {
      // Get the optimized size for placeholders
      const { width, height } = getOptimalImageSize(defaultWidth, defaultHeight)

      // For placeholders, we'll use the width and height in the URL
      let newSrc = src
      if (newSrc.includes("?")) {
        if (!newSrc.includes("width=")) {
          newSrc += `&width=${width}`
        }
        if (!newSrc.includes("height=")) {
          newSrc += `&height=${height}`
        }
      } else {
        newSrc += `?width=${width}&height=${height}`
      }

      setImageSrc(newSrc)
    } else {
      // For regular images, check if we need to serve an optimized version
      if (isSlowConnection()) {
        // Try to get a lower quality version of the image
        // This assumes you have lower quality versions with -low suffix
        const lowResSrc = src.replace(/(\.[^.]+)$/, "-low$1")
        setImageSrc(lowResSrc)
      } else {
        setImageSrc(src)
      }
    }
  }, [src, defaultWidth, defaultHeight])

  if (error) {
    return (
      <div
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width: defaultWidth, height: defaultHeight }}
      >
        <span className="text-muted-foreground text-sm">Image not available</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {!loaded && !priority && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ width: defaultWidth, height: defaultHeight }}
        />
      )}

      <img
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={defaultWidth}
        height={defaultHeight}
        className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => {
          // If optimized version fails, try the original
          if (imageSrc !== src) {
            setImageSrc(src)
          } else {
            setError(true)
          }
        }}
        style={{ filter: blur && !loaded ? "blur(10px)" : "none" }}
      />
    </div>
  )
}
