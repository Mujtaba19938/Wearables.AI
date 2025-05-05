"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, ShieldCheck, Download, Printer, Share2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import type { FacialMeasurements } from "@/types/facial-measurements"
import { Progress } from "@/components/ui/progress"
import { FacialMeasurementVisualizer } from "@/components/facial-measurement-visualizer"

interface RecommendationResultsProps {
  faceShape: string
  facialMeasurements: FacialMeasurements
  onStartNew: () => void
}

interface GlassesStyle {
  name: string
  description: string
  suitability: "Excellent" | "Good" | "Fair"
  imageSrc: string
}

export default function RecommendationResults({
  faceShape,
  facialMeasurements,
  onStartNew,
}: RecommendationResultsProps) {
  const [activeTab, setActiveTab] = useState("recommended")
  const [isExporting, setIsExporting] = useState(false)
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Get recommendations based on face shape
  const recommendations = getRecommendations(faceShape, facialMeasurements)

  // Filter recommendations by suitability
  const excellentMatches = recommendations.filter((r) => r.suitability === "Excellent")
  const goodMatches = recommendations.filter((r) => r.suitability === "Good")
  const fairMatches = recommendations.filter((r) => r.suitability === "Fair")

  // Function to save results as PDF
  const saveAsPDF = async () => {
    if (!resultsRef.current) return

    setIsExporting(true)
    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: isMobile ? 1 : 2, // Lower scale on mobile for better performance
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      })

      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height)
      pdf.save(`wearables-face-analysis-${faceShape.toLowerCase()}.pdf`)

      toast({
        title: "Success!",
        description: "Your results have been saved as a PDF.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error saving PDF:", error)
      toast({
        title: "Error",
        description: "Failed to save your results. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Function to print results
  const printResults = () => {
    window.print()
  }

  // Function to share results
  const shareResults = async () => {
    if (!navigator.share) {
      toast({
        title: "Not supported",
        description: "Sharing is not supported on your device or browser.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    try {
      await navigator.share({
        title: `My Face Shape Analysis: ${faceShape}`,
        text: `According to wearables.ai, my face shape is ${faceShape}. Check out which eyeglasses would look best on me!`,
        url: window.location.href,
      })

      toast({
        title: "Shared!",
        description: "Your results have been shared successfully.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error sharing:", error)
      if (error.name !== "AbortError") {
        toast({
          title: "Error",
          description: "Failed to share your results. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  return (
    <div>
      <Card className="w-full print:shadow-none" ref={resultsRef}>
        <CardHeader className="print:pb-2 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div>
              <CardTitle className="text-xl sm:text-2xl">Your Results</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Based on our in-depth analysis, your face shape is <span className="font-bold">{faceShape}</span>
              </CardDescription>
            </div>
            <div className="print:hidden flex items-center gap-2">
              <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onStartNew}>
                <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                New Analysis
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}>
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle detailed analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent className="print:pt-2 p-4 sm:p-6">
          <Alert className="mb-4 sm:mb-6 bg-primary/10 border-primary/20 print:bg-transparent print:border print:border-black/20 text-xs sm:text-sm">
            <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <AlertDescription className="text-primary font-medium print:text-black">
              Faces or facial features data/images are not stored in any way and we do not sell your privacy.
            </AlertDescription>
          </Alert>

          {showDetailedAnalysis && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">Detailed Facial Analysis</CardTitle>
                <CardDescription>Based on 68 facial landmarks and advanced proportional measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Facial Symmetry</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Low</span>
                        <span className="text-xs text-muted-foreground">High</span>
                      </div>
                      <Progress value={facialMeasurements.symmetryScore * 100} className="h-2" />
                      <p className="text-xs text-center">
                        {Math.round(facialMeasurements.symmetryScore * 100)}% symmetrical
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Golden Ratio Alignment</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Low</span>
                        <span className="text-xs text-muted-foreground">High</span>
                      </div>
                      <Progress value={facialMeasurements.goldenRatioScore * 100} className="h-2" />
                      <p className="text-xs text-center">
                        {Math.round(facialMeasurements.goldenRatioScore * 100)}% alignment with golden ratio
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Key Facial Proportions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-muted p-2 rounded-md">
                      <p className="font-medium">Width/Height</p>
                      <p>{facialMeasurements.widthToHeightRatio.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <p className="font-medium">Jaw/Face Width</p>
                      <p>{facialMeasurements.jawToFaceWidthRatio.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <p className="font-medium">Cheek/Jaw</p>
                      <p>{facialMeasurements.cheekToJawRatio.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <p className="font-medium">Eye Spacing</p>
                      <p>{facialMeasurements.eyeSpacingRatio.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Facial Thirds Balance</h4>
                  <div className="flex items-center gap-2">
                    <div className="h-16 w-4 bg-muted rounded-md relative">
                      <div
                        className="absolute bottom-0 w-full bg-primary rounded-md"
                        style={{
                          height: `${(facialMeasurements.facialThirds.upper / facialMeasurements.faceHeight) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="h-16 w-4 bg-muted rounded-md relative">
                      <div
                        className="absolute bottom-0 w-full bg-primary rounded-md"
                        style={{
                          height: `${(facialMeasurements.facialThirds.middle / facialMeasurements.faceHeight) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="h-16 w-4 bg-muted rounded-md relative">
                      <div
                        className="absolute bottom-0 w-full bg-primary rounded-md"
                        style={{
                          height: `${(facialMeasurements.facialThirds.lower / facialMeasurements.faceHeight) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex-1 text-xs">
                      <p>
                        Upper:{" "}
                        {Math.round((facialMeasurements.facialThirds.upper / facialMeasurements.faceHeight) * 100)}%
                      </p>
                      <p>
                        Middle:{" "}
                        {Math.round((facialMeasurements.facialThirds.middle / facialMeasurements.faceHeight) * 100)}%
                      </p>
                      <p>
                        Lower:{" "}
                        {Math.round((facialMeasurements.facialThirds.lower / facialMeasurements.faceHeight) * 100)}%
                      </p>
                      <p className="mt-1 font-medium">
                        {facialMeasurements.facialThirds.balanced ? "Balanced thirds" : "Slightly unbalanced thirds"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Face Shape Visualization</h4>
                  <FacialMeasurementVisualizer measurements={facialMeasurements} faceShape={faceShape} />
                  <p className="text-xs text-center mt-2 text-muted-foreground">
                    Visual representation of your face shape and proportions
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-medium mb-2">About {faceShape} Face Shape</h3>
            <p className="text-sm text-muted-foreground print:text-black/70">{getFaceShapeDescription(faceShape)}</p>
          </div>

          <h3 className="text-base sm:text-lg font-medium mb-4">Recommended Eyeglasses Styles</h3>

          <Tabs defaultValue="recommended" onValueChange={setActiveTab} className="print:block">
            <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 print:hidden">
              <TabsTrigger value="recommended" className="text-xs sm:text-sm">
                Recommended
              </TabsTrigger>
              <TabsTrigger value="good" className="text-xs sm:text-sm">
                Good Options
              </TabsTrigger>
              <TabsTrigger value="fair" className="text-xs sm:text-sm">
                Other Options
              </TabsTrigger>
            </TabsList>

            {/* For print version, show all recommendations with headers */}
            <div className="hidden print:block mb-4">
              <h4 className="font-medium text-lg mb-3">Recommended Eyeglasses</h4>
            </div>

            <TabsContent value="recommended" className="mt-0 print:block">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 print:gap-4">
                {excellentMatches.map((style, index) => (
                  <GlassesCard key={index} style={style} isMobile={isMobile} />
                ))}
              </div>
            </TabsContent>

            <div className="hidden print:block mt-6 mb-4">
              <h4 className="font-medium text-lg mb-3">These Might Look Good</h4>
            </div>

            <TabsContent value="good" className="mt-0 print:block">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 print:gap-4">
                {goodMatches.map((style, index) => (
                  <GlassesCard key={index} style={style} isMobile={isMobile} />
                ))}
              </div>
            </TabsContent>

            <div className="hidden print:block mt-6 mb-4">
              <h4 className="font-medium text-lg mb-3">If You Have No Other Choice</h4>
            </div>

            <TabsContent value="fair" className="mt-0 print:block">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 print:gap-4">
                {fairMatches.map((style, index) => (
                  <GlassesCard key={index} style={style} isMobile={isMobile} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 pb-4 p-4 sm:p-6 print:hidden">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Analysis by <span className="font-medium">wearables.ai</span>
          </div>
          <div className="flex gap-2">
            {isMobile ? (
              // Mobile-friendly action buttons without tooltips
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={saveAsPDF}
                  disabled={isExporting}
                  aria-label="Save as PDF"
                >
                  {isExporting ? (
                    <span className="animate-spin">
                      <RefreshCw className="h-4 w-4" />
                    </span>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>

                <Button variant="outline" size="icon" onClick={printResults} aria-label="Print results">
                  <Printer className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="icon" onClick={shareResults} aria-label="Share results">
                  <Share2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              // Desktop version with tooltips
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={saveAsPDF} disabled={isExporting}>
                        {isExporting ? (
                          <span className="animate-spin">
                            <RefreshCw className="h-4 w-4" />
                          </span>
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save as PDF</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={printResults}>
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Print results</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={shareResults}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share results</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

function GlassesCard({ style, isMobile }: { style: GlassesStyle; isMobile: boolean }) {
  return (
    <Card className="print:border print:shadow-none">
      <CardContent className="p-3 sm:p-4">
        <div className="aspect-[4/3] relative mb-2 sm:mb-3 bg-muted rounded-md overflow-hidden">
          <Image
            src={style.imageSrc || "/placeholder.svg?height=300&width=400&query=eyeglasses"}
            alt={style.name}
            fill
            className="object-cover"
          />
        </div>
        <h4 className="font-medium text-base sm:text-lg">{style.name}</h4>
        <p className="text-xs sm:text-sm text-muted-foreground print:text-black/70 mt-1">{style.description}</p>
      </CardContent>
    </Card>
  )
}

function getFaceShapeDescription(faceShape: string): string {
  switch (faceShape) {
    case "Oval":
      return "Oval faces are longer than they are wide with a jaw that is narrower than the cheekbones. This is considered the most versatile face shape for eyewear. Your facial features are balanced with a gently rounded jawline and slightly wider cheekbones."
    case "Round":
      return "Round faces have soft features with equal width and length. The cheekbones are the widest part of the face with a rounded jawline. Your face has gentle curves with full cheeks and a less defined chin."
    case "Square":
      return "Square faces have a strong jawline with a broad forehead and wide cheekbones. The width and length of the face are roughly equal. Your face has angular features with a prominent jawline and minimal curve at the chin."
    case "Heart":
      return "Heart-shaped faces have a wider forehead and cheekbones with a narrow jawline that tapers to a point at the chin. Your face is widest at the forehead with high cheekbones and a narrow, sometimes pointed chin."
    case "Diamond":
      return "Diamond faces have narrow foreheads and jawlines with wide, high cheekbones. The chin is pointed and the face is widest at the cheekbones. Your facial structure creates dramatic angles with a narrow forehead and jawline."
    case "Oblong":
      return "Oblong faces are longer than they are wide with a long, straight cheek line. Your face has a longer appearance with a narrow chin and forehead, and the cheekbones are not particularly pronounced."
    case "Rectangle":
      return "Rectangle faces have a longer appearance similar to square faces, but with a more elongated shape. Your face has a strong jawline and forehead with straight cheek lines and a squared chin."
    case "Triangle":
      return "Triangle faces have a narrow forehead that widens at the cheek and jaw area. Your face is widest at the jawline with a more narrow forehead and a strong jaw structure."
    default:
      return "Your face shape has unique proportions that make certain eyeglass styles more flattering than others. Our analysis has identified specific features that influence which frames will complement your appearance best."
  }
}

function getRecommendations(faceShape: string, measurements: FacialMeasurements): GlassesStyle[] {
  // Use measurements to refine recommendations
  const symmetryFactor = measurements.symmetryScore > 0.85
  const goldenRatioFactor = measurements.goldenRatioScore > 0.8
  const balancedThirds = measurements.facialThirds.balanced

  switch (faceShape) {
    case "Oval":
      return [
        {
          name: "Wayfarer",
          description:
            "Classic, slightly angular frames that add definition to oval faces." +
            (symmetryFactor ? " Perfect for your highly symmetrical features." : ""),
          suitability: "Excellent",
          imageSrc: "/images/frames/wayfarer-black.png",
        },
        {
          name: "Aviator",
          description:
            "Timeless teardrop shape that complements oval face proportions." +
            (goldenRatioFactor ? " Enhances your natural golden ratio proportions." : ""),
          suitability: "Excellent",
          imageSrc: "/images/frames/aviator-gold.png",
        },
        {
          name: "Cat-Eye",
          description:
            "Upswept frames that add interesting contrast to oval faces." +
            (balancedThirds ? " Works well with your balanced facial thirds." : ""),
          suitability: "Good",
          imageSrc: "/images/frames/cat-eye-black.png",
        },
        {
          name: "Round",
          description:
            "Creates a stylish contrast with the natural oval shape." +
            (measurements.widthToHeightRatio < 0.7 ? " Helps balance your longer face proportions." : ""),
          suitability: "Good",
          imageSrc: "/images/frames/round-gold.png",
        },
        {
          name: "Oversized",
          description:
            "Bold statement frames that can work well with balanced oval proportions." +
            (measurements.eyeSpacingRatio > 2.5 ? " Complements your wider-set eyes." : ""),
          suitability: "Fair",
          imageSrc: "/images/frames/square-clear.png",
        },
      ]

    case "Round":
      return [
        {
          name: "Rectangle",
          description:
            "Angular frames that add definition and make round faces appear longer and thinner." +
            (measurements.widthToHeightRatio > 0.9 ? " Ideal for balancing your equal face width and height." : ""),
          suitability: "Excellent",
          imageSrc: "/images/frames/rectangle-black.png",
        },
        {
          name: "Square",
          description:
            "Sharp angles contrast with soft features to add definition." +
            (measurements.jawToFaceWidthRatio > 0.8 ? " Creates structure for your softer jawline." : ""),
          suitability: "Excellent",
          imageSrc: "/images/frames/square-black.png",
        },
        {
          name: "Wayfarer",
          description:
            "Classic style with straight browlines that add structure." +
            (balancedThirds ? " Complements your balanced facial proportions." : ""),
          suitability: "Good",
          imageSrc: "/images/frames/wayfarer-black.png",
        },
        {
          name: "Cat-Eye",
          description:
            "Upswept frames create the illusion of higher cheekbones." +
            (measurements.cheekToJawRatio < 1.1 ? " Adds definition to your cheek area." : ""),
          suitability: "Good",
          imageSrc: "/images/frames/cat-eye-black.png",
        },
        {
          name: "Round",
          description:
            "Similar shapes tend to emphasize roundness rather than contrast with it." +
            (symmetryFactor ? " Though your facial symmetry can support this style if desired." : ""),
          suitability: "Fair",
          imageSrc: "/images/frames/round-gold.png",
        },
      ]

    case "Square":
      return [
        {
          name: "Round",
          description:
            "Soft curves contrast with angular features to create balance." +
            (measurements.jawToFaceWidthRatio > 0.85 ? " Perfect for softening your strong jawline." : ""),
          suitability: "Excellent",
          imageSrc: "/images/frames/round-gold.png",
        },
        {
          name: "Oval",
          description:
            "Softens angular features while maintaining a classic look." +
            (measurements.widthToHeightRatio > 0.9 ? " Helps elongate your face's equal proportions." : ""),
          suitability: "Excellent",
          imageSrc: "/images/frames/cat-eye-black.png",
        },
        {
          name: "Browline",
          description:
            "Semi-rimless styles soften the jawline while emphasizing the upper face." +
            (measurements.facialThirds.upper < measurements.facialThirds.lower ? " Balances your facial thirds." : ""),
          suitability: "Good",
          imageSrc: "/images/frames/browline-black.png",
        },
        {
          name: "Aviator",
          description:
            "Curved edges help soften square facial features." +
            (goldenRatioFactor ? " Enhances your natural proportions." : ""),
          suitability: "Good",
          imageSrc: "/images/frames/aviator-gold.png",
        },
        {
          name: "Rectangle",
          description:
            "Similar angular shapes can emphasize rather than complement square features." +
            (symmetryFactor ? " Though your facial symmetry allows you to pull off this style if desired." : ""),
          suitability: "Fair",
          imageSrc: "/images/frames/rectangle-black.png",
        },
      ]

    case "Heart":
      return [
        {
          name: "Bottom-Heavy Frames",
          description:
            "Frames that are wider at the bottom balance a wider forehead." +
            (measurements.foreheadToChinRatio > 1.2 ? " Ideal for balancing your proportions." : ""),
          suitability: "Excellent",
          imageSrc: "/images/frames/wayfarer-black.png",
        },
        {
          name: "Oval",
          description:
            "Softens the forehead while adding width to the chin area." +
            (measurements.jawToFaceWidthRatio < 0.7 ? " Perfect for balancing your narrower jawline." : ""),
          suitability: "Excellent",
          imageSrc: "/images/frames/cat-eye-black.png",
        },
        {
          name: "Round",
          description:
            "Soft curves balance the pointed chin of heart-shaped faces." +
            (balancedThirds ? " Works well with your balanced facial proportions." : ""),
          suitability: "Good",
          imageSrc: "/images/frames/round-gold.png",
        },
        {
          name: "Rectangle",
          description:
            "Low-set temples draw attention downward, balancing proportions." +
            (measurements.facialThirds.upper > measurements.facialThirds.lower
              ? " Helps balance your facial thirds."
              : ""),
          suitability: "Good",
          imageSrc: "/images/frames/rectangle-black.png",
        },
        {
          name: "Cat-Eye",
          description:
            "Upswept styles can emphasize the wider upper face." +
            (symmetryFactor ? " Though your facial symmetry can make this work if desired." : ""),
          suitability: "Fair",
          imageSrc: "/images/frames/cat-eye-purple.png",
        },
      ]

    case "Diamond":
      return [
        {
          name: "Cat-Eye",
          description:
            "Upswept frames highlight cheekbones and balance a narrow forehead." +
            (measurements.cheekToJawRatio > 1.2 ? " Perfect for your prominent cheekbones." : ""),
          suitability: "Excellent",
          imageSrc: "/images/frames/cat-eye-purple.png",
        },
        {
          name: "Oval",
          description:
            "Softens angular features and complements high cheekbones." +
            (measurements.widthToHeightRatio < 0.8 ? " Adds width to balance your face proportions." : ""),
          suitability: "Excellent",
          imageSrc: "/images/frames/cat-eye-tortoise.png",
        },
        {
          name: "Browline",
          description:
            "Adds width to the forehead while complementing cheekbones." +
            (measurements.facialThirds.upper < measurements.facialThirds.middle ? " Balances your facial thirds." : ""),
          suitability: "Good",
          imageSrc: "/images/frames/browline-black.png",
        },
        {
          name: "Rimless",
          description:
            "Minimalist style that doesn't compete with distinctive diamond features." +
            (goldenRatioFactor ? " Showcases your naturally balanced proportions." : ""),
          suitability: "Good",
          imageSrc: "/images/frames/rimless-clear.png",
        },
        {
          name: "Rectangle",
          description:
            "Can make the face appear longer rather than balancing width." +
            (symmetryFactor ? " Though your facial symmetry allows you to experiment with this style." : ""),
          suitability: "Fair",
          imageSrc: "/images/frames/rectangle-black.png",
        },
      ]

    case "Oblong":
      return [
        {
          name: "Round or Oval",
          description:
            "Curved frames add width and soften a long face shape." +
            (measurements.widthToHeightRatio < 0.7 ? " Perfect for balancing your face length." : ""),
          suitability: "Excellent",
          imageSrc: "/placeholder.svg?key=oblong1",
        },
        {
          name: "Decorative Temples",
          description:
            "Frames with detail on the sides create the illusion of width." +
            (measurements.facialThirds.middle > measurements.facialThirds.upper
              ? " Helps balance your facial proportions."
              : ""),
          suitability: "Excellent",
          imageSrc: "/placeholder.svg?key=oblong2",
        },
        {
          name: "Wide Rectangular",
          description:
            "Wide frames with a shallow depth help create width." +
            (balancedThirds ? " Works with your balanced facial thirds." : ""),
          suitability: "Good",
          imageSrc: "/placeholder.svg?key=oblong3",
        },
        {
          name: "Butterfly",
          description:
            "Frames that are wider at the top and bottom add width to the face." +
            (measurements.cheekToJawRatio < 1.1 ? " Adds definition to your cheek area." : ""),
          suitability: "Good",
          imageSrc: "/placeholder.svg?key=oblong4",
        },
        {
          name: "Narrow Rectangle",
          description:
            "Can emphasize length rather than adding width." +
            (symmetryFactor ? " Though your facial symmetry allows some flexibility." : ""),
          suitability: "Fair",
          imageSrc: "/placeholder.svg?key=oblong5",
        },
      ]

    case "Rectangle":
      return [
        {
          name: "Round or Oval",
          description:
            "Curved frames soften angular features and add balance." +
            (measurements.jawToFaceWidthRatio > 0.8 ? " Perfect for softening your strong jawline." : ""),
          suitability: "Excellent",
          imageSrc: "/placeholder.svg?key=rect1",
        },
        {
          name: "Square with Rounded Edges",
          description:
            "Maintains structure while softening angles." +
            (measurements.widthToHeightRatio < 0.8 ? " Helps balance your face length." : ""),
          suitability: "Excellent",
          imageSrc: "/placeholder.svg?key=rect2",
        },
        {
          name: "Wayfarers",
          description:
            "Classic style that adds width and breaks up face length." +
            (balancedThirds ? " Complements your balanced facial proportions." : ""),
          suitability: "Good",
          imageSrc: "/placeholder.svg?key=rect3",
        },
        {
          name: "Aviators",
          description:
            "Curved frames that add softness to angular features." +
            (measurements.eyeSpacingRatio > 2.2 ? " Works well with your eye spacing." : ""),
          suitability: "Good",
          imageSrc: "/placeholder.svg?key=rect4",
        },
        {
          name: "Narrow Rectangle",
          description:
            "Can emphasize the rectangular shape rather than balance it." +
            (symmetryFactor ? " Though your facial symmetry gives you more flexibility." : ""),
          suitability: "Fair",
          imageSrc: "/placeholder.svg?key=rect5",
        },
      ]

    case "Triangle":
      return [
        {
          name: "Cat-Eye or Browline",
          description:
            "Frames that emphasize the upper face balance a wider jawline." +
            (measurements.jawToFaceWidthRatio > 0.85 ? " Perfect for balancing your strong jaw." : ""),
          suitability: "Excellent",
          imageSrc: "/placeholder.svg?key=tri1",
        },
        {
          name: "Semi-Rimless",
          description:
            "Frames with emphasis on the top portion balance facial proportions." +
            (measurements.facialThirds.lower > measurements.facialThirds.upper
              ? " Helps balance your facial thirds."
              : ""),
          name: "Semi-Rimless",
          description:
            "Frames with emphasis on the top portion balance facial proportions." +
            (measurements.facialThirds.lower > measurements.facialThirds.upper
              ? " Helps balance your facial thirds."
              : ""),
          suitability: "Excellent",
          imageSrc: "/placeholder.svg?key=tri2",
        },
        {
          name: "Aviators",
          description:
            "Top-heavy frames that draw attention upward." +
            (balancedThirds ? " Works with your balanced facial structure." : ""),
          suitability: "Good",
          imageSrc: "/placeholder.svg?key=tri3",
        },
        {
          name: "Decorative or Bold Upper Frame",
          description:
            "Frames with detail on top create balance with a stronger jaw." +
            (measurements.cheekToJawRatio < 0.9 ? " Adds definition to your upper face." : ""),
          suitability: "Good",
          imageSrc: "/placeholder.svg?key=tri4",
        },
        {
          name: "Bottom-Heavy Frames",
          description:
            "Can emphasize the jawline rather than balance it." +
            (symmetryFactor ? " Though your facial symmetry allows more flexibility in styles." : ""),
          suitability: "Fair",
          imageSrc: "/placeholder.svg?key=tri5",
        },
      ]

    default:
      // Default recommendations if face shape is not recognized
      return [
        {
          name: "Wayfarer",
          description:
            "Classic style that works well with most face shapes." +
            (goldenRatioFactor ? " Complements your balanced facial proportions." : ""),
          suitability: "Good",
          imageSrc: "/placeholder.svg?key=ntlf9",
        },
        {
          name: "Oval",
          description:
            "Versatile shape that complements most facial features." +
            (symmetryFactor ? " Works well with your symmetrical features." : ""),
          suitability: "Good",
          imageSrc: "/placeholder.svg?key=wdixv",
        },
        {
          name: "Rectangle",
          description:
            "Balanced proportions that work with many face types." +
            (balancedThirds ? " Complements your balanced facial structure." : ""),
          suitability: "Good",
          imageSrc: "/placeholder.svg?key=6ioip",
        },
      ]
  }
}
