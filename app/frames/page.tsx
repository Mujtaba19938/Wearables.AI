"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { FrameCard } from "@/components/frame-card"
import { Filter, Search, Sun, Moon } from "lucide-react"
import { FrameFilterModal } from "@/components/frame-filter-modal"
import Frame3DCaptureModal from "@/components/frame-3d-capture-modal"

// Frame data type
interface Frame {
  id: string
  name: string
  type: string
  color: string
  price: number
  imageUrl: string
  modelUrl?: string
  faceShapeMatch: string[]
}

export default function FramesPage() {
  const [frames, setFrames] = useState<Frame[]>([])
  const [loading, setLoading] = useState(true)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    type: [],
    color: [],
    faceShape: [],
  })
  const [is3DCaptureModalOpen, setIs3DCaptureModalOpen] = useState(false)
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Set mounted state once component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Load frames data
  useEffect(() => {
    // Simulate loading frames data
    setTimeout(() => {
      setFrames([
        {
          id: "wayfarer-1",
          name: "Classic Wayfarer",
          type: "Wayfarer",
          color: "Black",
          price: 129.99,
          imageUrl: "/wayfarer-glasses.png",
          faceShapeMatch: ["Square", "Round", "Oval"],
        },
        {
          id: "aviator-1",
          name: "Gold Aviator",
          type: "Aviator",
          color: "Gold",
          price: 149.99,
          imageUrl: "/aviator-glasses.png",
          faceShapeMatch: ["Heart", "Oval", "Diamond"],
        },
        {
          id: "cat-eye-1",
          name: "Retro Cat Eye",
          type: "Cat Eye",
          color: "Tortoise",
          price: 119.99,
          imageUrl: "/cat-eye-glasses.png",
          faceShapeMatch: ["Round", "Square", "Oval"],
        },
        {
          id: "rectangle-1",
          name: "Modern Rectangle",
          type: "Rectangle",
          color: "Silver",
          price: 139.99,
          imageUrl: "/rectangle-glasses.png",
          faceShapeMatch: ["Oval", "Heart", "Diamond"],
        },
        {
          id: "clubmaster-1",
          name: "Classic Clubmaster",
          type: "Clubmaster",
          color: "Black/Gold",
          price: 159.99,
          imageUrl: "/clubmaster-glasses.png",
          faceShapeMatch: ["Diamond", "Oval", "Heart"],
        },
        {
          id: "round-1",
          name: "Vintage Round",
          type: "Round",
          color: "Brown",
          price: 109.99,
          imageUrl: "/round-vintage-glasses.png",
          faceShapeMatch: ["Square", "Diamond", "Heart"],
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  // Filter frames based on search query and active filters
  const filteredFrames = frames.filter((frame) => {
    // Search filter
    if (
      searchQuery &&
      !frame.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !frame.type.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Type filter
    if (activeFilters.type.length > 0 && !activeFilters.type.includes(frame.type)) {
      return false
    }

    // Color filter
    if (activeFilters.color.length > 0 && !activeFilters.color.includes(frame.color)) {
      return false
    }

    // Face shape filter
    if (
      activeFilters.faceShape.length > 0 &&
      !activeFilters.faceShape.some((shape) => frame.faceShapeMatch.includes(shape))
    ) {
      return false
    }

    return true
  })

  // Handle 3D model creation
  const handle3DModelCreated = (modelUrl: string) => {
    if (selectedFrameId) {
      setFrames((prevFrames) =>
        prevFrames.map((frame) => (frame.id === selectedFrameId ? { ...frame, modelUrl } : frame)),
      )
      setSelectedFrameId(null)
    }
  }

  // Open 3D capture modal for a specific frame
  const openCaptureModal = (frameId: string) => {
    setSelectedFrameId(frameId)
    setIs3DCaptureModalOpen(true)
  }

  return (
    <>
      {/* Theme toggle button */}
      {mounted && (
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      )}

      <main className="container mx-auto px-4 py-8 pb-24">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Eyeglass Frames</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl">
            Browse our collection of eyeglass frames. Find the perfect style that complements your face shape and
            personal style.
          </p>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search frames..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setFilterModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Frames grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredFrames.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No frames match your search criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("")
                setActiveFilters({ type: [], color: [], faceShape: [] })
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrames.map((frame) => (
              <FrameCard
                key={frame.id}
                id={frame.id}
                name={frame.name}
                type={frame.type}
                price={frame.price}
                imageUrl={frame.imageUrl}
                modelUrl={frame.modelUrl}
                onAdd3DModel={() => openCaptureModal(frame.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Filter Modal */}
      <FrameFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />

      {/* 3D Capture Modal */}
      <Frame3DCaptureModal
        isOpen={is3DCaptureModalOpen}
        onClose={() => setIs3DCaptureModalOpen(false)}
        onModelCreated={handle3DModelCreated}
      />
    </>
  )
}
