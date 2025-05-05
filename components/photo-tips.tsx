"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Info, Check } from "lucide-react"

export function PhotoTips() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-[#0f1117] p-4 rounded-xl border border-[#1a1c25] mb-4">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-base font-medium">Tips for accurate face analysis</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">Remove glasses, hats, or masks that might obstruct your face</p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">Ensure your face is well-lit with even lighting</p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">Pull back hair to reveal your entire face shape and jawline</p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">Look directly at the camera with a neutral expression</p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">Position your face in the center of the frame</p>
          </div>
        </div>
      )}
    </div>
  )
}
