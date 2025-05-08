"use client"

import { useState, useEffect } from "react"
import { FrameCard } from "@/components/frame-card"
import { FrameFilterModal, type FilterState } from "@/components/frame-filter-modal"
import { Filter, SlidersHorizontal, Grid, List, ArrowUpDown, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"

type SortOption = "featured" | "price-low" | "price-high" | "newest"
type ViewMode = "grid" | "list"

export default function FramesPage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [faceAnalysisResults, setFaceAnalysisResults] = useState<any>(null)
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    faceShapes: [],
    materials: [],
    priceRange: [0, 500],
    colors: [],
  })
  const [filtersApplied, setFiltersApplied] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("featured")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false)

  const searchParams = useSearchParams()
  const { theme } = useTheme()
  const isLightMode = theme === "light"

  // Get face shape from URL if available
  const faceShape = searchParams.get("faceShape") || ""

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
      image: "/wayfarer-glasses.png",
      colors: ["#000000", "#8B4513", "#3B82F6"],
      material: "Acetate",
      frameShape: "Wayfarer",
      isNew: true,
      isBestseller: true,
      faceShapes: ["Square", "Round", "Oval"],
      rating: 4.8,
    },
    {
      id: "2",
      name: "Round Metal",
      price: 149,
      image: "/placeholder.svg?key=bygrh",
      colors: ["#C0C0C0", "#FFD700", "#000000"],
      material: "Metal",
      frameShape: "Round",
      isNew: false,
      isBestseller: false,
      faceShapes: ["Square", "Heart", "Diamond"],
      rating: 4.5,
    },
    {
      id: "3",
      name: "Aviator Classic",
      price: 169,
      image: "/aviator-glasses.png",
      colors: ["#C0C0C0", "#FFD700", "#8B4513"],
      material: "Metal",
      frameShape: "Aviator",
      isNew: false,
      isBestseller: true,
      faceShapes: ["Oval", "Heart", "Square"],
      rating: 4.9,
    },
    {
      id: "4",
      name: "Cat-Eye Vintage",
      price: 139,
      image: "/cat-eye-glasses.png",
      colors: ["#000000", "#8B4513", "#FF0000"],
      material: "Acetate",
      frameShape: "Cat-Eye",
      isNew: true,
      isBestseller: false,
      faceShapes: ["Round", "Oval", "Square"],
      rating: 4.6,
    },
    {
      id: "5",
      name: "Rectangle Classic",
      price: 119,
      image: "/rectangle-glasses.png",
      colors: ["#000000", "#8B4513", "#3B82F6"],
      material: "Acetate",
      frameShape: "Rectangle",
      isNew: false,
      isBestseller: false,
      faceShapes: ["Round", "Oval", "Heart"],
      rating: 4.3,
    },
    {
      id: "6",
      name: "Clubmaster",
      price: 159,
      image: "/clubmaster-glasses.png",
      colors: ["#000000", "#8B4513", "#C0C0C0"],
      material: "Mixed",
      frameShape: "Browline",
      isNew: false,
      isBestseller: true,
      faceShapes: ["Diamond", "Oval", "Heart"],
      rating: 4.7,
    },
  ]

  // Filter frames based on face shape if available
  let filteredFrames = faceShape ? frames.filter((frame) => frame.faceShapes.includes(faceShape)) : frames

  // Apply search filter
  if (searchQuery) {
    filteredFrames = filteredFrames.filter(
      (frame) =>
        frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        frame.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        frame.frameShape.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Apply sorting
  filteredFrames = [...filteredFrames].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "newest":
        return a.isNew ? -1 : b.isNew ? 1 : 0
      default: // featured - bestsellers first
        return b.isBestseller ? 1 : a.isBestseller ? -1 : 0
    }
  })

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters)
    setFiltersApplied(
      filters.faceShapes.length > 0 ||
        filters.materials.length > 0 ||
        filters.colors.length > 0 ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 500,
    )
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (activeFilters.faceShapes.length > 0) count += 1
    if (activeFilters.materials.length > 0) count += 1
    if (activeFilters.colors.length > 0) count += 1
    if (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 500) count += 1
    return count
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case "price-low":
        return "Price: Low to High"
      case "price-high":
        return "Price: High to Low"
      case "newest":
        return "Newest First"
      default:
        return "Featured"
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isLightMode ? "text-gray-900" : ""}`}>Eyeglass Frames</h1>

        {/* Search bar */}
        <div className="relative w-full max-w-xs mx-4">
          <input
            type="text"
            placeholder="Search frames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isLightMode ? "bg-white border border-gray-300 text-gray-900" : "bg-background border border-border"
            }`}
          />
          <Search
            className={`absolute left-3 top-2.5 w-5 h-5 ${isLightMode ? "text-gray-500" : "text-muted-foreground"}`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <div className="relative">
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isLightMode
                  ? "bg-white border border-gray-300 hover:bg-gray-50 text-gray-800"
                  : "border border-border bg-card hover:bg-muted"
              }`}
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="hidden sm:inline">{getSortLabel()}</span>
            </button>

            {isSortDropdownOpen && (
              <div
                className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg z-10 ${
                  isLightMode ? "bg-white border border-gray-200" : "bg-card border border-border"
                }`}
              >
                <button
                  className={`w-full text-left px-4 py-2 transition-colors ${
                    sortBy === "featured"
                      ? isLightMode
                        ? "bg-gray-100"
                        : "bg-muted"
                      : isLightMode
                        ? "hover:bg-gray-50"
                        : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    setSortBy("featured")
                    setIsSortDropdownOpen(false)
                  }}
                >
                  Featured
                </button>
                <button
                  className={`w-full text-left px-4 py-2 transition-colors ${
                    sortBy === "price-low"
                      ? isLightMode
                        ? "bg-gray-100"
                        : "bg-muted"
                      : isLightMode
                        ? "hover:bg-gray-50"
                        : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    setSortBy("price-low")
                    setIsSortDropdownOpen(false)
                  }}
                >
                  Price: Low to High
                </button>
                <button
                  className={`w-full text-left px-4 py-2 transition-colors ${
                    sortBy === "price-high"
                      ? isLightMode
                        ? "bg-gray-100"
                        : "bg-muted"
                      : isLightMode
                        ? "hover:bg-gray-50"
                        : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    setSortBy("price-high")
                    setIsSortDropdownOpen(false)
                  }}
                >
                  Price: High to Low
                </button>
                <button
                  className={`w-full text-left px-4 py-2 transition-colors ${
                    sortBy === "newest"
                      ? isLightMode
                        ? "bg-gray-100"
                        : "bg-muted"
                      : isLightMode
                        ? "hover:bg-gray-50"
                        : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    setSortBy("newest")
                    setIsSortDropdownOpen(false)
                  }}
                >
                  Newest First
                </button>
              </div>
            )}
          </div>

          {/* View toggle */}
          <div
            className={`flex rounded-lg overflow-hidden ${isLightMode ? "border border-gray-300" : "border border-border"}`}
          >
            <button
              className={`p-2 ${
                viewMode === "grid"
                  ? isLightMode
                    ? "bg-blue-600 text-white"
                    : "bg-primary text-primary-foreground"
                  : isLightMode
                    ? "bg-white hover:bg-gray-50 text-gray-800"
                    : "bg-card hover:bg-muted"
              }`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              className={`p-2 ${
                viewMode === "list"
                  ? isLightMode
                    ? "bg-blue-600 text-white"
                    : "bg-primary text-primary-foreground"
                  : isLightMode
                    ? "bg-white hover:bg-gray-50 text-gray-800"
                    : "bg-card hover:bg-muted"
              }`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filter button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-colors ${
              filtersApplied
                ? isLightMode
                  ? "bg-blue-600 text-white"
                  : "bg-primary text-primary-foreground"
                : isLightMode
                  ? "bg-white border border-gray-300 hover:bg-gray-50 text-gray-800"
                  : "bg-card border border-border hover:bg-muted"
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filter Options</span>
            {filtersApplied && (
              <span
                className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
                  isLightMode ? "bg-white text-blue-600" : "bg-white text-primary"
                }`}
              >
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {faceShape && (
        <div className={`mb-6 p-4 rounded-lg ${isLightMode ? "bg-blue-50 border border-blue-100" : "bg-primary/10"}`}>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className={`w-5 h-5 ${isLightMode ? "text-blue-600" : "text-primary"}`} />
            <h2 className="font-medium">Showing frames recommended for {faceShape} face shape</h2>
          </div>
          {faceAnalysisResults && (
            <p className={`text-sm mt-1 ${isLightMode ? "text-gray-600" : "text-muted-foreground"}`}>
              Based on your face analysis, these frames should complement your features.
            </p>
          )}
        </div>
      )}

      {filteredFrames.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className={`text-xl font-medium mb-4 ${isLightMode ? "text-gray-900" : ""}`}>
            No frames match your criteria
          </p>
          <button
            onClick={() => {
              setSearchQuery("")
              setActiveFilters({
                faceShapes: [],
                materials: [],
                priceRange: [0, 500],
                colors: [],
              })
              setFiltersApplied(false)
            }}
            className={`px-4 py-2 rounded-md ${isLightMode ? "bg-blue-600 text-white" : "bg-primary text-primary-foreground"}`}
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
      ) : (
        <div className="flex flex-col gap-4">
          {filteredFrames.map((frame) => (
            <div
              key={frame.id}
              className={`flex flex-col sm:flex-row rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 ${
                isLightMode ? "bg-white border border-gray-200" : "bg-card border border-border"
              }`}
            >
              <div className="sm:w-1/3 aspect-square">
                <img src={frame.image || "/placeholder.svg"} alt={frame.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 sm:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-medium text-lg ${isLightMode ? "text-gray-900" : ""}`}>{frame.name}</h3>
                    <div className="flex gap-1">
                      {frame.isNew && <span className="badge-new">New</span>}
                      {frame.isBestseller && <span className="badge-bestseller">Bestseller</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`font-bold text-xl ${isLightMode ? "text-blue-600" : "text-primary"}`}>
                      ${frame.price}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        isLightMode ? "bg-gray-100 text-gray-800" : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {frame.material}
                    </span>
                  </div>
                  <p className={`mb-4 ${isLightMode ? "text-gray-600" : "text-muted-foreground"}`}>
                    Perfect for {frame.faceShapes.join(", ")} face shapes
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {frame.colors.map((color) => (
                      <div key={color} className="relative">
                        <button
                          className="w-7 h-7 rounded-full"
                          style={{ backgroundColor: color }}
                          aria-label={`${color} color option`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsTryOnModalOpen(true)}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        isLightMode
                          ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      }`}
                    >
                      Try On
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        isLightMode
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FrameFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </main>
  )
}
