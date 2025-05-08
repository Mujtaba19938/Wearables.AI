"use client"

import { useState } from "react"
import { Heart, Maximize2, CuboidIcon as CubeIcon, Glasses, Camera } from "lucide-react"
import { TryOnModal } from "./try-on-modal"
import { Frame3DCaptureModal } from "./frame-3d-capture-modal"
import type { FrameMeasurements } from "./frame-measurements-display"
import { useTheme } from "next-themes"

interface FrameCardProps {
  name: string
  price: number
  image: string
  colors: string[]
  material: string
  frameShape: string
  isNew?: boolean
  isBestseller?: boolean
  modelUrl?: string
  faceAnalysisResults?: any
  onAddToWishlist?: () => void
}

// Helper function to get color names
const getColorName = (colorCode: string): string => {
  const colorMap: Record<string, string> = {
    "#000000": "Matte Black",
    "#8B4513": "Tortoise Shell",
    "#3B82F6": "Ocean Blue",
    "#C0C0C0": "Silver",
    "#FFD700": "Gold",
    "#FF0000": "Ruby Red",
  }
  return colorMap[colorCode] || "Custom Color"
}

export function FrameCard({
  name,
  price,
  image,
  colors,
  material,
  frameShape,
  isNew = false,
  isBestseller = false,
  modelUrl,
  faceAnalysisResults,
  onAddToWishlist,
}: FrameCardProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [selectedMaterial, setSelectedMaterial] = useState(material)
  const [isHovered, setIsHovered] = useState(false)
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false)
  const [is3DCaptureModalOpen, setIs3DCaptureModalOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [isARActive, setIsARActive] = useState(false)
  const { theme } = useTheme()
  const isLightMode = theme === "light"

  // Sample frame measurements - in a real app, this would come from your database
  const frameMeasurements: FrameMeasurements = {
    lensWidth: 52,
    bridgeWidth: 18,
    templeLength: 140,
    lensHeight: 42,
    totalWidth: 138,
    frameWeight: 28,
    frameDepth: 38,
    rimThickness: 5,
  }

  const handleARTryOn = () => {
    // Check if WebXR is supported
    if ("xr" in navigator) {
      // In a real implementation, this would launch the AR experience
      // For now, we'll just open the try-on modal
      setIsTryOnModalOpen(true)

      // Simulate AR activation
      setIsARActive(true)

      // For demo purposes, we'll reset the AR state after a few seconds
      setTimeout(() => {
        setIsARActive(false)
      }, 5000)
    } else {
      // Fallback for browsers that don't support WebXR
      alert("AR is not supported in your browser. Try using the latest Chrome or Safari on a compatible device.")
      setIsTryOnModalOpen(true)
    }
  }

  return (
    <>
      <div
        className={`group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] ${
          isLightMode ? "bg-white border border-gray-200 shadow-sm" : "bg-card border border-border"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Quick action buttons */}
          <div
            className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <button
              onClick={() => setIsTryOnModalOpen(true)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isLightMode
                  ? "bg-white/90 text-gray-700 hover:bg-white"
                  : "bg-gray-800/90 text-gray-200 hover:bg-gray-800"
              }`}
              aria-label="Try on"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            <button
              onClick={onAddToWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isLightMode
                  ? "bg-white/90 text-gray-700 hover:bg-white"
                  : "bg-gray-800/90 text-gray-200 hover:bg-gray-800"
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && <span className="badge-new">New</span>}
            {isBestseller && <span className="badge-bestseller">Bestseller</span>}
          </div>

          {/* 3D model badge */}
          {modelUrl && (
            <div className="absolute bottom-2 left-2">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-medium rounded-full shadow-md flex items-center gap-1">
                <CubeIcon className="w-3 h-3" />
                3D
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className={`font-medium text-lg mb-1 ${isLightMode ? "text-gray-900" : ""}`}>{name}</h3>

          <div className="flex justify-between items-center mb-3">
            <span className={`font-bold text-xl ${isLightMode ? "text-blue-600" : "text-primary"}`}>${price}</span>
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                isLightMode ? "bg-gray-100 text-gray-800" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {material}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {colors.map((color) => (
                <div key={color} className="relative">
                  <button
                    className={`w-7 h-7 rounded-full ${
                      selectedColor === color
                        ? `ring-2 ${isLightMode ? "ring-blue-600" : "ring-primary"} ring-offset-2 ring-offset-background`
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    onMouseEnter={() => setShowTooltip(color)}
                    onMouseLeave={() => setShowTooltip(null)}
                    aria-label={`Select ${getColorName(color)} color`}
                  />
                  {showTooltip === color && (
                    <div
                      className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded whitespace-nowrap z-10 ${
                        isLightMode ? "bg-gray-800 text-white" : "bg-black/80 text-white"
                      }`}
                    >
                      {getColorName(color)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Replace Add to Cart with Try On with AR */}
            <button
              onClick={handleARTryOn}
              className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
                isLightMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              } ${isARActive ? "animate-pulse" : ""}`}
            >
              {isARActive ? (
                <>
                  <Camera className="w-4 h-4 animate-spin" />
                  AR Active...
                </>
              ) : (
                <>
                  <Glasses className="w-4 h-4" />
                  Try On with AR
                </>
              )}
            </button>
          </div>

          {/* Add 3D button */}
          {!modelUrl && (
            <button
              onClick={() => setIs3DCaptureModalOpen(true)}
              className={`w-full mt-3 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm ${
                isLightMode
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  : "bg-secondary/70 text-secondary-foreground hover:bg-secondary/90"
              }`}
            >
              <CubeIcon className="w-4 h-4" />
              Add 3D Model
            </button>
          )}
        </div>
      </div>

      {/* Try-on Modal */}
      {isTryOnModalOpen && (
        <TryOnModal
          isOpen={isTryOnModalOpen}
          onClose={() => {
            setIsTryOnModalOpen(false)
            setIsARActive(false)
          }}
          frameName={name}
          frameImage={image}
          modelUrl={modelUrl || null}
          price={price}
          material={selectedMaterial}
          measurements={frameMeasurements}
          frameShape={frameShape}
          faceAnalysisResults={faceAnalysisResults}
        />
      )}

      {/* 3D Capture Modal */}
      {is3DCaptureModalOpen && (
        <Frame3DCaptureModal
          isOpen={is3DCaptureModalOpen}
          onClose={() => setIs3DCaptureModalOpen(false)}
          frameName={name}
        />
      )}
    </>
  )
}
