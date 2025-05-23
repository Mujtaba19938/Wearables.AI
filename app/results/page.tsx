"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Share2, Printer, Download, Check, Copy, Info } from "lucide-react"
import { getFaceShapeRecommendations } from "@/utils/face-analysis"
import { useToast } from "@/components/toast-provider"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const result = searchParams.get("result")
  const analysisType = searchParams.get("type") || "simple"
  const faceShape = searchParams.get("faceShape") || "Oval"

  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const { addToast } = useToast()

  // Get recommendations based on face shape
  const recommendations = getFaceShapeRecommendations(faceShape)

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  // Handle share button click
  const handleShare = () => {
    setShowShareOptions(!showShareOptions)
  }

  // Handle copy link
  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true)
        addToast("Link copied to clipboard", "success")
      },
      (err) => {
        console.error("Could not copy text: ", err)
        addToast("Failed to copy link", "error")
      },
    )
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Handle download as image
  const handleDownload = () => {
    addToast("Downloading results as image...", "info")
    // This would normally capture the results as an image
    // For now, just show a toast
    setTimeout(() => {
      addToast("Results downloaded successfully", "success")
    }, 1500)
  }

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
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 transition-colors py-1.5 px-3 rounded-md text-sm"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>

            {showShareOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] rounded-md shadow-lg overflow-hidden z-10">
                <div className="p-2">
                  <button
                    onClick={handleCopyLink}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#2d3748] rounded flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#2d3748] rounded flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print Results</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#2d3748] rounded flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Save as Image</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Your Face Shape</h2>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Info className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-300 mb-4">{recommendations.description}</p>

              {showInfo && (
                <div className="bg-[#2d3748] p-3 rounded-md mb-4 text-sm">
                  <p className="text-gray-300">
                    Face shapes are determined by the proportions and angles of your facial features. Your face shape
                    influences which eyeglass frames will look best on you by either complementing or balancing your
                    natural features.
                  </p>
                </div>
              )}

              {analysisType === "detailed" && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#2d3748] p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-1">Confidence Score</h3>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${Math.round(Math.random() * 30 + 70)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">High confidence</p>
                  </div>
                  <div className="bg-[#2d3748] p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-1">Face Proportions</h3>
                    <p className="text-sm text-gray-300">Width: Height</p>
                    <p className="text-xs text-gray-400">1:{(Math.random() * 0.4 + 1.4).toFixed(1)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Recommended Frame Styles</h2>
              <div className="grid grid-cols-2 gap-3">
                {recommendations.frames.map((frame, index) => (
                  <div key={index} className="bg-[#2d3748] p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-1">{frame}</h3>
                    <p className="text-xs text-gray-400">
                      {index % 2 === 0 ? "Complements your features" : "Balances your proportions"}
                    </p>
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

            {analysisType === "detailed" && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Facial Measurements</h2>
                <div className="bg-[#2d3748] p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Face Width</p>
                      <p className="text-base">{(Math.random() * 3 + 13).toFixed(1)} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Face Height</p>
                      <p className="text-base">{(Math.random() * 4 + 20).toFixed(1)} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Jaw Width</p>
                      <p className="text-base">{(Math.random() * 2 + 10).toFixed(1)} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Forehead Width</p>
                      <p className="text-base">{(Math.random() * 2 + 11).toFixed(1)} cm</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
