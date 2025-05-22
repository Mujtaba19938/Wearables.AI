"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Glasses, CuboidIcon as Cube, Heart, ShoppingCart } from "lucide-react"
import { TryOnModal } from "@/components/try-on-modal"

interface FrameCardProps {
  id: string
  name: string
  type: string
  price: number
  imageUrl: string
  modelUrl?: string
  onAdd3DModel: () => void
}

export default function FrameCard({ id, name, type, price, imageUrl, modelUrl, onAdd3DModel }: FrameCardProps) {
  const [selectedColor, setSelectedColor] = useState<string>("gray")
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false)
  const [isARActive, setIsARActive] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const colors = [
    { name: "gray", class: "bg-gray-400 border-gray-500" },
    { name: "gold", class: "bg-yellow-500 border-yellow-600" },
    { name: "black", class: "bg-black border-gray-700" },
  ]

  const handleTryOnClick = () => {
    setIsARActive(true)
    setIsTryOnModalOpen(true)
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg card-gradient"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48 bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <img src={imageUrl || "/placeholder.svg"} alt={name} className="max-h-full max-w-full object-contain" />

        {/* 3D Model Badge */}
        {modelUrl && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Cube className="w-3 h-3 mr-1" />
            3D
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm transition-colors hover:bg-white dark:hover:bg-black/70"
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-500 dark:text-gray-400"}`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{type}</p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color.name}
                className={`w-6 h-6 rounded-full border ${color.class} ${
                  selectedColor === color.name ? "ring-2 ring-blue-500" : ""
                } transition-all hover:scale-110`}
                onClick={() => setSelectedColor(color.name)}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
          <span className="font-bold text-lg">${price.toFixed(2)}</span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleTryOnClick}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all ${
              isARActive ? "animate-pulse" : ""
            }`}
          >
            <Glasses className="w-4 h-4" />
            <span>Try On</span>
          </button>

          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Add 3D Model button */}
        <button
          onClick={onAdd3DModel}
          className="mt-2 w-full flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <Cube className="w-4 h-4" />
          <span>{modelUrl ? "Update 3D Model" : "Add 3D Model"}</span>
        </button>
      </div>

      {/* Try On Modal */}
      <TryOnModal
        isOpen={isTryOnModalOpen}
        onClose={() => setIsTryOnModalOpen(false)}
        frameName={name}
        frameImage={imageUrl}
        frameColor={selectedColor}
        modelUrl={modelUrl}
      />
    </motion.div>
  )
}
