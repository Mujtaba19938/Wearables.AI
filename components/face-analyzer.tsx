"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, ShieldCheck, RefreshCw, Info, Sliders, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as faceapi from "face-api.js"
import { isCachingSupported, registerServiceWorker, areModelsCached, updateCachedModels } from "@/utils/model-cache"
import { useMobile } from "@/hooks/use-mobile"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { FacialMeasurements } from "@/types/facial-measurements"
import { ARMeasurementOverlay } from "@/components/ar-measurement-overlay"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FaceAnalyzerProps {
  onAnalysisComplete: (shape: string, measurements: FacialMeasurements) => void
  setIsAnalyzing: (analyzing: boolean) => void
  uploadMode: boolean
  setModelsLoading: (loading: boolean) => void
}

// Define alternative model URLs for fallback
const MODEL_URLS = {
  primary: "https://justadudewhohacks.github.io/face-api.js/models",
  fallback1: "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model",
  fallback2: "https://cdn.jsdelivr.net/npm/face-api.js/weights",
  local: "/models", // Local fallback if we add models to the public folder
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
  const [currentModelUrl, setCurrentModelUrl] = useState(MODEL_URLS.primary)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [showMeasurementDebug, setShowMeasurementDebug] = useState(false)

  // AR overlay states
  const [arEnabled, setArEnabled] = useState(true)
  const [showMeasurements, setShowMeasurements] = useState(true)
  const [showLandmarks, setShowLandmarks] = useState(true)
  const [showFaceShape, setShowFaceShape] = useState(true)
  const [measurementType, setMeasurementType] = useState<"basic" | "detailed" | "thirds" | "golden">("basic")
  const [currentDetection, setCurrentDetection] = useState<faceapi.WithFaceLandmarks<
    faceapi.WithFaceExpressions<faceapi.WithAge<faceapi.WithGender<faceapi.WithFaceDetection<{}>>>>
  > | null>(null)
  const [isARProcessing, setIsARProcessing] = useState(false)

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
          addDebugLog("Registering service worker")
          await registerServiceWorker()
          addDebugLog("Service worker registered")

          const cached = await areModelsCached()
          setModelsAreCached(cached)
          addDebugLog(`Models are cached: ${cached}`)
        } catch (err) {
          addDebugLog(`Service worker error: ${err.message}`)
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
      addDebugLog(`Loading models from ${currentModelUrl}`)

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
        faceapi.nets.tinyFaceDetector.isLoaded && (await faceapi.nets.tinyFaceDetector.dispose())
        faceapi.nets.faceLandmark68Net.isLoaded && (await faceapi.nets.faceLandmark68Net.dispose())
        faceapi.nets.faceRecognitionNet.isLoaded && (await faceapi.nets.faceRecognitionNet.dispose())
        faceapi.nets.ageGenderNet.isLoaded && (await faceapi.nets.ageGenderNet.dispose())
        faceapi.nets.faceExpressionNet.isLoaded && (await faceapi.nets.faceExpressionNet.dispose())

        addDebugLog("Loading TinyFaceDetector model")
        // Load models in sequence to ensure proper loading
        await faceapi.nets.tinyFaceDetector.loadFromUri(currentModelUrl)
        setProgress(40)
        addDebugLog("TinyFaceDetector loaded")

        addDebugLog("Loading FaceLandmark68Net model")
        await faceapi.nets.faceLandmark68Net.loadFromUri(currentModelUrl)
        setProgress(60)
        addDebugLog("FaceLandmark68Net loaded")

        addDebugLog("Loading FaceRecognitionNet model")
        await faceapi.nets.faceRecognitionNet.loadFromUri(currentModelUrl)
        setProgress(80)
        addDebugLog("FaceRecognitionNet loaded")

        // Load additional models for more detailed analysis
        addDebugLog("Loading AgeGenderNet model")
        await faceapi.nets.ageGenderNet.loadFromUri(currentModelUrl)
        setProgress(90)
        addDebugLog("AgeGenderNet loaded")

        addDebugLog("Loading FaceExpressionNet model")
        await faceapi.nets.faceExpressionNet.loadFromUri(currentModelUrl)
        setProgress(100)
        addDebugLog("FaceExpressionNet loaded")

        // Verify models are loaded
        if (
          faceapi.nets.tinyFaceDetector.isLoaded &&
          faceapi.nets.faceLandmark68Net.isLoaded &&
          faceapi.nets.faceRecognitionNet.isLoaded &&
          faceapi.nets.ageGenderNet.isLoaded &&
          faceapi.nets.faceExpressionNet.isLoaded
        ) {
          addDebugLog("All models loaded successfully")
          setModelsLoaded(true)
          setModelsLoading(false)
        } else {
          throw new Error("Models did not load correctly")
        }
      } catch (err) {
        console.error("Error loading models:", err)
        addDebugLog(`Error loading models: ${err.message}`)
        setError(`Failed to load face detection models from ${currentModelUrl}. ${err.message}`)

        // Reset progress to indicate failure
        setProgress(0)
        setModelsLoading(false)

        // Try fallback URLs if we haven't tried them all yet
        if (currentModelUrl === MODEL_URLS.primary) {
          addDebugLog("Trying fallback URL 1")
          setCurrentModelUrl(MODEL_URLS.fallback1)
          setModelLoadingAttempts((prev) => prev + 1)
        } else if (currentModelUrl === MODEL_URLS.fallback1) {
          addDebugLog("Trying fallback URL 2")
          setCurrentModelUrl(MODEL_URLS.fallback2)
          setModelLoadingAttempts((prev) => prev + 1)
        } else if (currentModelUrl === MODEL_URLS.fallback2) {
          addDebugLog("Trying local models")
          setCurrentModelUrl(MODEL_URLS.local)
          setModelLoadingAttempts((prev) => prev + 1)
        } else {
          // We've tried all URLs, show a comprehensive error
          setError(
            "Failed to load face detection models after multiple attempts. Please check your internet connection, try a different browser, or try again later.",
          )
        }
      }
    }

    loadModels()
  }, [modelLoadingAttempts, cachingSupported, setModelsLoading, currentModelUrl])

  // Real-time face detection for AR mode
  useEffect(() => {
    if (!modelsLoaded || !webcamRef.current || !canvasRef.current || uploadMode || !arEnabled || isARProcessing) {
      return
    }

    let animationId: number

    const runFaceDetection = async () => {
      if (!webcamRef.current || !webcamRef.current.video || !webcamRef.current.video.readyState === 4) {
        animationId = requestAnimationFrame(runFaceDetection)
        return
      }

      setIsARProcessing(true)

      try {
        const video = webcamRef.current.video

        // Perform face detection with all features
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender()

        if (detection) {
          setCurrentDetection(detection)
        }
      } catch (err) {
        console.error("Error in real-time face detection:", err)
        addDebugLog(`Real-time detection error: ${err.message}`)
      }

      setIsARProcessing(false)
      animationId = requestAnimationFrame(runFaceDetection)
    }

    // Start the face detection loop
    animationId = requestAnimationFrame(runFaceDetection)

    // Clean up
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [modelsLoaded, webcamRef, canvasRef, uploadMode, arEnabled, isARProcessing])

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
    setCurrentModelUrl(MODEL_URLS.primary) // Reset to primary URL
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

      // Draw face landmarks on canvas for visualization if not in upload mode
      if (!uploadMode && canvasRef.current && webcamRef.current) {
        const video = webcamRef.current.video!
        const canvas = canvasRef.current
        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)
      }

      addDebugLog("Running face detection")
      // Perform comprehensive face detection with all available models
      const detectionWithAllOptions = await faceapi
        .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()

      if (!detectionWithAllOptions) {
        addDebugLog("No face detected")
        throw new Error(
          "Please remove any glasses, caps, or obstructions from the view. Ensure you are in good lighting and your face is clearly visible.",
        )
      }

      addDebugLog("Face detected, analyzing shape")
      // Extract landmarks for detailed analysis
      const landmarks = detectionWithAllOptions.landmarks
      const expressions = detectionWithAllOptions.expressions
      const age = Math.round(detectionWithAllOptions.age)
      const gender = detectionWithAllOptions.gender
      const genderProbability = detectionWithAllOptions.genderProbability

      // Perform comprehensive face shape analysis
      const { faceShape, measurements } = analyzeFaceInDepth(landmarks, detectionWithAllOptions.detection)
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

  const analyzeFaceInDepth = (landmarks: faceapi.FaceLandmarks68, detection: faceapi.FaceDetection) => {
    // Get key points from landmarks
    const jawPoints = landmarks.getJawOutline()
    const leftEye = landmarks.getLeftEye()
    const rightEye = landmarks.getRightEye()
    const nose = landmarks.getNose()
    const mouth = landmarks.getMouth()

    // Calculate basic measurements
    const faceWidth = Math.abs(jawPoints[16].x - jawPoints[0].x)
    const jawWidth = Math.abs(jawPoints[14].x - jawPoints[2].x)
    const cheekWidth = Math.abs(jawPoints[12].x - jawPoints[4].x)
    const faceHeight = landmarks.positions[8].y - landmarks.positions[27].y
    const foreheadHeight = landmarks.positions[27].y - jawPoints[0].y
    const chinHeight = landmarks.positions[8].y - landmarks.positions[57].y
    const jawHeight = landmarks.positions[8].y - jawPoints[9].y

    // Calculate more accurate face width and height
    const faceTop = Math.min(landmarks.positions[21].y, landmarks.positions[22].y) - 10 // Eyebrows top with margin
    const faceBottom = landmarks.positions[8].y // Chin bottom
    const moreAccurateFaceHeight = faceBottom - faceTop

    // Calculate width at different face levels
    const foreheadWidth = Math.abs(landmarks.positions[21].x - landmarks.positions[22].x) * 1.2 // Eyebrow width with margin
    const eyeWidthCalc = Math.abs(leftEye[3].x - rightEye[0].x) * 1.1 // Outer eye corners with margin
    const cheekboneWidth = Math.abs(jawPoints[12].x - jawPoints[4].x) * 1.05 // Cheekbone width with margin
    const jawlineWidth = Math.abs(jawPoints[14].x - jawPoints[2].x) // Jawline width

    // Use the maximum width for better face shape detection
    const moreAccurateFaceWidth = Math.max(foreheadWidth, eyeWidthCalc, cheekboneWidth, jawlineWidth)

    // Calculate improved ratios
    const improvedWidthToHeightRatio = moreAccurateFaceWidth / moreAccurateFaceHeight
    const foreheadToJawRatio = foreheadWidth / jawlineWidth
    const cheekboneToJawRatio = cheekboneWidth / jawlineWidth

    // Calculate facial thirds (rule of thirds)
    const upperThird = Math.abs(landmarks.positions[27].y - (landmarks.positions[21].y + landmarks.positions[22].y) / 2)
    const middleThird = Math.abs(
      (landmarks.positions[21].y + landmarks.positions[22].y) / 2 - landmarks.positions[33].y,
    )
    const lowerThird = Math.abs(landmarks.positions[33].y - landmarks.positions[8].y)

    // Calculate facial fifths (horizontal rule of fifths)
    const totalWidth = faceWidth
    const fifthWidth = totalWidth / 5

    // Calculate facial symmetry
    const leftSidePoints = jawPoints.slice(0, 9)
    const rightSidePoints = jawPoints.slice(9).reverse()

    let symmetryScore = 0
    const midpointX = (jawPoints[8].x + jawPoints[8].x) / 2

    // Compare distances from midpoint for corresponding points on left and right
    for (let i = 0; i < Math.min(leftSidePoints.length, rightSidePoints.length); i++) {
      const leftDist = Math.abs(leftSidePoints[i].x - midpointX)
      const rightDist = Math.abs(rightSidePoints[i].x - midpointX)
      const pointSymmetry = 1 - Math.abs(leftDist - rightDist) / Math.max(leftDist, rightDist)
      symmetryScore += pointSymmetry
    }

    // Average symmetry score (0-1)
    symmetryScore = symmetryScore / Math.min(leftSidePoints.length, rightSidePoints.length)

    // Calculate eye spacing
    const eyeDistance = Math.abs((leftEye[3].x + leftEye[0].x) / 2 - (rightEye[0].x + rightEye[3].x) / 2)
    const singleEyeWidth = Math.abs(leftEye[3].x - leftEye[0].x)

    // Calculate ratios
    const widthToHeightRatio = faceWidth / faceHeight
    const jawToFaceWidthRatio = jawWidth / faceWidth
    const cheekToJawRatio = cheekWidth / jawWidth
    const foreheadToChinRatio = foreheadHeight / chinHeight
    const eyeSpacingRatio = eyeDistance / singleEyeWidth

    // Calculate golden ratio approximation (1.618)
    const goldenRatioScore = 1 - Math.abs(faceHeight / faceWidth - 1.618) / 1.618

    // Determine face shape based on enhanced ratios and measurements
    let faceShape = "Oval" // Default to oval if no conditions match

    // Log measurements for debugging
    console.log("Face measurements:", {
      widthToHeightRatio: improvedWidthToHeightRatio,
      foreheadToJawRatio,
      cheekboneToJawRatio,
      foreheadToChinRatio,
      symmetryScore,
      goldenRatioScore,
    })

    // Improved face shape detection with better thresholds
    if (improvedWidthToHeightRatio > 0.9 && improvedWidthToHeightRatio < 1.1 && cheekboneToJawRatio < 1.2) {
      faceShape = "Round"
    } else if (improvedWidthToHeightRatio < 0.8 && cheekboneToJawRatio > 1.1) {
      faceShape = "Oval"
    } else if (
      improvedWidthToHeightRatio > 0.85 &&
      improvedWidthToHeightRatio < 0.95 &&
      cheekboneToJawRatio < 1.1 &&
      foreheadToJawRatio < 1.1
    ) {
      faceShape = "Square"
    } else if (foreheadToJawRatio > 1.2 && foreheadToChinRatio < 0.9) {
      faceShape = "Heart"
    } else if (cheekboneToJawRatio > 1.2 && foreheadToJawRatio < 1.1) {
      faceShape = "Diamond"
    } else if (improvedWidthToHeightRatio < 0.7) {
      faceShape = "Oblong"
    } else if (improvedWidthToHeightRatio < 0.85 && cheekboneToJawRatio < 1.1 && foreheadToJawRatio < 1.1) {
      faceShape = "Rectangle"
    } else if (foreheadToJawRatio < 0.9 && cheekboneToJawRatio < 1.0) {
      faceShape = "Triangle"
    } else {
      // If no specific shape is detected, use the golden ratio to determine between oval and round
      faceShape = goldenRatioScore > 0.7 ? "Oval" : "Round"
    }

    // Add more detailed logging for the determined face shape
    console.log(`Face shape determined: ${faceShape} based on measurements`)

    // Update the measurements object to include the new values
    const measurements: FacialMeasurements = {
      faceWidth,
      faceHeight,
      jawWidth,
      cheekWidth,
      foreheadHeight,
      chinHeight,
      widthToHeightRatio: improvedWidthToHeightRatio, // Use improved ratio
      jawToFaceWidthRatio,
      cheekToJawRatio: cheekboneToJawRatio, // Use improved ratio
      foreheadToChinRatio,
      foreheadToJawRatio, // Add new ratio
      symmetryScore,
      goldenRatioScore,
      eyeDistance,
      eyeWidth: singleEyeWidth,
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
        width: fifthWidth,
        balanced: true, // Simplified for now
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

          {modelLoadingAttempts > 0 && (
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Loading attempt {modelLoadingAttempts + 1}/4... Using{" "}
              {currentModelUrl === MODEL_URLS.primary
                ? "primary"
                : currentModelUrl === MODEL_URLS.fallback1
                  ? "fallback 1"
                  : currentModelUrl === MODEL_URLS.fallback2
                    ? "fallback 2"
                    : "local"}{" "}
              model source
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

          {showDebugInfo && (
            <div className="mt-4 p-4 bg-muted rounded-md text-left max-h-60 overflow-y-auto text-xs">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Debug Information:</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMeasurementDebug(!showMeasurementDebug)}
                  className="text-xs"
                >
                  {showMeasurementDebug ? "Hide Measurements" : "Show Measurements"}
                </Button>
              </div>

              {showMeasurementDebug && currentDetection && (
                <div className="mb-3 p-2 bg-background/50 rounded border border-border">
                  <p className="font-medium mb-1">Current Face Measurements:</p>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(
                      analyzeFaceInDepth(currentDetection.landmarks, currentDetection.detection),
                      null,
                      2,
                    )}
                  </pre>
                </div>
              )}

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

          {showAdvancedInfo && (
            <Alert className="mb-4 sm:mb-6 bg-muted text-xs sm:text-sm">
              <AlertDescription>
                Our enhanced analysis measures facial proportions, symmetry, and applies the golden ratio to determine
                your ideal eyewear. We analyze over 68 facial landmarks for precise face shape classification.
              </AlertDescription>
            </Alert>
          )}

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
              {/* AR Controls */}
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mb-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Switch id="ar-mode" checked={arEnabled} onCheckedChange={setArEnabled} />
                  <Label htmlFor="ar-mode">AR Mode</Label>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Sliders className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">AR Settings</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">AR Overlay Settings</h4>
                        <p className="text-sm text-muted-foreground">Customize what appears in the AR overlay</p>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-landmarks">Show Landmarks</Label>
                          <Switch id="show-landmarks" checked={showLandmarks} onCheckedChange={setShowLandmarks} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-measurements">Show Measurements</Label>
                          <Switch
                            id="show-measurements"
                            checked={showMeasurements}
                            onCheckedChange={setShowMeasurements}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-face-shape">Show Face Shape</Label>
                          <Switch id="show-face-shape" checked={showFaceShape} onCheckedChange={setShowFaceShape} />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="measurement-type">Measurement Type</Label>
                        <Select value={measurementType} onValueChange={(value) => setMeasurementType(value as any)}>
                          <SelectTrigger id="measurement-type">
                            <SelectValue placeholder="Select measurement type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="detailed">Detailed</SelectItem>
                            <SelectItem value="thirds">Facial Thirds</SelectItem>
                            <SelectItem value="golden">Golden Ratio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

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

                {/* AR Measurement Overlay */}
                {arEnabled && currentDetection && (
                  <ARMeasurementOverlay
                    detection={currentDetection}
                    canvasRef={canvasRef}
                    videoRef={webcamRef.current?.video as React.RefObject<HTMLVideoElement>}
                    showMeasurements={showMeasurements}
                    showLandmarks={showLandmarks}
                    showFaceShape={showFaceShape}
                    measurementType={measurementType}
                  />
                )}
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
