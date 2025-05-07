"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"

interface FilterOption {
  id: string
  label: string
}

interface FrameFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterState) => void
  initialFilters: FilterState
}

export interface FilterState {
  faceShapes: string[]
  materials: string[]
  priceRange: [number, number]
  colors: string[]
}

export function FrameFilterModal({ isOpen, onClose, onApplyFilters, initialFilters }: FrameFilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  if (!isOpen) return null

  const faceShapeOptions: FilterOption[] = [
    { id: "oval", label: "Oval" },
    { id: "round", label: "Round" },
    { id: "square", label: "Square" },
    { id: "heart", label: "Heart" },
    { id: "diamond", label: "Diamond" },
  ]

  const materialOptions: FilterOption[] = [
    { id: "metal", label: "Metal" },
    { id: "acetate", label: "Acetate" },
    { id: "plastic", label: "Plastic" },
    { id: "titanium", label: "Titanium" },
  ]

  const colorOptions: FilterOption[] = [
    { id: "black", label: "Black" },
    { id: "gold", label: "Gold" },
    { id: "silver", label: "Silver" },
    { id: "tortoise", label: "Tortoise" },
    { id: "blue", label: "Blue" },
    { id: "red", label: "Red" },
  ]

  const toggleFaceShape = (shapeId: string) => {
    setFilters((prev) => ({
      ...prev,
      faceShapes: prev.faceShapes.includes(shapeId)
        ? prev.faceShapes.filter((id) => id !== shapeId)
        : [...prev.faceShapes, shapeId],
    }))
  }

  const toggleMaterial = (materialId: string) => {
    setFilters((prev) => ({
      ...prev,
      materials: prev.materials.includes(materialId)
        ? prev.materials.filter((id) => id !== materialId)
        : [...prev.materials, materialId],
    }))
  }

  const toggleColor = (colorId: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorId) ? prev.colors.filter((id) => id !== colorId) : [...prev.colors, colorId],
    }))
  }

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [min, max],
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({
      faceShapes: [],
      materials: [],
      priceRange: [0, 500],
      colors: [],
    })
  }

  // Helper function to get color hex values
  function getColorHex(colorId: string): string {
    switch (colorId.toLowerCase()) {
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
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full overflow-hidden border border-border shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Filter Frames</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Face Shape Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Face Shape</h3>
            <div className="grid grid-cols-2 gap-2">
              {faceShapeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleFaceShape(option.id)}
                  className={`flex items-center justify-between p-2 rounded-md border ${
                    filters.faceShapes.includes(option.id)
                      ? "bg-primary/20 border-primary shadow-sm"
                      : "bg-muted border-border"
                  }`}
                >
                  <span>{option.label}</span>
                  {filters.faceShapes.includes(option.id) && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Material Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Material</h3>
            <div className="grid grid-cols-2 gap-2">
              {materialOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleMaterial(option.id)}
                  className={`flex items-center justify-between p-2 rounded-md border ${
                    filters.materials.includes(option.id)
                      ? "bg-primary/20 border-primary shadow-sm"
                      : "bg-muted border-border"
                  }`}
                >
                  <span>{option.label}</span>
                  {filters.materials.includes(option.id) && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Price Range</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-muted-foreground">Min</label>
                <input
                  type="number"
                  min="0"
                  max={filters.priceRange[1]}
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
                  className="w-full bg-muted border border-border rounded p-2 mt-1"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground">Max</label>
                <input
                  type="number"
                  min={filters.priceRange[0]}
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                  className="w-full bg-muted border border-border rounded p-2 mt-1"
                />
              </div>
            </div>

            {/* Price range slider visualization */}
            <div className="mt-4 px-2">
              <div className="h-2 bg-muted rounded-full relative">
                <div
                  className="absolute h-2 bg-primary rounded-full"
                  style={{
                    left: `${(filters.priceRange[0] / 500) * 100}%`,
                    right: `${100 - (filters.priceRange[1] / 500) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>$0</span>
                <span>$500</span>
              </div>
            </div>
          </div>

          {/* Color Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Color</h3>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((option) => {
                const colorHex = getColorHex(option.id)
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleColor(option.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      filters.colors.includes(option.id)
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : ""
                    }`}
                    style={{ backgroundColor: colorHex }}
                    aria-label={`Filter by ${option.label}`}
                  >
                    {filters.colors.includes(option.id) && (
                      <Check className={`h-5 w-5 ${option.id === "black" ? "text-white" : "text-black"}`} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-between">
          <button onClick={handleReset} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md transition-colors">
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md transition-colors shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
