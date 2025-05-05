"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, ShieldCheck, RefreshCw, Info, Sliders } from "lucide-react"
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
            setProgress(20)
            console.log("Loading models from cache")
          } else {
            console.log("Models not cached, loading from network")
          }
        }

        // Load models from CDN (service worker will intercept if cached)
        const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models"

        // Load models in sequence to ensure proper loading
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        setProgress(40)

        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        setProgress(60)

        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        setProgress(80)

        // Load additional models for more detailed analysis
        await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
        setProgress(90)

        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        setProgress(100)

        // Verify models are loaded
        if (
          faceapi.nets.tinyFaceDetector.isLoaded &&
          faceapi.nets.faceLandmark68Net.isLoaded &&
          faceapi.nets.faceRecognitionNet.isLoaded &&
          faceapi.nets.ageGenderNet.isLoaded &&
          faceapi.nets.faceExpressionNet.isLoaded
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
  }, [modelLoadingAttempts, cachingSupported, setModelsLoading])

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

      // Draw face landmarks on canvas for visualization if not in upload mode
      if (!uploadMode && canvasRef.current && webcamRef.current) {
        const video = webcamRef.current.video!
        const canvas = canvasRef.current
        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)
      }

      // Perform comprehensive face detection with all available models
      const detectionWithAllOptions = await faceapi
        .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()

      if (!detectionWithAllOptions) {
        throw new Error(
          "Please remove any glasses, caps, or obstructions from the view. Ensure you are in good lighting and your face is clearly visible.",
        )
      }

      // Extract landmarks for detailed analysis
      const landmarks = detectionWithAllOptions.landmarks
      const expressions = detectionWithAllOptions.expressions
      const age = Math.round(detectionWithAllOptions.age)
      const gender = detectionWithAllOptions.gender
      const genderProbability = detectionWithAllOptions.genderProbability

      // Perform comprehensive face shape analysis
      const { faceShape, measurements } = analyzeFaceInDepth(landmarks, detectionWithAllOptions.detection)

      // Pass the result to parent component
      onAnalysisComplete(faceShape, measurements)
    } catch (err: any) {
      console.error("Analysis error:", err)
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
    const eyeWidth = Math.abs(leftEye[3].x - leftEye[0].x)

    // Calculate ratios
    const widthToHeightRatio = faceWidth / faceHeight
    const jawToFaceWidthRatio = jawWidth / faceWidth
    const cheekToJawRatio = cheekWidth / jawWidth
    const foreheadToChinRatio = foreheadHeight / chinHeight
    const eyeSpacingRatio = eyeDistance / eyeWidth

    // Calculate golden ratio approximation (1.618)
    const goldenRatioScore = 1 - Math.abs(faceHeight / faceWidth - 1.618) / 1.618

    // Determine face shape based on enhanced ratios and measurements
    let faceShape = "Oval"

    if (widthToHeightRatio > 0.85 && jawToFaceWidthRatio > 0.78) {
      faceShape = "Round"
    } else if (widthToHeightRatio < 0.75 && jawToFaceWidthRatio < 0.7) {
      faceShape = "Oval"
    } else if (jawToFaceWidthRatio > 0.85 && cheekToJawRatio < 1.1) {
      faceShape = "Square"
    } else if (cheekToJawRatio > 1.15 && foreheadToChinRatio < 0.9) {
      faceShape = "Heart"
    } else if (jawToFaceWidthRatio < 0.8 && cheekToJawRatio > 1.05) {
      faceShape = "Diamond"
    } else if (widthToHeightRatio < 0.8 && jawToFaceWidthRatio > 0.7 && jawHeight / faceHeight < 0.3) {
      faceShape = "Oblong"
    } else if (cheekToJawRatio < 0.9 && jawToFaceWidthRatio > 0.8 && widthToHeightRatio < 0.85) {
      faceShape = "Rectangle"
    } else if (jawToFaceWidthRatio < 0.6 && widthToHeightRatio > 0.75) {
      faceShape = "Triangle"
    }

    // Compile all measurements
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
                  onUserMedia={() => setCameraReady(true)}
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
        </>
      )}
    </div>
  )
}
