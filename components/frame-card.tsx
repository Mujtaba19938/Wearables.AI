"use client"

import { useState } from "react"
import { Heart, Star, Glasses } from "lucide-react"
import { TryOnModal } from "./try-on-modal"

interface FrameCardProps {
  id: string
  name: string
  price: number
  image: string
  rating: number
  isNew?: boolean
  isBestseller?: boolean
  material?: string
  modelUrl?: string | null
  frameShape?: string
  faceAnalysisResults?: any
}

export function FrameCard({
  id,
  name,
  price,
  image,
  rating,
  isNew = false,
  isBestseller = false,
  material = "Acetate",
  modelUrl = null,
  frameShape = "Rectangle",
  faceAnalysisResults,
}: FrameCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isARActive, setIsARActive] = useState(false)

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleARButtonClick = () => {
    setIsARActive(true)
    setTimeout(() => {
      setIsModalOpen(true)
      // Set a small delay before resetting the animation state
      setTimeout(() => setIsARActive(false), 300)
    }, 600)
  }

  return (
    <>
      <div className="group relative rounded-lg overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-lg">
        {/* Badge container */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {isNew && <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">New</span>}
          {isBestseller && (
            <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">Bestseller</span>
          )}
        </div>

        {/* Like button */}
        <button
          onClick={toggleLike}
          className="absolute top-2 right-2 z-10 p-1.5 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "fill-none"}`} />
        </button>

        {/* Image container */}
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-sm line-clamp-1">{name}</h3>
            <span className="font-bold text-sm">${price}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs ml-1">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">{material}</span>
          </div>

          {/* Action buttons */}
          <div className="mt-3 grid grid-cols-1 gap-2">
            <button
              onClick={handleARButtonClick}
              className={`w-full py-1.5 px-3 rounded flex items-center justify-center gap-1.5 text-sm font-medium transition-all duration-300 ${
                isARActive ? "bg-blue-600 text-white scale-95" : "bg-primary hover:bg-primary/90 text-white"
              }`}
            >
              <Glasses className={`w-4 h-4 ${isARActive ? "animate-pulse" : ""}`} />
              Try On with AR
            </button>
          </div>
        </div>
      </div>

      {/* Try On Modal */}
      <TryOnModal
        isOpen={isModalOpen}
        onClose={closeModal}
        frameName={name}
        frameImage={image}
        modelUrl={modelUrl}
        price={price}
        material={material}
        frameShape={frameShape}
        faceAnalysisResults={faceAnalysisResults}
      />
    </>
  )
}
