"use client"

import { useState, useRef, useEffect } from "react"
import { X, Camera, ImageIcon, CuboidIcon as CubeIcon } from "lucide-react"

interface TryOnModalProps {
  isOpen: boolean
  onClose: () => void
  frameName: string
  frameImage: string
  modelUrl: string | null
  price?: number
  material?: string
}

export function TryOnModal({
  isOpen,
  onClose,
  frameName,
  frameImage,
  modelUrl,
  price = 129,
  material = "Acetate",
}: TryOnModalProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "sample" | "3d">("camera")
  const [selectedColor, setSelectedColor] = useState("#000000")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [is3DLoading, setIs3DLoading] = useState(false)

  // Default colors if none provided
  const colors = ["#000000", "#8B4513", "#3B82F6"]

  useEffect(() => {
    // If the frame has a 3D model, set the active tab to 3D
    if (modelUrl && activeTab !== "3d") {
      setActiveTab("3d")
    }
  }, [modelUrl, activeTab])

  useEffect(() => {
    // This would be where we'd initialize the 3D viewer if activeTab is "3d"
    if (activeTab === "3d" && modelUrl && canvasRef.current) {
      setIs3DLoading(true)

      // Simulate loading a 3D model
      const timer = setTimeout(() => {
        setIs3DLoading(false)
        renderMock3DModel()
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [activeTab, modelUrl])

  const renderMock3DModel = () => {
    // In a real implementation, this would use Three.js or another 3D library
    // to render the 3D model. For this demo, we'll draw a simple wireframe cube.
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height

    // Draw a simple wireframe cube as a placeholder
    const centerX = width / 2
    const centerY = height / 2
    const size = Math.min(width, height) * 0.3

    // Define cube vertices
    const vertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ]

    // Define edges
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ]

    // Convert 3D coordinates to 2D
    const points2D = vertices.map(([x, y, z]) => {
      // Apply a simple rotation
      const now = Date.now() / 1000
      const angle = now % (Math.PI * 2)

      const rotX = x * Math.cos(angle) - z * Math.sin(angle)
      const rotZ = x * Math.sin(angle) + z * Math.cos(angle)

      // Project to 2D
      return [centerX + rotX * size, centerY + y * size * 0.7]
    })

    // Draw edges
    ctx.strokeStyle = selectedColor
    ctx.lineWidth = 2

    edges.forEach(([a, b]) => {
      ctx.beginPath()
      ctx.moveTo(points2D[a][0], points2D[a][1])
      ctx.lineTo(points2D[b][0], points2D[b][1])
      ctx.stroke()
    })

    // Draw vertices
    ctx.fillStyle = selectedColor
    points2D.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // Request next frame
    requestAnimationFrame(renderMock3DModel)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full overflow-hidden border border-border">
        <div className="flex items-center justify-between p-4 border-b border-[#1a1c25]">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-bold">{frameName}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">${price}</span>
              <span className="text-gray-400">{material}</span>
              <button onClick={onClose} className="ml-2 p-1 rounded-full hover:bg-white/10" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-b border-[#1a1c25]">
          <button
            className={`py-3 text-center ${activeTab === "camera" ? "bg-secondary text-foreground" : "bg-muted text-muted-foreground"}`}
            onClick={() => setActiveTab("camera")}
          >
            <span className="flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" />
              Live Camera
            </span>
          </button>
          <button
            className={`py-3 text-center ${activeTab === "sample" ? "bg-secondary text-foreground" : "bg-muted text-muted-foreground"}`}
            onClick={() => setActiveTab("sample")}
          >
            <span className="flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Sample Photo
            </span>
          </button>
          <button
            className={`py-3 text-center ${activeTab === "3d" ? "bg-secondary text-foreground" : "bg-muted text-muted-foreground"} ${!modelUrl ? "opacity-50" : ""}`}
            onClick={() => modelUrl && setActiveTab("3d")}
            disabled={!modelUrl}
          >
            <span className="flex items-center justify-center gap-2">
              <CubeIcon className="w-4 h-4" />
              3D View
            </span>
          </button>
        </div>

        <div className="aspect-[4/3] w-full bg-black relative">
          {activeTab === "camera" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400 flex flex-col items-center">
                <Camera className="w-12 h-12 mb-2" />
                <p>Camera permission required</p>
                <button className="mt-4 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-md">Enable Camera</button>
              </div>
            </div>
          ) : activeTab === "sample" ? (
            <div className="w-full h-full flex items-center justify-center">
              <img src="/placeholder.svg?key=vt1n0" alt="Sample face" className="max-w-full max-h-full" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {is3DLoading ? (
                <div className="text-gray-400 flex flex-col items-center">
                  <CubeIcon className="w-12 h-12 mb-2 animate-pulse" />
                  <p>Loading 3D model...</p>
                </div>
              ) : (
                <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />
              )}
            </div>
          )}

          {/* This would be where the AR glasses overlay would go in a real implementation */}
          <div className="absolute inset-0 pointer-events-none">
            {/* AR glasses overlay would be positioned here */}
          </div>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full ${selectedColor === color ? "ring-2 ring-white" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
          <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center gap-2">
            <Camera className="w-4 h-4" />
            {activeTab === "3d" ? "Save View" : "Capture"}
          </button>
        </div>
      </div>
    </div>
  )
}
