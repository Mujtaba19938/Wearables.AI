"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto m-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
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
                <h3 className="text-lg font-medium mb-3">Frame Type</h3>
                <div className="flex flex-wrap gap-2">
                  {frameTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleFilter("type", type)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        isFilterActive("type", type)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Colors */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Frame Color</h3>
                <div className="flex flex-wrap gap-2">
                  {frameColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleFilter("color", color)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        isFilterActive("color", color)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Face Shapes */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Face Shape</h3>
                <div className="flex flex-wrap gap-2">
                  {faceShapes.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => toggleFilter("faceShape", shape)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        isFilterActive("faceShape", shape)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter summary */}
              {Object.values(localFilters).some((filters) => filters.length > 0) && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Selected filters:</span>{" "}
                    {Object.values(localFilters).reduce((count, filters) => count + filters.length, 0)} total
                  </p>
                </div>
              )}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
