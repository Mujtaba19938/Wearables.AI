"use client"
import { Check } from "lucide-react"

export type AnalysisMode = "simple" | "extensive"

interface AnalysisModeProps {
  selectedMode: AnalysisMode
  onChange: (mode: AnalysisMode) => void
}

export function AnalysisModeSelector({ selectedMode, onChange }: AnalysisModeProps) {
  return (
    <div className="w-full mb-4">
      <p className="text-sm text-gray-400 mb-2">Analysis Detail Level:</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onChange("simple")}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            selectedMode === "simple" ? "bg-secondary border-primary" : "bg-muted border-border hover:bg-card"
          } transition-colors`}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium">Simple</span>
            <span className="text-xs text-muted-foreground">Face shape & recommendations</span>
          </div>
          {selectedMode === "simple" && <Check className="w-4 h-4 text-primary" />}
        </button>

        <button
          onClick={() => onChange("extensive")}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            selectedMode === "extensive" ? "bg-secondary border-primary" : "bg-muted border-border hover:bg-card"
          } transition-colors`}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium">Extensive</span>
            <span className="text-xs text-muted-foreground">Detailed measurements & analysis</span>
          </div>
          {selectedMode === "extensive" && <Check className="w-4 h-4 text-primary" />}
        </button>
      </div>
    </div>
  )
}
