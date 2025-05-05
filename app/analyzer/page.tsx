"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import FaceAnalyzer from "@/components/face-analyzer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Camera, FileImage, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Logo } from "@/components/logo"
import { useMobile } from "@/hooks/use-mobile"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { checkBrowserCapabilities } from "@/utils/model-cache"
import type { FacialMeasurements } from "@/types/facial-measurements"
import RecommendationResults from "@/components/recommendation-results"
import { OfflineIndicator } from "@/components/offline-indicator"

export default function AnalyzerPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const isMobile = useMobile()

  const [faceShape, setFaceShape] = useState<string | null>(null)
  const [facialMeasurements, setFacialMeasurements] = useState<FacialMeasurements | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadMode, setUploadMode] = useState(tabParam === "upload")
  const [modelsLoading, setModelsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(tabParam === "upload" ? "upload" : "camera")
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [browserCapabilities, setBrowserCapabilities] = useState<ReturnType<typeof checkBrowserCapabilities> | null>(
    null,
  )

  const handleAnalysisComplete = (shape: string, measurements: FacialMeasurements) => {
    setFaceShape(shape)
    setFacialMeasurements(measurements)
    setIsAnalyzing(false)
  }

  const startNewAnalysis = () => {
    setFaceShape(null)
    setFacialMeasurements(null)
  }

  const handleRetry = () => {
    setModelsLoading(true)
    setLoadingError(null)
    window.location.reload()
  }

  // Check browser capabilities on mount
  useEffect(() => {
    setBrowserCapabilities(checkBrowserCapabilities())
  }, [])

  // Update tab when URL parameter changes
  useEffect(() => {
    if (tabParam === "upload") {
      setActiveTab("upload")
      setUploadMode(true)
    } else if (tabParam === "camera") {
      setActiveTab("camera")
      setUploadMode(false)
    }
  }, [tabParam])

  return (
    <main className="flex min-h-screen flex-col items-center p-3 sm:p-4 md:p-8 pb-20">
      <div className="w-full max-w-4xl">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" passHref>
              <Button variant="ghost" size={isMobile ? "sm" : "icon"} className={isMobile ? "px-2" : ""}>
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <h1 className="ml-1 sm:ml-2 text-xl sm:text-2xl font-bold">Face Analyzer</h1>
          </div>
          <Logo size={isMobile ? "sm" : "md"} />
        </div>

        <OfflineIndicator />

        {/* Browser compatibility warning */}
        {browserCapabilities && (!browserCapabilities.webgl || !browserCapabilities.mediaDevices) && (
          <Alert
            variant="warning"
            className="mb-4 bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
          >
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-600 dark:text-amber-400 font-medium text-sm">
              {!browserCapabilities.webgl &&
                "Your browser may not fully support WebGL, which is required for face detection. "}
              {!browserCapabilities.mediaDevices && "Your browser may have limited camera access capabilities. "}
              Consider using a modern browser like Chrome or Edge for the best experience.
            </AlertDescription>
          </Alert>
        )}

        {modelsLoading && (
          <div className="w-full text-center py-4 sm:py-8 mb-4 sm:mb-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Loading Face Analysis Models</h2>
                <p className="mb-4 text-sm sm:text-base text-muted-foreground">
                  Please wait while we load the necessary AI models. This may take a moment depending on your internet
                  connection.
                </p>
                <Progress className="w-full" />
              </CardContent>
            </Card>
          </div>
        )}

        {loadingError && (
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-destructive">Error Loading Models</h2>
              <p className="mb-4 text-sm sm:text-base">{loadingError}</p>
              <Button onClick={handleRetry} className="flex items-center" size={isMobile ? "sm" : "default"}>
                <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Retry Loading
              </Button>
            </CardContent>
          </Card>
        )}

        {!faceShape && !loadingError ? (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <Tabs
                defaultValue={activeTab}
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value)
                  setUploadMode(value === "upload")
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
                  <TabsTrigger value="camera" className="text-xs sm:text-sm">
                    <Camera className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Camera
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="text-xs sm:text-sm">
                    <FileImage className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Upload Image
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="camera" className="mt-0">
                  <FaceAnalyzer
                    onAnalysisComplete={handleAnalysisComplete}
                    setIsAnalyzing={setIsAnalyzing}
                    uploadMode={false}
                    setModelsLoading={setModelsLoading}
                  />
                </TabsContent>
                <TabsContent value="upload" className="mt-0">
                  <FaceAnalyzer
                    onAnalysisComplete={handleAnalysisComplete}
                    setIsAnalyzing={setIsAnalyzing}
                    uploadMode={true}
                    setModelsLoading={setModelsLoading}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          faceShape &&
          facialMeasurements && (
            <RecommendationResults
              faceShape={faceShape}
              facialMeasurements={facialMeasurements}
              onStartNew={startNewAnalysis}
            />
          )
        )}
      </div>
    </main>
  )
}
