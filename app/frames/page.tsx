"use client"

import { useState, useEffect } from "react"
import { FrameCard } from "@/components/frame-card"
import { FrameFilterModal } from "@/components/frame-filter-modal"
import { Filter, SlidersHorizontal } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function FramesPage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [faceAnalysisResults, setFaceAnalysisResults] = useState<any>(null)
  const searchParams = useSearchParams()

  // Get face shape from URL if available
  const faceShape = searchParams.get("faceShape") || "Oval"

  // Load face analysis results from localStorage on component mount
  useEffect(() => {
    try {
      const savedAnalysis = localStorage.getItem("faceAnalysisResults")
      if (savedAnalysis) {
        setFaceAnalysisResults(JSON.parse(savedAnalysis))
      }
    } catch (error) {
      console.error("Error loading face analysis results:", error)
    }
  }, [])

  // Sample frame data
  const frames = [
    {
      id: "1",
      name: "Classic Wayfarer",
      price: 129,
      image: "/placeholder.svg?key=l0rmu",
      colors: ["#000000", "#8B4513", "#3B82F6"],
      material: "Acetate",
      frameShape: "Wayfarer",
      isNew: true,
      isBestseller: true,
      faceShapes: ["Square", "Round", "Oval"],
    },
    {
      id: "2",
      name: "Round Metal",
      price: 149,
      image: "/placeholder.svg?key=soi4o",
      colors: ["#C0C0C0", "#FFD700", "#000000"],
      material: "Metal",
      frameShape: "Round",
      isNew: false,
      isBestseller: false,
      faceShapes: ["Square", "Heart", "Diamond"],
    },
    {
      id: "3",
      name: "Aviator Classic",
      price: 169,
      image: "/placeholder.svg?key=3a3wr",
      colors: ["#C0C0C0", "#FFD700", "#8B4513"],
      material: "Metal",
      frameShape: "Aviator",
      isNew: false,
      isBestseller: true,
      faceShapes: ["Oval", "Heart", "Square"],
    },
    {
      id: "4",
      name: "Cat-Eye Vintage",
      price: 139,
      image: "/placeholder.svg?key=6algy",
      colors: ["#000000", "#8B4513", "#FF0000"],
      material: "Acetate",
      frameShape: "Cat-Eye",
      isNew: true,
      isBestseller: false,
      faceShapes: ["Round", "Oval", "Square"],
    },
    {
      id: "5",
      name: "Rectangle Classic",
      price: 119,
      image: "/placeholder.svg?key=og6jb",
      colors: ["#000000", "#8B4513", "#3B82F6"],
      material: "Acetate",
      frameShape: "Rectangle",
      isNew: false,
      isBestseller: false,
      faceShapes: ["Round", "Oval", "Heart"],
    },
    {
      id: "6",
      name: "Clubmaster",
      price: 159,
      image: "/placeholder.svg?height=300&width=300&query=clubmaster+glasses",
      colors: ["#000000", "#8B4513", "#C0C0C0"],
      material: "Mixed",
      frameShape: "Browline",
      isNew: false,
      isBestseller: true,
      faceShapes: ["Diamond", "Oval", "Heart"],
    },
  ]

  // Filter frames based on face shape if available
  const filteredFrames = faceShape ? frames.filter((frame) => frame.faceShapes.includes(faceShape)) : frames

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Eyeglass Frames</h1>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/90 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      {faceShape && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2 className="font-medium">Showing frames recommended for {faceShape} face shape</h2>
          </div>
          {faceAnalysisResults && (
            <p className="text-sm text-muted-foreground mt-1">
              Based on your face analysis, these frames should complement your features.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFrames.map((frame) => (
          <FrameCard
            key={frame.id}
            name={frame.name}
            price={frame.price}
            image={frame.image}
            colors={frame.colors}
            material={frame.material}
            frameShape={frame.frameShape}
            isNew={frame.isNew}
            isBestseller={frame.isBestseller}
            faceAnalysisResults={faceAnalysisResults}
          />
        ))}
      </div>

      <FrameFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </main>
  )
}
