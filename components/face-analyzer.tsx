"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, ShieldCheck, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as faceapi from "face-api.js"
import { isCachingSupported, registerServiceWorker, areModelsCached, updateCachedModels } from "@/utils/model-cache"
import { useMobile } from "@/hooks/use-mobile"

interface FaceAnalyzerProps {
  onAnalysisComplete: (shape: string) => void
  setIsAnalyzing: (analyzing: boolean) => void
  uploadMode: boolean
  setModelsLoading: (loading: boolean) => void
}

export default function FaceAnalyzer({
  onAnalysisComplete,
  setIsAnalyzing,
  uploadMode,
  setModelsLoading,
}: FaceAnalyzerProps) {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const isMobile = useMobile()

  const [cameraReady, setCameraReady] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [modelLoadingAttempts, setModelLoadingAttempts] = useState(0)
  const [cachingSupported, setCachingSupported] = useState(false)
  const [modelsAreCached, setModelsAreCached] = useState(false)
  const [isUpdatingCache, setIsUpdatingCache] = useState(false)

  // Initialize service worker for caching
  useEffect(() => {
    const initCaching = async () => {
      const supported = isCachingSupported()
      setCachingSupported(supported)

      if (supported) {
        await registerServiceWorker()
        const cached = await areModelsCached()
        setModelsAreCached(cached)

        if (cached) {
          console.log("Models are already cached")
        }
      }
    }

    initCaching()
  }, [])

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      setModelsLoading(true)
      setProgress(10)

      try {
        // Check if models are cached
        if (cachingSupported) {
          const cached = await areModelsCached()
          setModelsAreCached(cached)
          if (cached) {
            setProgress(30)
            console.log("Loading models from cache")
          } else {
            console.log("Models not cached, loading from network")
          }
        }

        // Load models from CDN (service worker will intercept if cached)
        const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models"

        // Load models in sequence to ensure proper loading
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        setProgress(50)

        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        setProgress(75)

        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        setProgress(100)

        // Verify models are loaded
        if (
          faceapi.nets.tinyFaceDetector.isLoaded &&
          faceapi.nets.faceLandmark68Net.isLoaded &&
          faceapi.nets.faceRecognitionNet.isLoaded
        ) {
          console.log("All models loaded successfully")
          setModelsLoaded(true)
          setModelsLoading(false)
        } else {
          throw new Error("Models did not load correctly")
        }
      } catch (err) {
        console.error("Error loading models:", err)
        setError("Failed to load face detection models. Please check your internet connection and try again.")

        // Reset progress to indicate failure
        setProgress(0)
        setModelsLoading(false)

        // Retry loading if under 3 attempts
        if (modelLoadingAttempts < 3) {
          setModelLoadingAttempts((prev) => prev + 1)
          setTimeout(() => {
            loadModels()
          }, 2000) // Wait 2 seconds before retrying
        }
      }
    }

    loadModels()
  }, [modelLoadingAttempts, cachingSupported])

  // Function to force update cached models
  const handleUpdateModels = async () => {
    setIsUpdatingCache(true)
    setError(null)

    try {
      await updateCachedModels()
      setModelsAreCached(false)
      setModelLoadingAttempts(modelLoadingAttempts + 1) // Trigger reload
    } catch (err) {
      setError("Failed to update cached models. Please try again.")
    } finally {
      setIsUpdatingCache(false)
    }
  }

  const handleCapture = async () => {
    if (!modelsLoaded) {
      setError("Face detection models are not fully loaded yet. Please wait and try again.")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      let imageElement: HTMLImageElement | HTMLVideoElement | null = null

      if (uploadMode && imageRef.current) {
        imageElement = imageRef.current
      } else if (!uploadMode && webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot()
        if (!imageSrc) {
          throw new Error("Failed to capture image from camera")
        }

        // Create a temporary image to analyze
        const tempImage = new Image()
        tempImage.src = imageSrc
        await new Promise((resolve) => {
          tempImage.onload = resolve
        })
        imageElement = tempImage
      } else {
        throw new Error("No image source available")
      }

      if (!imageElement) {
        throw new Error("Failed to prepare image for analysis")
      }

      // Verify TinyFaceDetector is loaded before using it
      if (!faceapi.nets.tinyFaceDetector.isLoaded) {
        throw new Error("Face detection model is not loaded. Please refresh the page and try again.")
      }

      // Detect face
      const detections = await faceapi
        .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()

      if (!detections) {
        throw new Error(
          "Please remove any glasses, caps, or obstructions from the view. Ensure you are in good lighting and your face is clearly visible.",
        )
      }

      // Analyze face shape based on landmarks
      const faceShape = analyzeFaceShape(detections.landmarks)

      // Pass the result to parent component
      onAnalysisComplete(faceShape)
    } catch (err: any) {
      console.error("Analysis error:", err)
      setError(err.message || "An error occurred during analysis. Please try again.")
      setIsAnalyzing(false)
    }
  }

  const analyzeFaceShape = (landmarks: faceapi.FaceLandmarks68) => {
    // Get key points from landmarks
    const jawPoints = landmarks.getJawOutline()
    const faceWidth = Math.abs(jawPoints[16].x - jawPoints[0].x)
    const jawWidth = Math.abs(jawPoints[14].x - jawPoints[2].x)
    const cheekWidth = Math.abs(jawPoints[12].x - jawPoints[4].x)
    const faceHeight = landmarks.positions[8].y - landmarks.positions[27].y
    const foreheadHeight = landmarks.positions[27].y - jawPoints[0].y
    const chinHeight = landmarks.positions[8].y - landmarks.positions[57].y

    // Calculate ratios
    const widthToHeightRatio = faceWidth / faceHeight
    const jawToFaceWidthRatio = jawWidth / faceWidth
    const cheekToJawRatio = cheekWidth / jawWidth
    const foreheadToChinRatio = foreheadHeight / chinHeight

    // Determine face shape based on ratios
    if (widthToHeightRatio > 0.85 && jawToFaceWidthRatio > 0.78) {
      return "Round"
    } else if (widthToHeightRatio < 0.75 && jawToFaceWidthRatio < 0.7) {
      return "Oval"
    } else if (jawToFaceWidthRatio > 0.85 && cheekToJawRatio < 1.1) {
      return "Square"
    } else if (cheekToJawRatio > 1.15 && foreheadToChinRatio < 0.9) {
      return "Heart"
    } else if (jawToFaceWidthRatio < 0.8 && cheekToJawRatio > 1.05) {
      return "Diamond"
    } else {
      return "Oval" // Default to oval if no clear match
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Get optimal camera constraints based on device
  const getVideoConstraints = () => {
    if (isMobile) {
      return {
        facingMode: "user",
        width: { ideal: 480 },
        height: { ideal: 480 },
      }
    } else {
      return {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 640 },
      }
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {!modelsLoaded ? (
        <div className="w-full text-center py-4 sm:py-8">
          <p className="mb-4 text-sm sm:text-base">Loading face detection models... {progress}%</p>
          <Progress value={progress} className="w-full max-w-md mx-auto" />

          {modelsAreCached && (
            <p className="mt-2 text-xs sm:text-sm text-green-600 dark:text-green-400">
              Using cached models for faster loading
            </p>
          )}

          {modelLoadingAttempts > 0 && (
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Loading attempt {modelLoadingAttempts + 1}/4...
            </p>
          )}

          {cachingSupported && modelsAreCached && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={handleUpdateModels} disabled={isUpdatingCache}>
                {isUpdatingCache ? (
                  <>
                    <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span className="text-xs sm:text-sm">Updating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Update Cached Models</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <Alert className="mb-4 sm:mb-6 bg-primary/10 border-primary/20 text-xs sm:text-sm">
            <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <AlertDescription className="text-primary font-medium">
              Faces or facial features data/images are not stored in any way and we do not sell your privacy.
            </AlertDescription>
          </Alert>

          {cachingSupported && (
            <Alert className="mb-4 sm:mb-6 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-xs sm:text-sm">
              <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-600 dark:text-green-400 font-medium">
                Models are {modelsAreCached ? "cached for offline use" : "being cached for future offline use"}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4 text-xs sm:text-sm">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploadMode ? (
            <div className="w-full flex flex-col items-center">
              <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

              {uploadedImage ? (
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square mb-4">
                  <img
                    ref={imageRef}
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded"
                    className="w-full h-full object-contain rounded-lg"
                    onLoad={() => {
                      // Ensure image is fully loaded
                      console.log("Image loaded successfully")
                    }}
                  />
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square flex flex-col items-center justify-center cursor-pointer mb-4"
                  onClick={triggerFileUpload}
                >
                  <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm sm:text-base">Tap to upload an image</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    For best results, use a well-lit front-facing photo
                  </p>
                </div>
              )}

              <Button
                onClick={handleCapture}
                disabled={!uploadedImage || !modelsLoaded}
                className="mt-4 w-full max-w-xs sm:max-w-sm md:max-w-md"
                size={isMobile ? "default" : "lg"}
              >
                Analyze Face Shape
              </Button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square mb-4 bg-black rounded-lg overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={getVideoConstraints()}
                  onUserMedia={() => setCameraReady(true)}
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
              </div>

              <Button
                onClick={handleCapture}
                disabled={!cameraReady || !modelsLoaded}
                className="mt-4 w-full max-w-xs sm:max-w-sm md:max-w-md"
                size={isMobile ? "default" : "lg"}
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture & Analyze
              </Button>

              {isMobile && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Hold your phone steady and ensure your face is well-lit
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
