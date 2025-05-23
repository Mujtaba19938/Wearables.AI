import { getFaceShapeRecommendations } from "@/utils/face-analysis"

interface ResultCardProps {
  faceShape: string
  confidence?: number
  analysisType?: "simple" | "detailed"
}

export function ResultCard({ faceShape, confidence = 0.85, analysisType = "simple" }: ResultCardProps) {
  // Get recommendations based on face shape
  const recommendations = getFaceShapeRecommendations(faceShape)

  return (
    <div className="bg-[#1e293b] rounded-lg overflow-hidden">
      <div className="bg-blue-600 p-3">
        <h2 className="text-lg font-bold text-center text-white">Face Shape Analysis</h2>
      </div>
      <div className="p-4">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-blue-500/20 border-3 border-blue-500 flex items-center justify-center">
            <span className="text-xl font-bold text-white">{faceShape}</span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-md font-semibold text-white mb-1">Your Face Shape</h3>
          <p className="text-sm text-gray-300 mb-2">{recommendations.description}</p>

          {analysisType === "detailed" && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-white mb-1">Confidence Score</h4>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.round(confidence * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {confidence > 0.8 ? "High confidence" : confidence > 0.6 ? "Medium confidence" : "Low confidence"}
              </p>
            </div>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-md font-semibold text-white mb-2">Recommended Frames</h3>
          <div className="grid grid-cols-2 gap-2">
            {recommendations.frames.slice(0, 4).map((frame, index) => (
              <div key={index} className="bg-[#2d3748] p-2 rounded-md">
                <h4 className="text-sm font-medium text-white">{frame}</h4>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-md font-semibold text-white mb-2">Recommended Colors</h3>
          <div className="flex flex-wrap gap-1.5">
            {recommendations.colors.map((color, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-[#2d3748] text-xs rounded-full text-gray-300 border border-gray-600"
              >
                {color}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold text-white mb-1">Frames to Avoid</h3>
          <ul className="list-disc pl-4 text-sm text-gray-300 space-y-0.5">
            {recommendations.avoid.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
