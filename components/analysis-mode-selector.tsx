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
            selectedMode === "simple"
              ? "bg-[#1a1f36] border-[#3B82F6]"
              : "bg-[#0a0c14] border-[#1a1c25] hover:bg-[#0f1117]"
          } transition-colors`}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium">Simple</span>
            <span className="text-xs text-gray-400">Face shape & recommendations</span>
          </div>
          {selectedMode === "simple" && <Check className="w-4 h-4 text-[#3B82F6]" />}
        </button>

        <button
          onClick={() => onChange("extensive")}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            selectedMode === "extensive"
              ? "bg-[#1a1f36] border-[#3B82F6]"
              : "bg-[#0a0c14] border-[#1a1c25] hover:bg-[#0f1117]"
          } transition-colors`}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium">Extensive</span>
            <span className="text-xs text-gray-400">Detailed measurements & analysis</span>
          </div>
          {selectedMode === "extensive" && <Check className="w-4 h-4 text-[#3B82F6]" />}
        </button>
      </div>
    </div>
  )
}
