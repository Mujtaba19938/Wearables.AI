"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, ShieldCheck, Download, Printer, Share2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

interface RecommendationResultsProps {
  faceShape: string
  onStartNew: () => void
}

interface GlassesStyle {
  name: string
  description: string
  suitability: "Excellent" | "Good" | "Fair"
  imageSrc: string
}

export default function RecommendationResults({ faceShape, onStartNew }: RecommendationResultsProps) {
  const [activeTab, setActiveTab] = useState("recommended")
  const [isExporting, setIsExporting] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Get recommendations based on face shape
  const recommendations = getRecommendations(faceShape)

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
                Based on our analysis, your face shape is <span className="font-bold">{faceShape}</span>
              </CardDescription>
            </div>
            <div className="print:hidden">
              <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onStartNew}>
                <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                New Analysis
              </Button>
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
            src={style.imageSrc || "/placeholder.svg"}
            alt={style.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
      return 'Oval faces are longer than they are wide with a jaw that is narrower than the cheekbones. This is considered the most versatile face shape for eyewear."ones. This is considered the most versatile face shape for eyewear.'
    case "Round":
      return "Round faces have soft features with equal width and length. The cheekbones are the widest part of the face with a rounded jawline."
    case "Square":
      return "Square faces have a strong jawline with a broad forehead and wide cheekbones. The width and length of the face are roughly equal."
    case "Heart":
      return "Heart-shaped faces have a wider forehead and cheekbones with a narrow jawline that tapers to a point at the chin."
    case "Diamond":
      return "Diamond faces have narrow foreheads and jawlines with wide, high cheekbones. The chin is pointed and the face is widest at the cheekbones."
    default:
      return "Your face shape has unique proportions that make certain eyeglass styles more flattering than others."
  }
}

function getRecommendations(faceShape: string): GlassesStyle[] {
  switch (faceShape) {
    case "Oval":
      return [
        {
          name: "Wayfarer",
          description: "Classic, slightly angular frames that add definition to oval faces.",
          suitability: "Excellent",
          imageSrc: "/frames/classic-wayfarer-black.png",
        },
        {
          name: "Aviator",
          description: "Timeless teardrop shape that complements oval face proportions.",
          suitability: "Excellent",
          imageSrc: "/frames/classic-aviator-gold.png",
        },
        {
          name: "Bold Transparent",
          description: "Statement frames with clear acetate that works well with balanced oval features.",
          suitability: "Excellent",
          imageSrc: "/frames/bold-transparent-clear.png",
        },
        {
          name: "Cat-Eye",
          description: "Upswept frames that add interesting contrast to oval faces.",
          suitability: "Good",
          imageSrc: "/frames/cat-eye-red.jpg",
        },
        {
          name: "Round",
          description: "Creates a stylish contrast with the natural oval shape.",
          suitability: "Good",
          imageSrc: "/frames/round-vintage-gold.png",
        },
        {
          name: "Keyhole Bridge",
          description: "Distinctive bridge detail that complements oval face balance.",
          suitability: "Good",
          imageSrc: "/frames/keyhole-bridge-tortoise.png",
        },
        {
          name: "Oversized",
          description: "Bold statement frames that can work well with balanced oval proportions.",
          suitability: "Fair",
          imageSrc: "/frames/oversized-square-black.png",
        },
        {
          name: "Wood Texture",
          description: "Eco-friendly frames with natural wood grain pattern that complement oval faces.",
          suitability: "Good",
          imageSrc: "/frames/wood-texture-brown.png",
        },
      ]

    case "Round":
      return [
        {
          name: "Rectangle",
          description: "Angular frames that add definition and make round faces appear longer and thinner.",
          suitability: "Excellent",
          imageSrc: "/frames/modern-rectangle-black.jpg",
        },
        {
          name: "Square",
          description: "Sharp angles contrast with soft features to add definition.",
          suitability: "Excellent",
          imageSrc: "/frames/geometric-hexagon-black.png",
        },
        {
          name: "Slim Rectangle",
          description: "Narrow frames that help elongate round face shapes.",
          suitability: "Excellent",
          imageSrc: "/frames/slim-rectangle-blue.png",
        },
        {
          name: "Hexagonal Wire",
          description: "Geometric angles help define and contrast with round face features.",
          suitability: "Excellent",
          imageSrc: "/frames/hexagonal-wire-gold.png",
        },
        {
          name: "Wayfarer",
          description: "Classic style with straight browlines that add structure.",
          suitability: "Good",
          imageSrc: "/frames/classic-wayfarer-black.png",
        },
        {
          name: "Cat-Eye",
          description: "Upswept frames create the illusion of higher cheekbones.",
          suitability: "Good",
          imageSrc: "/frames/designer-cat-eye-black.png",
        },
        {
          name: "Clubmaster",
          description: "Bold browline adds structure to softer features.",
          suitability: "Good",
          imageSrc: "/frames/clubmaster-brown.png",
        },
        {
          name: "Round",
          description: "Similar shapes tend to emphasize roundness rather than contrast with it.",
          suitability: "Fair",
          imageSrc: "/frames/round-vintage-gold.png",
        },
      ]

    case "Square":
      return [
        {
          name: "Round",
          description: "Soft curves contrast with angular features to create balance.",
          suitability: "Excellent",
          imageSrc: "/frames/round-vintage-gold.png",
        },
        {
          name: "Oval Wire",
          description: "Thin oval frames soften strong jawlines and angular features.",
          suitability: "Excellent",
          imageSrc: "/frames/oval-wire-gold.png",
        },
        {
          name: "Thin Metal Round",
          description: "Delicate circular frames that soften angular features.",
          suitability: "Excellent",
          imageSrc: "/frames/thin-metal-round-silver.png",
        },
        {
          name: "Oval",
          description: "Softens angular features while maintaining a classic look.",
          suitability: "Excellent",
          imageSrc: "/frames/rimless-clear.png",
        },
        {
          name: "Browline",
          description: "Semi-rimless styles soften the jawline while emphasizing the upper face.",
          suitability: "Good",
          imageSrc: "/frames/browline-black.png",
        },
        {
          name: "Aviator",
          description: "Curved edges help soften square facial features.",
          suitability: "Good",
          imageSrc: "/frames/classic-aviator-gold.png",
        },
        {
          name: "Rectangle",
          description: "Similar angular shapes can emphasize rather than complement square features.",
          suitability: "Fair",
          imageSrc: "/frames/modern-rectangle-black.jpg",
        },
        {
          name: "Clear Round Crystal",
          description: "Transparent round frames soften angular features with a modern look.",
          suitability: "Good",
          imageSrc: "/frames/clear-round-crystal.png",
        },
      ]

    case "Heart":
      return [
        {
          name: "Bottom-Heavy Frames",
          description: "Frames that are wider at the bottom balance a wider forehead.",
          suitability: "Excellent",
          imageSrc: "/frames/clubmaster-brown.png",
        },
        {
          name: "Oval",
          description: "Softens the forehead while adding width to the chin area.",
          suitability: "Excellent",
          imageSrc: "/frames/rimless-clear.png",
        },
        {
          name: "Clubmaster",
          description: "Browline frames that balance wider foreheads with detailed lower rims.",
          suitability: "Excellent",
          imageSrc: "/frames/clubmaster-brown.png",
        },
        {
          name: "Narrow Oval",
          description: "Slim profile balances wider foreheads and adds width to narrow chins.",
          suitability: "Excellent",
          imageSrc: "/frames/narrow-oval-black.png",
        },
        {
          name: "Round",
          description: "Soft curves balance the pointed chin of heart-shaped faces.",
          suitability: "Good",
          imageSrc: "/frames/round-vintage-gold.png",
        },
        {
          name: "Oval Wire",
          description: "Thin oval frames that add softness to angular chin features.",
          suitability: "Good",
          imageSrc: "/frames/oval-wire-gold.png",
        },
        {
          name: "Rectangle",
          description: "Low-set temples draw attention downward, balancing proportions.",
          suitability: "Good",
          imageSrc: "/frames/modern-rectangle-black.jpg",
        },
        {
          name: "Cat-Eye",
          description: "Upswept styles can emphasize the wider upper face.",
          suitability: "Fair",
          imageSrc: "/frames/cat-eye-red.jpg",
        },
      ]

    case "Diamond":
      return [
        {
          name: "Cat-Eye",
          description: "Upswept frames highlight cheekbones and balance a narrow forehead.",
          suitability: "Excellent",
          imageSrc: "/frames/cat-eye-red.jpg",
        },
        {
          name: "Designer Cat-Eye",
          description: "Decorative temples add width to narrow forehead and jawline.",
          suitability: "Excellent",
          imageSrc: "/frames/designer-cat-eye-black.png",
        },
        {
          name: "Oval",
          description: "Softens angular features and complements high cheekbones.",
          suitability: "Excellent",
          imageSrc: "/frames/rimless-clear.png",
        },
        {
          name: "Browline",
          description: "Adds width to the forehead while complementing cheekbones.",
          suitability: "Good",
          imageSrc: "/frames/browline-black.png",
        },
        {
          name: "Rimless",
          description: "Minimalist style that doesn't compete with distinctive diamond features.",
          suitability: "Good",
          imageSrc: "/frames/rimless-clear.png",
        },
        {
          name: "Thin Round",
          description: "Delicate frames that balance angular features of diamond faces.",
          suitability: "Good",
          imageSrc: "/frames/thin-metal-round-silver.png",
        },
        {
          name: "Rectangle",
          description: "Can make the face appear longer rather than balancing width.",
          suitability: "Fair",
          imageSrc: "/frames/modern-rectangle-black.jpg",
        },
        {
          name: "Butterfly Frame",
          description: "Upswept design complements high cheekbones and adds width to narrow features.",
          suitability: "Good",
          imageSrc: "/frames/butterfly-frame-purple.png",
        },
      ]

    default:
      // Default recommendations if face shape is not recognized
      return [
        {
          name: "Wayfarer",
          description: "Classic style that works well with most face shapes.",
          suitability: "Good",
          imageSrc: "/frames/classic-wayfarer-black.png",
        },
        {
          name: "Oval",
          description: "Versatile shape that complements most facial features.",
          suitability: "Good",
          imageSrc: "/frames/rimless-clear.png",
        },
        {
          name: "Rectangle",
          description: "Balanced proportions that work with many face types.",
          suitability: "Good",
          imageSrc: "/frames/modern-rectangle-black.jpg",
        },
      ]
  }
}
