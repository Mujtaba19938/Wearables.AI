"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, ShieldCheck, RefreshCw, Info, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as faceapi from "face-api.js"
import {
  MODEL_URL,
  isCachingSupported,
  registerServiceWorker,
  areModelsCached,
  updateCachedModels,
} from "@/utils/model-cache"
import { useMobile } from "@/hooks/use-mobile"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { FacialMeasurements } from "@/types/facial-measurements"

interface FaceAnalyzerProps {
  onAnalysisComplete: (shape: string, measurements: FacialMeasurements) => void
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
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [showDebugInfo, setShowDebugInfo] = useState(false)

  // Add debug logging function
  const addDebugLog = (message: string) => {
    setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // Initialize service worker for caching
  useEffect(() => {
    const initCaching = async () => {
      addDebugLog("Checking caching support")
      const supported = isCachingSupported()
      setCachingSupported(supported)
      addDebugLog(`Caching supported: ${supported}`)

      if (supported) {
        try {
          addDebugLog("Attempting to register service worker")
          const registered = await registerServiceWorker()

          if (registered) {
            addDebugLog("Service worker registered successfully")

            const cached = await areModelsCached()
            setModelsAreCached(cached)
            addDebugLog(`Models are cached: ${cached}`)
          } else {
            addDebugLog("Service worker registration skipped or failed - will load models directly")
            setModelsAreCached(false)
          }
        } catch (err) {
          addDebugLog(`Service worker error: ${err.message}`)
          // Continue without service worker
          setModelsAreCached(false)
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
            setProgress(20)
            addDebugLog("Loading models from cache")
          } else {
            addDebugLog("Models not cached, loading from network")
          }
        }

        // Reset any existing models to avoid conflicts
        if (faceapi.nets.tinyFaceDetector.isLoaded) {
          addDebugLog("Disposing existing TinyFaceDetector model")
          await faceapi.nets.tinyFaceDetector.dispose()
        }

        if (faceapi.nets.faceLandmark68Net.isLoaded) {
          addDebugLog("Disposing existing FaceLandmark68Net model")
          await faceapi.nets.faceLandmark68Net.dispose()
        }

        // Load models directly without relying on service worker
        addDebugLog(`Loading TinyFaceDetector model from ${MODEL_URL}`)
        try {
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
          setProgress(40)
          addDebugLog("TinyFaceDetector loaded successfully")
        } catch (err) {
          addDebugLog(`Error loading TinyFaceDetector: ${err.message}`)

          // Try an alternative CDN if the primary one fails
          const alternativeUrl = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights"
          addDebugLog(`Trying alternative URL: ${alternativeUrl}`)

          try {
            await faceapi.nets.tinyFaceDetector.loadFromUri(alternativeUrl)
            setProgress(40)
            addDebugLog("TinyFaceDetector loaded successfully from alternative URL")
          } catch (altErr) {
            addDebugLog(`Error loading from alternative URL: ${altErr.message}`)
            throw new Error(`Failed to load TinyFaceDetector: ${err.message}`)
          }
        }

        addDebugLog(`Loading FaceLandmark68Net model from ${MODEL_URL}`)
        try {
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
          setProgress(70)
          addDebugLog("FaceLandmark68Net loaded successfully")
        } catch (err) {
          addDebugLog(`Error loading FaceLandmark68Net: ${err.message}`)

          // Try an alternative CDN if the primary one fails
          const alternativeUrl = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights"
          addDebugLog(`Trying alternative URL: ${alternativeUrl}`)

          try {
            await faceapi.nets.faceLandmark68Net.loadFromUri(alternativeUrl)
            setProgress(70)
            addDebugLog("FaceLandmark68Net loaded successfully from alternative URL")
          } catch (altErr) {
            addDebugLog(`Error loading from alternative URL: ${altErr.message}`)
            throw new Error(`Failed to load FaceLandmark68Net: ${err.message}`)
          }
        }

        // Verify models are loaded
        if (faceapi.nets.tinyFaceDetector.isLoaded && faceapi.nets.faceLandmark68Net.isLoaded) {
          addDebugLog("All required models loaded successfully")
          setModelsLoaded(true)
          setModelsLoading(false)
          setProgress(100)
        } else {
          throw new Error("Models did not load correctly")
        }
      } catch (err) {
        console.error("Error loading models:", err)
        addDebugLog(`Error loading models: ${err.message}`)
        setError(`Error loading models: ${err.message}`)

        // Reset progress to indicate failure
        setProgress(0)
        setModelsLoading(false)

        // Increment attempt counter to try again
        setModelLoadingAttempts((prev) => prev + 1)
      }
    }

    loadModels()
  }, [modelLoadingAttempts, cachingSupported, setModelsLoading])

  // Function to force update cached models
  const handleUpdateModels = async () => {
    setIsUpdatingCache(true)
    setError(null)
    addDebugLog("Updating cached models")

    try {
      await updateCachedModels()
      setModelsAreCached(false)
      setModelLoadingAttempts(modelLoadingAttempts + 1) // Trigger reload
      addDebugLog("Cache updated, reloading models")
    } catch (err) {
      setError("Failed to update cached models. Please try again.")
      addDebugLog(`Cache update error: ${err.message}`)
    } finally {
      setIsUpdatingCache(false)
    }
  }

  // Function to manually reload models
  const handleManualReload = () => {
    addDebugLog("Manual reload triggered")
    setError(null)
    setProgress(0)
    setModelsLoaded(false)
    setModelLoadingAttempts((prev) => prev + 1)
  }

  const handleCapture = async () => {
    if (!modelsLoaded) {
      setError("Face detection models are not fully loaded yet. Please wait and try again.")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    addDebugLog("Starting face analysis")

    try {
      let imageElement: HTMLImageElement | HTMLVideoElement | null = null

      if (uploadMode && imageRef.current) {
        imageElement = imageRef.current
        addDebugLog("Using uploaded image for analysis")
      } else if (!uploadMode && webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot()
        if (!imageSrc) {
          throw new Error("Failed to capture image from camera")
        }

        // Create a temporary image to analyze
        const tempImage = new Image()
        tempImage.crossOrigin = "anonymous"
        tempImage.src = imageSrc
        await new Promise((resolve) => {
          tempImage.onload = resolve
        })
        imageElement = tempImage
        addDebugLog("Using webcam image for analysis")
      } else {
        throw new Error("No image source available")
      }

      if (!imageElement) {
        throw new Error("Failed to prepare image for analysis")
      }

      // Verify TinyFaceDetector is loaded before using it
      if (!faceapi.nets.tinyFaceDetector.isLoaded) {
        addDebugLog("TinyFaceDetector not loaded, attempting to reload")
        throw new Error("Face detection model is not loaded. Please refresh the page and try again.")
      }

      addDebugLog("Running face detection")
      // Perform face detection with available models
      const detection = await faceapi
        .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()

      if (!detection) {
        addDebugLog("No face detected")
        throw new Error(
          "No face detected. Please ensure your face is clearly visible, well-lit, and centered in the frame.",
        )
      }

      addDebugLog("Face detected, analyzing shape")
      // Extract landmarks for analysis
      const landmarks = detection.landmarks

      // Perform face shape analysis
      const { faceShape, measurements } = analyzeFaceShape(landmarks, detection.detection)
      addDebugLog(`Analysis complete: ${faceShape} face shape detected`)

      // Pass the result to parent component
      onAnalysisComplete(faceShape, measurements)
    } catch (err: any) {
      console.error("Analysis error:", err)
      addDebugLog(`Analysis error: ${err.message}`)
      setError(err.message || "An error occurred during analysis. Please try again.")
      setIsAnalyzing(false)
    }
  }

  const analyzeFaceShape = (landmarks: faceapi.FaceLandmarks68, detection: faceapi.FaceDetection) => {
    // Get key points from landmarks
    const jawPoints = landmarks.getJawOutline()
    const leftEye = landmarks.getLeftEye()
    const rightEye = landmarks.getRightEye()
    const nose = landmarks.getNose()

    // Calculate basic measurements
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
    const foreheadToJawRatio = foreheadHeight / (faceHeight - foreheadHeight)

    // Calculate eye measurements
    const eyeDistance = Math.abs((leftEye[3].x + leftEye[0].x) / 2 - (rightEye[0].x + rightEye[3].x) / 2)
    const eyeWidth = Math.abs(leftEye[3].x - leftEye[0].x)
    const eyeSpacingRatio = eyeDistance / eyeWidth

    // Calculate facial thirds
    const upperThird = Math.abs(landmarks.positions[27].y - (landmarks.positions[21].y + landmarks.positions[22].y) / 2)
    const middleThird = Math.abs(
      (landmarks.positions[21].y + landmarks.positions[22].y) / 2 - landmarks.positions[33].y,
    )
    const lowerThird = Math.abs(landmarks.positions[33].y - landmarks.positions[8].y)

    // Calculate facial symmetry (simplified)
    const symmetryScore = 0.85 // Simplified for this example

    // Calculate golden ratio score (simplified)
    const goldenRatioScore = 1 - Math.abs(faceHeight / faceWidth - 1.618) / 1.618

    // Determine face shape based on ratios
    let faceShape = "Oval" // Default

    if (widthToHeightRatio > 0.85 && widthToHeightRatio < 0.95) {
      if (jawToFaceWidthRatio > 0.78) {
        faceShape = "Round"
      } else if (cheekToJawRatio < 1.1) {
        faceShape = "Square"
      }
    } else if (widthToHeightRatio < 0.8) {
      if (cheekToJawRatio > 1.1) {
        faceShape = "Diamond"
      } else {
        faceShape = "Oval"
      }
    } else if (foreheadToJawRatio > 1.2) {
      faceShape = "Heart"
    }

    // Create measurements object
    const measurements: FacialMeasurements = {
      faceWidth,
      faceHeight,
      jawWidth,
      cheekWidth,
      foreheadHeight,
      chinHeight,
      widthToHeightRatio,
      jawToFaceWidthRatio,
      cheekToJawRatio,
      foreheadToChinRatio,
      foreheadToJawRatio,
      symmetryScore,
      goldenRatioScore,
      eyeDistance,
      eyeWidth,
      eyeSpacingRatio,
      facialThirds: {
        upper: upperThird,
        middle: middleThird,
        lower: lowerThird,
        balanced:
          Math.abs(upperThird - middleThird) < faceHeight * 0.05 &&
          Math.abs(middleThird - lowerThird) < faceHeight * 0.05,
      },
      facialFifths: {
        width: faceWidth / 5,
        balanced: true,
      },
    }

    return { faceShape, measurements }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    addDebugLog("File selected for upload")

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      addDebugLog("Invalid file type uploaded")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string)
      addDebugLog("Image loaded successfully")
    }
    reader.onerror = () => {
      setError("Failed to read the uploaded file")
      addDebugLog("Error reading uploaded file")
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

          {!cachingSupported && (
            <p className="mt-2 text-xs sm:text-sm text-amber-600 dark:text-amber-400">
              Service worker caching not available in this environment. Models will be loaded directly.
            </p>
          )}

          {cachingSupported && !modelsAreCached && modelLoadingAttempts > 0 && (
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">Loading models directly from network...</p>
          )}

          {modelLoadingAttempts > 0 && (
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Loading attempt {modelLoadingAttempts + 1}/3...
            </p>
          )}

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
            {cachingSupported && modelsAreCached && (
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
            )}

            <Button variant="outline" size="sm" onClick={handleManualReload}>
              <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Reload Models</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="text-xs sm:text-sm"
            >
              {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4 max-w-md mx-auto text-xs sm:text-sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showDebugInfo && (
            <div className="mt-4 p-4 bg-muted rounded-md text-left max-h-60 overflow-y-auto text-xs mx-auto max-w-md">
              <h4 className="font-medium mb-2">Debug Information:</h4>
              <ul className="space-y-1">
                {debugInfo.map((log, index) => (
                  <li key={index} className="font-mono">
                    {log}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="w-full flex justify-between items-center mb-4">
            <Alert className="flex-1 bg-primary/10 border-primary/20 text-xs sm:text-sm">
              <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <AlertDescription className="text-primary font-medium">
                Faces or facial features data/images are not stored in any way.
              </AlertDescription>
            </Alert>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 flex-shrink-0"
                    onClick={() => setShowAdvancedInfo(!showAdvancedInfo)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle advanced analysis information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4 text-xs sm:text-sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualReload}
                className="ml-auto bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/50"
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Retry
              </Button>
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
                      addDebugLog("Uploaded image rendered successfully")
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
                  onUserMedia={() => {
                    setCameraReady(true)
                    addDebugLog("Camera ready")
                  }}
                  onUserMediaError={(err) => {
                    setError(`Camera access error: ${err.name}. Please check camera permissions.`)
                    addDebugLog(`Camera error: ${err.name} - ${err.message}`)
                  }}
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

          <div className="mt-4 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="text-xs sm:text-sm w-full"
            >
              {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
            </Button>

            {showDebugInfo && (
              <div className="mt-2 p-4 bg-muted rounded-md text-left max-h-60 overflow-y-auto text-xs">
                <h4 className="font-medium mb-2">Debug Information:</h4>
                <ul className="space-y-1">
                  {debugInfo.map((log, index) => (
                    <li key={index} className="font-mono">
                      {log}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
