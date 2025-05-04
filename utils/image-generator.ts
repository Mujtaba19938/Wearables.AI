"use server"

// In-memory cache for generated images
const imageCache = new Map<string, string>()

export async function generateFrameImage(frameName: string, frameStyle: string, color: string): Promise<string> {
  try {
    // Create a unique key for this frame configuration
    const cacheKey = `${frameName}-${frameStyle}-${color}`.toLowerCase().replace(/\s+/g, "-")

    // Check if the image is already in the cache
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey)!
    }

    // Instead of calling the Groq API, generate a placeholder image URL
    const imageUrl = `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(`${color} ${frameStyle} eyeglasses frames called ${frameName}`)}`

    // Store in cache
    imageCache.set(cacheKey, imageUrl)

    return imageUrl
  } catch (error) {
    console.error("Error generating frame image:", error)
    // Return a placeholder image if generation fails
    return `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(`${color} ${frameStyle} eyeglasses frames`)}`
  }
}
