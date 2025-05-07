"use client"

import { useState } from "react"
import { Info, Ruler } from "lucide-react"

export interface FrameMeasurements {
  lensWidth: number
  bridgeWidth: number
  templeLength: number
  lensHeight: number
  totalWidth: number
  frameWeight?: number
  frameDepth?: number
  rimThickness?: number
}

interface FrameMeasurementsDisplayProps {
  measurements: FrameMeasurements
}

export function FrameMeasurementsDisplay({ measurements }: FrameMeasurementsDisplayProps) {
  const [showGuide, setShowGuide] = useState(false)

  // Format the standard eyewear size notation (e.g., "52-18-140")
  const standardSizeNotation = `${measurements.lensWidth}-${measurements.bridgeWidth}-${measurements.templeLength}`

  // Determine frame size category
  const getFrameSizeCategory = () => {
    const totalWidth = measurements.totalWidth
    if (totalWidth < 130) return { category: "Small", color: "text-blue-500" }
    if (totalWidth < 140) return { category: "Medium", color: "text-green-500" }
    return { category: "Large", color: "text-amber-500" }
  }

  const sizeCategory = getFrameSizeCategory()

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold mb-1">Frame Measurements</h3>
        <p className="text-sm text-muted-foreground">
          Standard Size: <span className="font-medium">{standardSizeNotation}</span>
        </p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
            Size: <span className={`font-medium ${sizeCategory.color}`}>{sizeCategory.category}</span>
          </span>
        </div>
      </div>

      {/* Frame diagram */}
      <div className="relative w-full h-48 bg-muted/50 rounded-lg flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-full p-4" xmlns="http://www.w3.org/2000/svg">
          {/* Frame outline */}
          <g stroke="currentColor" fill="none" strokeWidth="2">
            {/* Left lens */}
            <ellipse cx="120" cy="100" rx="70" ry="50" />

            {/* Right lens */}
            <ellipse cx="280" cy="100" rx="70" ry="50" />

            {/* Bridge */}
            <line x1="190" y1="100" x2="210" y2="100" />

            {/* Temples */}
            <line x1="50" y1="100" x2="10" y2="70" />
            <line x1="350" y1="100" x2="390" y2="70" />
          </g>

          {/* Measurement lines and labels */}
          {/* Lens width */}
          <g>
            <line x1="120" y1="170" x2="120" y2="180" stroke="#3B82F6" strokeWidth="1" />
            <line x1="50" y1="175" x2="190" y2="175" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 2" />
            <line x1="50" y1="170" x2="50" y2="180" stroke="#3B82F6" strokeWidth="1" />
            <line x1="190" y1="170" x2="190" y2="180" stroke="#3B82F6" strokeWidth="1" />
            <text x="120" y="195" fill="#3B82F6" fontSize="12" textAnchor="middle">
              {measurements.lensWidth}mm
            </text>
          </g>

          {/* Bridge width */}
          <g>
            <line x1="190" y1="80" x2="190" y2="70" stroke="#10B981" strokeWidth="1" />
            <line x1="190" y1="75" x2="210" y2="75" stroke="#10B981" strokeWidth="1" strokeDasharray="4 2" />
            <line x1="210" y1="80" x2="210" y2="70" stroke="#10B981" strokeWidth="1" />
            <text x="200" y="65" fill="#10B981" fontSize="12" textAnchor="middle">
              {measurements.bridgeWidth}mm
            </text>
          </g>

          {/* Temple length */}
          <g>
            <line x1="350" y1="40" x2="350" y2="30" stroke="#F59E0B" strokeWidth="1" />
            <line x1="350" y1="35" x2="390" y2="35" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 2" />
            <line x1="390" y1="40" x2="390" y2="30" stroke="#F59E0B" strokeWidth="1" />
            <text x="370" y="25" fill="#F59E0B" fontSize="12" textAnchor="middle">
              {measurements.templeLength}mm
            </text>
          </g>

          {/* Total width */}
          <g>
            <line x1="50" y1="20" x2="50" y2="10" stroke="#EC4899" strokeWidth="1" />
            <line x1="50" y1="15" x2="350" y2="15" stroke="#EC4899" strokeWidth="1" strokeDasharray="4 2" />
            <line x1="350" y1="20" x2="350" y2="10" stroke="#EC4899" strokeWidth="1" />
            <text x="200" y="25" fill="#EC4899" fontSize="12" textAnchor="middle">
              {measurements.totalWidth}mm
            </text>
          </g>
        </svg>
      </div>

      {/* Measurements grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Lens Width</p>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
            <p className="text-lg font-medium">{measurements.lensWidth} mm</p>
          </div>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Bridge Width</p>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
            <p className="text-lg font-medium">{measurements.bridgeWidth} mm</p>
          </div>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Temple Length</p>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
            <p className="text-lg font-medium">{measurements.templeLength} mm</p>
          </div>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Lens Height</p>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#6366F1]"></div>
            <p className="text-lg font-medium">{measurements.lensHeight} mm</p>
          </div>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Total Width</p>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#EC4899]"></div>
            <p className="text-lg font-medium">{measurements.totalWidth} mm</p>
          </div>
        </div>

        {measurements.frameWeight && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Weight</p>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
              <p className="text-lg font-medium">{measurements.frameWeight} g</p>
            </div>
          </div>
        )}

        {measurements.frameDepth && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Frame Depth</p>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#14B8A6]"></div>
              <p className="text-lg font-medium">{measurements.frameDepth} mm</p>
            </div>
          </div>
        )}

        {measurements.rimThickness && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Rim Thickness</p>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
              <p className="text-lg font-medium">{measurements.rimThickness} mm</p>
            </div>
          </div>
        )}
      </div>

      <button onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1.5 text-primary text-sm">
        <Info className="w-4 h-4" />
        {showGuide ? "Hide" : "Show"} size guide
      </button>

      {showGuide && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-1.5">
            <Ruler className="w-4 h-4" />
            How to Read Frame Measurements
          </h4>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Standard Notation ({standardSizeNotation}):</span> The three numbers
              represent lens width, bridge width, and temple length in millimeters.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-muted p-2 rounded">
                <p className="font-medium text-[#3B82F6]">Lens Width</p>
                <p className="text-xs text-muted-foreground">The horizontal width of each lens</p>
              </div>

              <div className="bg-muted p-2 rounded">
                <p className="font-medium text-[#10B981]">Bridge Width</p>
                <p className="text-xs text-muted-foreground">The distance between the lenses</p>
              </div>

              <div className="bg-muted p-2 rounded">
                <p className="font-medium text-[#F59E0B]">Temple Length</p>
                <p className="text-xs text-muted-foreground">The length of the arms that extend to your ears</p>
              </div>

              <div className="bg-muted p-2 rounded">
                <p className="font-medium text-[#EC4899]">Total Width</p>
                <p className="text-xs text-muted-foreground">The entire width of the frame from temple to temple</p>
              </div>
            </div>

            <p className="mt-2">
              <span className="font-medium">Size Categories:</span>
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <span className="text-blue-500 font-medium">Small</span>: Total width less than 130mm
              </li>
              <li>
                <span className="text-green-500 font-medium">Medium</span>: Total width between 130-140mm
              </li>
              <li>
                <span className="text-amber-500 font-medium">Large</span>: Total width greater than 140mm
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
