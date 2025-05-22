"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ResultCard from "@/components/result-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Define face shape recommendations
const faceShapeData = {
  oval: {
    title: "Oval Face Shape",
    description: "You have an oval face shape, which is versatile for many frame styles.",
    recommendations: ["Rectangle frames", "Wayfarer styles", "Square frames", "Aviator styles"],
  },
  round: {
    title: "Round Face Shape",
    description: "You have a round face shape with soft curves and full cheeks.",
    recommendations: ["Angular frames", "Rectangle frames", "Square frames", "Geometric shapes"],
  },
  square: {
    title: "Square Face Shape",
    description: "You have a square face shape with a strong jawline and forehead.",
    recommendations: ["Round frames", "Oval frames", "Rimless styles", "Thin frames"],
  },
  heart: {
    title: "Heart Face Shape",
    description: "You have a heart-shaped face with a wider forehead and narrower chin.",
    recommendations: ["Bottom-heavy frames", "Oval frames", "Rimless styles", "Light-colored frames"],
  },
  diamond: {
    title: "Diamond Face Shape",
    description: "You have a diamond face shape with a narrow forehead and jawline.",
    recommendations: ["Oval frames", "Rimless styles", "Cat-eye frames", "Frames with detailing on top"],
  },
  rectangle: {
    title: "Rectangle Face Shape",
    description: "You have a rectangle face shape with a longer face and straight cheek lines.",
    recommendations: ["Round frames", "Square frames with softer edges", "Decorative temples", "Contrasting bridges"],
  },
  triangle: {
    title: "Triangle Face Shape",
    description: "You have a triangle face shape with a wider jawline and narrower forehead.",
    recommendations: ["Frames with heavy detailing on top", "Cat-eye frames", "Browline frames", "Aviator styles"],
  },
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const faceShape = searchParams.get("faceShape") || "oval"
  const analysisType = searchParams.get("analysisType") || "simple"
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const data = faceShapeData[faceShape as keyof typeof faceShapeData] || faceShapeData.oval

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Analyzing your results...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Face Shape Analysis Results</h1>

      <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
        <ResultCard
          result={{
            id: "1",
            title: data.title,
            description: data.description,
            imageUrl: `/placeholder.svg?height=200&width=400&query=${faceShape} face shape illustration`,
            faceShape: faceShape,
            recommendations: data.recommendations,
          }}
        />

        {analysisType === "detailed" && (
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Detailed Measurements</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Face Width Ratio:</span>
                <span className="font-medium">1:{(Math.random() * 0.4 + 1.3).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Jawline Angle:</span>
                <span className="font-medium">{Math.floor(Math.random() * 15 + 75)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Cheekbone Prominence:</span>
                <span className="font-medium">{Math.floor(Math.random() * 30 + 60)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Forehead-to-Chin Ratio:</span>
                <span className="font-medium">1:{(Math.random() * 0.3 + 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Button asChild variant="outline">
            <Link href="/analyzer">Try Again</Link>
          </Button>
          <Button asChild>
            <Link href="/frames">Browse Recommended Frames</Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>This analysis is based on general face shape guidelines.</p>
        <p>For a personalized consultation, visit an optician.</p>
      </div>
    </div>
  )
}
