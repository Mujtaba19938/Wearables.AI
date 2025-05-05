"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Ruler } from "lucide-react"

interface FacialMeasurementsCardProps {
  measurements: {
    faceWidth: number
    faceHeight: number
    foreheadWidth: number
    cheekboneWidth: number
    jawWidth: number
    chinWidth: number
    widthToHeightRatio: number
    foreheadToJawRatio: number
    cheekboneToJawRatio: number
    jawToFaceWidthRatio: number
    chinToJawRatio: number
    jawAngularity: number
    [key: string]: number
  }
}

export function FacialMeasurementsCard({ measurements }: FacialMeasurementsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Format the measurements for display
  const formatMeasurement = (value: number) => {
    // For ratios, show 2 decimal places
    if (value < 10) return value.toFixed(2)
    // For pixel measurements, round to nearest integer
    return Math.round(value)
  }

  return (
    <div className="bg-card p-4 sm:p-6 rounded-xl border border-border mb-4 sm:mb-6">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-lg sm:text-xl font-bold">Detailed Facial Measurements</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Face Width</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.faceWidth)} px</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Face Height</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.faceHeight)} px</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Width/Height Ratio</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.widthToHeightRatio)}</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Forehead Width</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.foreheadWidth)} px</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Cheekbone Width</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.cheekboneWidth)} px</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Jaw Width</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.jawWidth)} px</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Chin Width</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.chinWidth)} px</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Forehead/Jaw Ratio</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.foreheadToJawRatio)}</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Cheekbone/Jaw Ratio</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.cheekboneToJawRatio)}</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Jaw/Face Width Ratio</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.jawToFaceWidthRatio)}</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Chin/Jaw Ratio</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.chinToJawRatio)}</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Jaw Angularity</p>
            <p className="text-lg font-medium">{formatMeasurement(measurements.jawAngularity)}°</p>
          </div>
        </div>
      )}
    </div>
  )
}
