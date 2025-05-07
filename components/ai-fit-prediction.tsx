"use client"

import { useState } from "react"
import { Brain, ChevronDown, ChevronUp, Check, AlertTriangle, Info } from "lucide-react"
import type { FrameMeasurements } from "./frame-measurements-display"
import type { FaceMeasurements, FitPredictionResult } from "@/utils/fit-prediction"
import { predictFrameFit } from "@/utils/fit-prediction"

interface AiFitPredictionProps {
  frameMeasurements: FrameMeasurements
  faceMeasurements: FaceMeasurements
  frameShape: string
  frameName: string
}

export function AiFitPrediction({ frameMeasurements, faceMeasurements, frameShape, frameName }: AiFitPredictionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Generate the fit prediction
  const fitPrediction: FitPredictionResult = predictFrameFit(faceMeasurements, frameMeasurements, frameShape)

  // Determine the overall fit status
  const getOverallFitStatus = () => {
    const score = fitPrediction.overallScore
    if (score >= 90) return { label: "Excellent Fit", color: "text-green-500" }
    if (score >= 80) return { label: "Good Fit", color: "text-blue-500" }
    if (score >= 70) return { label: "Acceptable Fit", color: "text-yellow-500" }
    return { label: "Poor Fit", color: "text-red-500" }
  }

  const overallStatus = getOverallFitStatus()

  // Get color for individual scores
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-blue-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  // Get icon for individual fit status
  const getStatusIcon = (status: string) => {
    if (status.includes("good") || status.includes("excellent")) {
      return <Check className="w-4 h-4 text-green-500" />
    }
    if (status.includes("acceptable")) {
      return <Info className="w-4 h-4 text-blue-500" />
    }
    return <AlertTriangle className="w-4 h-4 text-yellow-500" />
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">AI Fit Prediction</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className={`font-medium ${overallStatus.color}`}>{overallStatus.label}</span>
            <span className="text-sm text-muted-foreground">({fitPrediction.overallScore}%)</span>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-border">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Our AI has analyzed your face measurements and compared them with the {frameName} frame dimensions to
              predict how well they'll fit together.
            </p>

            {/* Fit score visualization */}
            <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-1">
              <div
                className={`absolute top-0 left-0 h-full rounded-full ${
                  fitPrediction.overallScore >= 90
                    ? "bg-green-500"
                    : fitPrediction.overallScore >= 80
                      ? "bg-blue-500"
                      : fitPrediction.overallScore >= 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                }`}
                style={{ width: `${fitPrediction.overallScore}%` }}
              ></div>
            </div>

            {/* Primary recommendation */}
            <div className="bg-muted p-3 rounded-lg mt-3">
              <p className="text-sm">
                <span className="font-medium">AI Recommendation:</span> {fitPrediction.recommendations[0]}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-primary text-sm mb-3"
          >
            {showDetails ? "Hide" : "Show"} detailed fit analysis
            <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
          </button>

          {showDetails && (
            <div className="space-y-3 mt-4">
              {/* Width fit */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(fitPrediction.widthFit.status)}
                    <span className="font-medium">Width Fit</span>
                  </div>
                  <span className={`font-medium ${getScoreColor(fitPrediction.widthFit.score)}`}>
                    {fitPrediction.widthFit.score}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{fitPrediction.widthFit.message}</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Your face: ~{Math.round(faceMeasurements.templeToTempleDistance)}mm</span>
                  <span>Frame: {frameMeasurements.totalWidth}mm</span>
                </div>
              </div>

              {/* Height fit */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(fitPrediction.heightFit.status)}
                    <span className="font-medium">Height Fit</span>
                  </div>
                  <span className={`font-medium ${getScoreColor(fitPrediction.heightFit.score)}`}>
                    {fitPrediction.heightFit.score}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{fitPrediction.heightFit.message}</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Ideal lens height: ~{Math.round(faceMeasurements.faceHeight * 0.3)}mm</span>
                  <span>Frame: {frameMeasurements.lensHeight}mm</span>
                </div>
              </div>

              {/* Bridge fit */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(fitPrediction.bridgeFit.status)}
                    <span className="font-medium">Bridge Fit</span>
                  </div>
                  <span className={`font-medium ${getScoreColor(fitPrediction.bridgeFit.score)}`}>
                    {fitPrediction.bridgeFit.score}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{fitPrediction.bridgeFit.message}</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Your nose bridge: ~{faceMeasurements.noseBridgeWidth}mm</span>
                  <span>Frame: {frameMeasurements.bridgeWidth}mm</span>
                </div>
              </div>

              {/* Style fit */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(fitPrediction.styleFit.status)}
                    <span className="font-medium">Style Compatibility</span>
                  </div>
                  <span className={`font-medium ${getScoreColor(fitPrediction.styleFit.score)}`}>
                    {fitPrediction.styleFit.score}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{fitPrediction.styleFit.message}</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Your face shape: {faceMeasurements.faceShape}</span>
                  <span>Frame shape: {frameShape}</span>
                </div>
              </div>

              {/* Additional recommendations */}
              {fitPrediction.recommendations.length > 1 && (
                <div className="bg-primary/10 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm">Additional Recommendations</h4>
                  <ul className="space-y-1">
                    {fitPrediction.recommendations.slice(1).map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-1.5">
                        <div className="mt-1 flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
