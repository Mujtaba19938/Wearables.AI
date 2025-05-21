"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Define face shape descriptions and recommendations
const faceShapeData = {
  Oval: {
    description: "You have an oval face shape, characterized by balanced proportions and a gently rounded jawline.",
    frames: ["Rectangle", "Square", "Aviator"],
    colors: ["Tortoise", "Brown", "Gold"],
    measurements: { width: "14.2 cm", height: "20.8 cm" },
  },
  Round: {
    description: "You have a round face shape, characterized by soft curves and similar width and length dimensions.",
    frames: ["Rectangle", "Square", "Wayfarer"],
    colors: ["Black", "Blue", "Tortoise"],
    measurements: { width: "15.0 cm", height: "15.5 cm" },
  },
  Square: {
    description:
      "You have a square face shape, characterized by a strong jawline and forehead with similar width dimensions.",
    frames: ["Round", "Oval", "Rimless"],
    colors: ["Burgundy", "Brown", "Gray"],
    measurements: { width: "14.8 cm", height: "16.2 cm" },
  },
  Heart: {
    description: "You have a heart-shaped face, characterized by a wider forehead that narrows down to a pointed chin.",
    frames: ["Oval", "Light Rimmed", "Cat-Eye"],
    colors: ["Light Brown", "Transparent", "Rose Gold"],
    measurements: { width: "14.5 cm", height: "19.5 cm" },
  },
  Diamond: {
    description: "You have a diamond face shape, characterized by a narrow forehead and jawline with wider cheekbones.",
    frames: ["Cat-Eye", "Oval", "Rimless"],
    colors: ["Purple", "Blue", "Black"],
    measurements: { width: "13.8 cm", height: "20.2 cm" },
  },
  Rectangle: {
    description:
      "You have a rectangular face shape, characterized by a longer face with a forehead, cheekbones, and jawline of similar width.",
    frames: ["Round", "Square", "Oversized"],
    colors: ["Dark Brown", "Green", "Tortoise"],
    measurements: { width: "13.5 cm", height: "22.0 cm" },
  },
  Triangle: {
    description:
      "You have a triangular face shape, characterized by a wider jawline that narrows towards the forehead.",
    frames: ["Cat-Eye", "Browline", "Decorative Temples"],
    colors: ["Black", "Navy", "Crystal"],
    measurements: { width: "15.2 cm", height: "19.0 cm" },
  },
}

// Define background colors for face shape display
const faceShapeColors = {
  Oval: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  Round: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  Square: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  Heart: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  Diamond: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  Rectangle: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  Triangle: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
}

export default function ResultsPageSimplified() {
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const analysisType = searchParams.get("type") || "simple"
  const faceShape = searchParams.get("faceShape") || "Oval"

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

  // Get data for the detected face shape
  const shapeData = faceShapeData[faceShape as keyof typeof faceShapeData] || faceShapeData.Oval
  const shapeColor = faceShapeColors[faceShape as keyof typeof faceShapeColors] || faceShapeColors.Oval

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
          <div className={`w-32 h-32 ${shapeColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <span className="text-2xl font-bold">{faceShape}</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Your Face Shape: {faceShape}</h2>
          <p className="text-gray-600 dark:text-gray-400">{shapeData.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Recommended Frame Styles</h3>
          <div className="grid grid-cols-3 gap-3">
            {shapeData.frames.map((style) => (
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
                <p className="text-lg font-semibold">{shapeData.measurements.width}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Face Height</p>
                <p className="text-lg font-semibold">{shapeData.measurements.height}</p>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-3">Color Recommendations</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {shapeData.colors.map((color) => (
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
