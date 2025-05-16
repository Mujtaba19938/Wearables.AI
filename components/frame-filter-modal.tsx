"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface FilterState {
  type: string[]
  color: string[]
  faceShape: string[]
}

interface FrameFilterModalProps {
  isOpen: boolean
  onClose: () => void
  activeFilters: FilterState
  setActiveFilters: (filters: FilterState) => void
}

export function FrameFilterModal({ isOpen, onClose, activeFilters, setActiveFilters }: FrameFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(activeFilters)
  const [mounted, setMounted] = useState(false)

  // Set mounted state once component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update local filters when activeFilters change
  useEffect(() => {
    setLocalFilters(activeFilters)
  }, [activeFilters])

  // Reset local filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(activeFilters)
    }
  }, [isOpen, activeFilters])

  // Apply filters and close modal
  const handleApply = () => {
    setActiveFilters(localFilters)
    onClose()
  }

  // Reset all filters
  const handleReset = () => {
    const resetFilters = {
      type: [],
      color: [],
      faceShape: [],
    }
    setLocalFilters(resetFilters)
    setActiveFilters(resetFilters)
    onClose()
  }

  // Toggle a filter value
  const toggleFilter = (category: keyof FilterState, value: string) => {
    setLocalFilters((prev) => {
      const updated = { ...prev }
      if (updated[category].includes(value)) {
        updated[category] = updated[category].filter((item) => item !== value)
      } else {
        updated[category] = [...updated[category], value]
      }
      return updated
    })
  }

  // Check if a filter is active
  const isFilterActive = (category: keyof FilterState, value: string) => {
    return localFilters[category].includes(value)
  }

  // Frame types
  const frameTypes = ["Wayfarer", "Aviator", "Cat Eye", "Rectangle", "Round", "Clubmaster"]

  // Frame colors
  const frameColors = ["Black", "Gold", "Silver", "Tortoise", "Brown", "Blue", "Red"]

  // Face shapes
  const faceShapes = ["Oval", "Round", "Square", "Heart", "Diamond", "Triangle"]

  if (!mounted) return null

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Filter Frames</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          {/* Frame Types */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Frame Type</h3>
            <div className="flex flex-wrap gap-2">
              {frameTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleFilter("type", type)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isFilterActive("type", type)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Colors */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Frame Color</h3>
            <div className="flex flex-wrap gap-2">
              {frameColors.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleFilter("color", color)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isFilterActive("color", color)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Face Shapes */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Face Shape</h3>
            <div className="flex flex-wrap gap-2">
              {faceShapes.map((shape) => (
                <button
                  key={shape}
                  onClick={() => toggleFilter("faceShape", shape)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isFilterActive("faceShape", shape)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
