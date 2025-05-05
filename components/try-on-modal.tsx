"use client"

import { useState } from "react"
import { X, Camera, ImageIcon } from "lucide-react"

interface TryOnModalProps {
  isOpen: boolean
  onClose: () => void
  frame: {
    name: string
    price: number
    material: string
    image: string
    colors: string[]
  }
}

export function TryOnModal({ isOpen, onClose, frame }: TryOnModalProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "sample">("camera")
  const [selectedColor, setSelectedColor] = useState(frame.colors[0])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#0a0c14] rounded-lg max-w-2xl w-full overflow-hidden border border-[#1a1c25]">
        <div className="flex items-center justify-between p-4 border-b border-[#1a1c25]">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-bold">{frame.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">${frame.price}</span>
              <span className="text-gray-400">{frame.material}</span>
              <button onClick={onClose} className="ml-2 p-1 rounded-full hover:bg-white/10" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-[#1a1c25]">
          <button
            className={`py-3 text-center ${activeTab === "camera" ? "bg-[#0f1117] text-white" : "bg-[#0a0c14] text-gray-400"}`}
            onClick={() => setActiveTab("camera")}
          >
            <span className="flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" />
              Live Camera
            </span>
          </button>
          <button
            className={`py-3 text-center ${activeTab === "sample" ? "bg-[#0f1117] text-white" : "bg-[#0a0c14] text-gray-400"}`}
            onClick={() => setActiveTab("sample")}
          >
            <span className="flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Sample Photo
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
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/placeholder.svg?height=400&width=600&query=person+face+sample"
                alt="Sample face"
                className="max-w-full max-h-full"
              />
            </div>
          )}

          {/* This would be where the AR glasses overlay would go in a real implementation */}
          <div className="absolute inset-0 pointer-events-none">
            {/* AR glasses overlay would be positioned here */}
          </div>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex gap-2">
            {frame.colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full ${selectedColor === color ? "ring-2 ring-white" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
          <button className="px-6 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-md flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Capture
          </button>
        </div>
      </div>
    </div>
  )
}
