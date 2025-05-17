"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ResultsPageSimplified() {
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const analysisType = searchParams.get("type") || "simple"

  useEffect(() => {
    // Check if we have a result parameter, if not redirect to analyzer
    if (!searchParams.get("result")) {
      router.push("/analyzer")
      return
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Analyzing your results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-6">
        <Link
          href="/analyzer"
          className="mr-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Your Face Analysis Results</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-center mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              analysisType === "detailed"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            }`}
          >
            {analysisType === "detailed" ? "Detailed Analysis" : "Simple Analysis"}
          </span>
        </div>

        <div className="text-center mb-6">
          <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Oval</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Your Face Shape: Oval</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You have an oval face shape, characterized by balanced proportions and a gently rounded jawline.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Recommended Frame Styles</h3>
          <div className="grid grid-cols-3 gap-3">
            {["Rectangle", "Square", "Aviator"].map((style) => (
              <div key={style} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                <p className="font-medium">{style}</p>
              </div>
            ))}
          </div>
        </div>

        {analysisType === "detailed" && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-medium mb-3">Detailed Measurements</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Face Width</p>
                <p className="text-lg font-semibold">14.2 cm</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Face Height</p>
                <p className="text-lg font-semibold">20.8 cm</p>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-3">Color Recommendations</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Tortoise", "Brown", "Gold"].map((color) => (
                <span key={color} className="px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full text-sm">
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Link
          href="/frames"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Recommended Frames
        </Link>
      </div>
    </div>
  )
}
