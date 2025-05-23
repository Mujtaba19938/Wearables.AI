"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getFaceShapeRecommendations } from "@/utils/face-analysis"

export default function SimplifiedResultsPage() {
  const searchParams = useSearchParams()
  const result = searchParams.get("result")
  const faceShape = searchParams.get("faceShape") || "Oval"

  // Get recommendations based on face shape
  const recommendations = getFaceShapeRecommendations(faceShape)

  // If no result parameter, show error
  if (!result) {
    return (
      <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">No Analysis Results</h1>
          <p className="text-gray-400 mb-6">
            No face analysis results were found. Please complete a face analysis first.
          </p>
          <Link
            href="/analyzer"
            className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Face Analyzer
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </div>

        <div className="bg-[#1e293b] rounded-lg overflow-hidden mb-6">
          <div className="bg-blue-600 p-4">
            <h1 className="text-xl font-bold text-center">Face Shape Analysis Results</h1>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full bg-blue-500/20 border-4 border-blue-500 flex items-center justify-center">
                <span className="text-2xl font-bold">{faceShape}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Your Face Shape</h2>
              <p className="text-gray-300 mb-4">{recommendations.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Recommended Frame Styles</h2>
              <div className="grid grid-cols-2 gap-3">
                {recommendations.frames.map((frame, index) => (
                  <div key={index} className="bg-[#2d3748] p-3 rounded-md">
                    <h3 className="text-sm font-medium">{frame}</h3>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Recommended Colors</h2>
              <div className="flex flex-wrap gap-2">
                {recommendations.colors.map((color, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#2d3748] text-sm rounded-full text-gray-300 border border-gray-600"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Frames to Avoid</h2>
              <ul className="list-disc pl-5 text-gray-300 space-y-1">
                {recommendations.avoid.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/frames"
                className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition-colors"
              >
                Browse Recommended Frames
              </Link>
              <Link
                href="/analyzer"
                className="w-full py-2.5 px-4 bg-[#2d3748] text-white rounded-md text-center hover:bg-[#374151] transition-colors"
              >
                Try Another Analysis
              </Link>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          <strong className="text-gray-400">Privacy:</strong> Your analysis results are stored locally on your device
          and are not shared with any third parties.
        </p>
      </div>
    </main>
  )
}
