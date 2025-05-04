import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Camera, FileImage, Check, Info } from "lucide-react"
import { Logo } from "@/components/logo"

export default function GuidePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 pb-20">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Guide</h1>
            <p className="text-muted-foreground">
              Learn how to use our app to find the perfect eyeglasses for your face shape
            </p>
          </div>
          <Logo size="sm" />
        </div>

        {/* How to Use Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">How to Use the App</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Take a Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use your camera or upload a photo that clearly shows your face from the front.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <CardTitle>Analyze</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our AI will analyze your facial features to determine your face shape.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <CardTitle>Get Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View personalized eyeglass style recommendations based on your face shape.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                Tips for Best Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Ensure your face is well-lit with even lighting from the front</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Remove glasses, hats, or anything that might obscure your face shape</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Look directly at the camera with a neutral expression</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>Pull your hair back to reveal your entire face shape and jawline</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Link href="/analyzer">
              <Button size="lg" className="gap-2">
                Try It Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Face Shapes Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Understanding Face Shapes</h2>

          <Tabs defaultValue="oval" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger value="oval">Oval</TabsTrigger>
              <TabsTrigger value="round">Round</TabsTrigger>
              <TabsTrigger value="square">Square</TabsTrigger>
              <TabsTrigger value="heart">Heart</TabsTrigger>
              <TabsTrigger value="diamond">Diamond</TabsTrigger>
            </TabsList>

            <TabsContent value="oval">
              <Card>
                <div className="md:flex">
                  <div className="md:w-1/3 relative aspect-square">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Oval face shape"
                      fill
                      className="object-cover p-4"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-semibold mb-2">Oval Face Shape</h3>
                    <p className="mb-4">
                      Oval faces are longer than they are wide with a jaw that is narrower than the cheekbones. The
                      forehead is slightly wider than the chin, creating a balanced, egg-like shape.
                    </p>
                    <h4 className="font-medium mb-2">Characteristics:</h4>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Forehead is slightly wider than the chin</li>
                      <li>Cheekbones are the widest part of the face</li>
                      <li>Jaw is rounded rather than angular</li>
                      <li>Face length is about 1.5 times the width</li>
                    </ul>
                    <h4 className="font-medium mb-2">Best Eyeglass Styles:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Wayfarer</span>
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Aviator</span>
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Rectangle</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="round">
              <Card>
                <div className="md:flex">
                  <div className="md:w-1/3 relative aspect-square">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Round face shape"
                      fill
                      className="object-cover p-4"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-semibold mb-2">Round Face Shape</h3>
                    <p className="mb-4">
                      Round faces have curved lines with the width and length in similar proportions. The cheekbones and
                      face length have a similar measurement, creating a circular appearance.
                    </p>
                    <h4 className="font-medium mb-2">Characteristics:</h4>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Face width and length are roughly equal</li>
                      <li>Rounded jawline with minimal angles</li>
                      <li>Full cheeks</li>
                      <li>Rounded chin</li>
                    </ul>
                    <h4 className="font-medium mb-2">Best Eyeglass Styles:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Rectangle</span>
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Square</span>
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Cat-Eye</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="square">
              <Card>
                <div className="md:flex">
                  <div className="md:w-1/3 relative aspect-square">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Square face shape"
                      fill
                      className="object-cover p-4"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-semibold mb-2">Square Face Shape</h3>
                    <p className="mb-4">
                      Square faces have strong, angular features with the forehead, cheekbones, and jawline being
                      approximately the same width, creating a boxy appearance.
                    </p>
                    <h4 className="font-medium mb-2">Characteristics:</h4>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Strong, angular jawline</li>
                      <li>Forehead, cheekbones, and jawline are similar in width</li>
                      <li>Face width and length are roughly equal</li>
                      <li>Minimal curve at the chin</li>
                    </ul>
                    <h4 className="font-medium mb-2">Best Eyeglass Styles:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Round</span>
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Oval</span>
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Aviator</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="heart">
              <Card>
                <div className="md:flex">
                  <div className="md:w-1/3 relative aspect-square">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Heart face shape"
                      fill
                      className="object-cover p-4"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-semibold mb-2">Heart Face Shape</h3>
                    <p className="mb-4">
                      Heart-shaped faces have a wider forehead and gradually narrow down to a pointed chin, resembling
                      an inverted triangle or heart shape.
                    </p>
                    <h4 className="font-medium mb-2">Characteristics:</h4>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Wide forehead</li>
                      <li>High, prominent cheekbones</li>
                      <li>Narrow jawline</li>
                      <li>Pointed chin</li>
                    </ul>
                    <h4 className="font-medium mb-2">Best Eyeglass Styles:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                        Bottom-Heavy Frames
                      </span>
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Oval</span>
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Round</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="diamond">
              <Card>
                <div className="md:flex">
                  <div className="md:w-1/3 relative aspect-square">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Diamond face shape"
                      fill
                      className="object-cover p-4"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-semibold mb-2">Diamond Face Shape</h3>
                    <p className="mb-4">
                      Diamond faces have narrow foreheads and jawlines with wide, high cheekbones, creating a
                      diamond-like appearance with the widest point at the cheeks.
                    </p>
                    <h4 className="font-medium mb-2">Characteristics:</h4>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Narrow forehead</li>
                      <li>Wide, high cheekbones (widest part of the face)</li>
                      <li>Narrow jawline</li>
                      <li>Pointed chin</li>
                    </ul>
                    <h4 className="font-medium mb-2">Best Eyeglass Styles:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Cat-Eye</span>
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Oval</span>
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Rimless</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* FAQ Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How accurate is the face shape analysis?</AccordionTrigger>
              <AccordionContent>
                Our face shape analyzer uses advanced facial recognition technology to identify key facial landmarks and
                calculate proportions. While it's highly accurate for most users, factors like lighting, angle, and hair
                coverage can affect results. For the most accurate analysis, follow our tips for taking a good photo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Can I use the app if I already wear glasses?</AccordionTrigger>
              <AccordionContent>
                For the most accurate results, we recommend taking a photo without glasses. Glasses can obscure your
                natural face shape and affect the analysis. If you must wear glasses, try to choose a photo where your
                glasses don't cast shadows or distort your facial features.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Are my photos stored or shared?</AccordionTrigger>
              <AccordionContent>
                No, your privacy is important to us. All face analysis is performed directly in your browser using
                client-side processing. Your photos are never stored on our servers or shared with third parties. The
                facial recognition models run locally on your device.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>What if I'm between two face shapes?</AccordionTrigger>
              <AccordionContent>
                Many people have features of multiple face shapes, which is completely normal. Our analyzer will
                determine your primary face shape, but you may want to look at recommendations for both face shapes if
                you feel you're between two types. The most important thing is finding eyeglasses that you feel
                comfortable and confident wearing.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How do I choose between the recommended styles?</AccordionTrigger>
              <AccordionContent>
                While our recommendations are based on what generally works best for your face shape, personal style and
                preference are equally important. Consider factors like your personal style, color preferences, and the
                occasions where you'll wear the glasses. We recommend trying on several different styles, either
                virtually or in person, before making a final decision.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Getting Started Section */}
        <section>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Find Your Perfect Frames?</h3>
                  <p className="text-muted-foreground">
                    Start your analysis now and discover eyeglass styles that complement your unique face shape.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link href="/analyzer">
                    <Button size="lg" className="gap-2">
                      <Camera className="h-4 w-4" />
                      Use Camera
                    </Button>
                  </Link>
                  <Link href="/analyzer?tab=upload">
                    <Button size="lg" variant="outline" className="gap-2">
                      <FileImage className="h-4 w-4" />
                      Upload Photo
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
