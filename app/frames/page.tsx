"use client"

import { useState } from "react"
import { FrameCard } from "@/components/frame-card"
import { Search, SlidersHorizontal } from "lucide-react"

export default function FramesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const frames = [
    {
      id: "round-vintage",
      name: "Round Vintage",
      description: "Circular frames with a vintage feel",
      image: "/frames/round-vintage.png",
      price: 119,
      bestseller: false,
      faceShapes: ["Square", "Heart"],
      materials: ["Metal", "Acetate", "Plastic"],
      colors: ["Gold", "Silver", "Black"],
      defaultMaterial: "Metal",
      defaultColor: "Gold",
    },
    {
      id: "wayfarer-classic",
      name: "Classic Wayfarer",
      description: "Timeless design with a slightly angular frame",
      image: "/frames/wayfarer-classic.png",
      price: 149,
      bestseller: true,
      faceShapes: ["Oval", "Round"],
      materials: ["Acetate", "Plastic"],
      colors: ["Black", "Tortoise", "Blue"],
      defaultMaterial: "Acetate",
      defaultColor: "Black",
    },
    {
      id: "cat-eye-elegance",
      name: "Cat-Eye Elegance",
      description: "Upswept frames with a retro vibe",
      image: "/frames/cat-eye-elegance.png",
      price: 129,
      bestseller: true,
      faceShapes: ["Diamond", "Oval"],
      materials: ["Acetate", "Metal", "Plastic"],
      colors: ["Black", "Red", "Tortoise"],
      defaultMaterial: "Acetate",
      defaultColor: "Black",
    },
    {
      id: "aviator-metal",
      name: "Aviator Classic",
      description: "Timeless aviator style with double bridge",
      image: "/frames/aviator-metal.png",
      price: 139,
      bestseller: false,
      faceShapes: ["Heart", "Oval", "Square"],
      materials: ["Metal"],
      colors: ["Gold", "Silver", "Black"],
      defaultMaterial: "Metal",
      defaultColor: "Gold",
    },
    {
      id: "rectangle-acetate",
      name: "Modern Rectangle",
      description: "Contemporary rectangular frames with clean lines",
      image: "/frames/rectangle-acetate.png",
      price: 129,
      bestseller: false,
      faceShapes: ["Round", "Oval"],
      materials: ["Acetate", "Plastic"],
      colors: ["Black", "Tortoise", "Blue"],
      defaultMaterial: "Acetate",
      defaultColor: "Black",
    },
  ]

  const filteredFrames = frames.filter(
    (frame) =>
      frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      frame.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      frame.faceShapes.some((shape) => shape.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="w-full mb-4 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">Eyeglass Frames</h1>
        <p className="text-sm sm:text-base text-gray-400">
          Find the perfect frames for your face shape and style preference
        </p>
      </div>

      <div className="w-full flex gap-2 sm:gap-4 mb-4 sm:mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search frames..."
            className="w-full bg-[#0f1117] border border-[#1a1c25] rounded-lg py-2 px-4 pl-9 sm:pl-10 text-white text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        <button className="bg-[#0f1117] border border-[#1a1c25] rounded-lg p-2">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {filteredFrames.map((frame) => (
          <FrameCard key={frame.id} {...frame} />
        ))}
      </div>
    </main>
  )
}
