"use client"

import { useState } from "react"
import { FrameMeasurementsDisplay, type FrameMeasurements } from "./frame-measurements-display"
import { UICard, UICardContent } from "./ui-card"
import { Info } from "lucide-react"

interface FrameDetailsMeasurementsProps {
  measurements: FrameMeasurements
  className?: string
}

export function FrameDetailsMeasurements({ measurements, className = "" }: FrameDetailsMeasurementsProps) {
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  return (
    <UICard className={className}>
      <UICardContent>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Frame Measurements</h3>
          <button
            onClick={() => setShowSizeGuide(!showSizeGuide)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Info className="w-4 h-4" />
            {showSizeGuide ? "Hide" : "Show"} Size Guide
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[120px]">
            <div className="text-sm text-muted-foreground">Frame Size</div>
            <div className="text-lg font-medium">
              {measurements.lensWidth}-{measurements.bridgeWidth}-{measurements.templeLength}
            </div>
          </div>

          <div className="flex-1 min-w-[120px]">
            <div className="text-sm text-muted-foreground">Lens Width</div>
            <div className="text-lg font-medium">{measurements.lensWidth}mm</div>
          </div>

          <div className="flex-1 min-w-[120px]">
            <div className="text-sm text-muted-foreground">Bridge Width</div>
            <div className="text-lg font-medium">{measurements.bridgeWidth}mm</div>
          </div>

          <div className="flex-1 min-w-[120px]">
            <div className="text-sm text-muted-foreground">Temple Length</div>
            <div className="text-lg font-medium">{measurements.templeLength}mm</div>
          </div>
        </div>

        {showSizeGuide && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">How to Read Frame Measurements</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Frame measurements are typically displayed as three numbers separated by dashes, like 52-18-140.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div className="p-3 bg-background rounded-md">
                <div className="text-sm font-medium">First Number</div>
                <div className="text-xs text-muted-foreground">Lens Width</div>
                <div className="text-sm mt-1">The horizontal width of each lens in millimeters.</div>
              </div>

              <div className="p-3 bg-background rounded-md">
                <div className="text-sm font-medium">Second Number</div>
                <div className="text-xs text-muted-foreground">Bridge Width</div>
                <div className="text-sm mt-1">The distance between the lenses in millimeters.</div>
              </div>

              <div className="p-3 bg-background rounded-md">
                <div className="text-sm font-medium">Third Number</div>
                <div className="text-xs text-muted-foreground">Temple Length</div>
                <div className="text-sm mt-1">The length of the temple arms in millimeters.</div>
              </div>
            </div>

            <h4 className="font-medium mb-2">Size Guide</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-background rounded-md">
                <div className="text-sm font-medium">Small</div>
                <div className="text-xs text-muted-foreground">Lens Width: 46-49mm</div>
                <div className="text-xs text-muted-foreground">Bridge: 14-18mm</div>
              </div>

              <div className="p-3 bg-background rounded-md">
                <div className="text-sm font-medium">Medium</div>
                <div className="text-xs text-muted-foreground">Lens Width: 50-53mm</div>
                <div className="text-xs text-muted-foreground">Bridge: 18-21mm</div>
              </div>

              <div className="p-3 bg-background rounded-md">
                <div className="text-sm font-medium">Large</div>
                <div className="text-xs text-muted-foreground">Lens Width: 54-58mm</div>
                <div className="text-xs text-muted-foreground">Bridge: 20-24mm</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <FrameMeasurementsDisplay measurements={measurements} />
        </div>
      </UICardContent>
    </UICard>
  )
}
