"use client"

import { useState } from "react"
import { TryOnModal } from "@/components/try-on-modal"
import { Glasses } from "lucide-react"

interface FrameCardProps {
  id: string
  name: string
  description: string
  image: string
  price: number
  bestseller?: boolean
  faceShapes: string[]
  materials: string[]
  colors: string[]
  defaultMaterial: string
  defaultColor: string
}

export function FrameCard({
  id,
  name,
  description,
  image,
  price,
  bestseller = false,
  faceShapes,
  materials,
  colors,
  defaultMaterial,
  defaultColor,
}: FrameCardProps) {
  const [selectedMaterial, setSelectedMaterial] = useState(defaultMaterial)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const colorObjects = colors.map((color) => {
    switch (color.toLowerCase()) {
      case "gold":
      case "yellow":
        return "#EAB308"
      case "silver":
      case "gray":
        return "#CBD5E1"
      case "black":
        return "#000000"
      case "tortoise":
        return "#8B4513"
      case "blue":
        return "#3B82F6"
      case "red":
        return "#EF4444"
      default:
        return "#CBD5E1"
    }
  })

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="relative">
          <img src={image || "/placeholder.svg"} alt={name} className="w-full h-40 sm:h-48 object-cover" />
          {bestseller && (
            <div className="absolute top-2 right-2 bg-[#EAB308] text-black text-xs font-bold px-2 py-1 rounded">
              Bestseller
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg sm:text-xl font-bold">{name}</h3>
            <span className="text-lg font-bold">${price}</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">{description}</p>

          <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {faceShapes.map((shape) => (
              <span key={shape} className="bg-secondary text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {shape}
              </span>
            ))}
          </div>

          <div className="mb-3">
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 mb-1">Material:</div>
            <div className="relative">
              <select
                className="w-full appearance-none bg-muted border border-border rounded py-1.5 sm:py-2 px-2 sm:px-3 text-foreground text-sm"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                {materials.map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2 sm:right-3 top-2 sm:top-3"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 10L12 15L17 10H7Z" fill="white" />
              </svg>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 mb-1">Available Colors:</div>
            <div className="flex gap-2">
              {colorObjects.map((colorHex, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-[#1a1c25]"
                  style={{ backgroundColor: colorHex }}
                ></div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-black/80 transition-colors"
          >
            <Glasses className="w-4 h-4" />
            Try with AR
          </button>
        </div>
      </div>

      <TryOnModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        frame={{
          name,
          price,
          material: selectedMaterial,
          image,
          colors: colorObjects,
        }}
      />
    </>
  )
}
