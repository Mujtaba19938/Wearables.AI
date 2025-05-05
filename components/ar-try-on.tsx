"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Download, RefreshCw, Share2 } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface ARTryOnProps {
  frame: {
    id: number
    name: string
    image: string
    colors: string[]
    colorImages?: Record<string, string>
  }
}

export default function ARTryOn({ frame }: ARTryOnProps) {
  const [activeTab, setActiveTab] = useState("camera")
  const [cameraReady, setCameraReady] = useState(false)
  const [selectedColor, setSelectedColor] = useState(frame.colors[0])
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(isCapturing)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobile()

  // Initialize camera
  useEffect(() => {
    if (activeTab === "camera") {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          })

          if (videoRef.current) {
            videoRef.current.srcObject = stream
            setCameraReady(true)
          }
        } catch (err) {
          console.error("Error accessing camera:", err)
        }
      }

      startCamera()

      // Cleanup function
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())
        }
      }
    }
  }, [activeTab])

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)

    // Draw the current video frame to the canvas
    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Simulate adding glasses to the image
      // In a real app, this would use face detection and AR
      // For now, we'll just add a simple overlay
      const frameImg = new Image()
      frameImg.crossOrigin = "anonymous"
      // Use the image for the selected color if available
      const frameImageSrc = frame.colorImages?.[selectedColor] || frame.image
      frameImg.src = frameImageSrc

      frameImg.onload = () => {
        // Position the glasses in the middle of the face (simplified)
        const glassesWidth = canvas.width * 0.6
        const glassesHeight = (glassesWidth * frameImg.height) / frameImg.width
        const x = (canvas.width - glassesWidth) / 2
        const y = canvas.height * 0.35 // Approximate eye position

        context.drawImage(frameImg, x, y, glassesWidth, glassesHeight)

        // Convert canvas to image
        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)
        setIsCapturing(false)
      }
    }
  }

  const resetCapture = () => {
    setCapturedImage(null)
  }

  const downloadImage = () => {
    if (!capturedImage) return

    const link = document.createElement("a")
    link.href = capturedImage
    link.download = `${frame.name.toLowerCase().replace(/\s+/g, "-")}-try-on.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareImage = async () => {
    if (!capturedImage || !navigator.share) return

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage)
      const blob = await response.blob()
      const file = new File([blob], `${frame.name}-try-on.png`, { type: "image/png" })

      await navigator.share({
        title: `${frame.name} Virtual Try-On`,
        text: "Check out how these glasses look on me!",
        files: [file],
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle>Try On: {frame.name}</DialogTitle>
      </DialogHeader>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera">Live Camera</TabsTrigger>
            <TabsTrigger value="photo">Sample Photo</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="camera" className="flex-1 flex flex-col mt-0">
          <div className="p-6 flex-1 flex flex-col">
            <div className="relative bg-black rounded-md overflow-hidden flex-1 min-h-[300px]">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ display: cameraReady ? "block" : "none" }}
                  />
                  {!cameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white">Loading camera...</p>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={capturedImage || "/placeholder.svg"}
                    alt="Try-on result"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                {frame.colors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? "border-primary" : "border-transparent"
                    }`}
                    style={{
                      backgroundColor:
                        color.toLowerCase() === "tortoise"
                          ? "#8B4513"
                          : color.toLowerCase() === "clear"
                            ? "#f8f9fa"
                            : color.toLowerCase(),
                    }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {capturedImage ? (
                  <>
                    <Button variant="outline" size="icon" onClick={resetCapture}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={downloadImage}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {navigator.share && (
                      <Button variant="outline" size="icon" onClick={shareImage}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                ) : (
                  <Button onClick={captureImage} disabled={!cameraReady || isCapturing}>
                    <Camera className="h-4 w-4 mr-2" />
                    {isCapturing ? "Processing..." : "Capture"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photo" className="flex-1 mt-0">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden">
                <Image src="/placeholder.svg?height=400&width=300" alt="Model face" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="relative w-[60%] aspect-[3/1]"
                    style={{
                      top: "-5%",
                    }}
                  >
                    <Image
                      src={frame.colorImages?.[selectedColor] || frame.image}
                      alt={frame.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-medium mb-2">{frame.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This is a virtual representation of how these frames might look. For the most accurate experience, try
                  the live camera mode or visit a store for an in-person fitting.
                </p>

                <div className="mt-2 mb-4">
                  <p className="text-sm font-medium mb-2">Available Colors:</p>
                  <div className="flex gap-2">
                    {frame.colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color ? "border-primary" : "border-transparent"
                        }`}
                        style={{
                          backgroundColor:
                            color.toLowerCase() === "tortoise"
                              ? "#8B4513"
                              : color.toLowerCase() === "clear"
                                ? "#f8f9fa"
                                : color.toLowerCase(),
                        }}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <Button className="w-full">View Frame Details</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
