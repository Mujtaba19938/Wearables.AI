import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-3 sm:p-4 md:p-24">
      <div className="mb-6 sm:mb-8 flex flex-col items-center">
        <Logo size="lg" showText={false} />
        <h1 className="mt-3 sm:mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">wearables.ai</h1>
        <p className="mt-1 sm:mt-2 text-base sm:text-lg text-muted-foreground">Find your perfect eyewear match</p>
      </div>

      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-3xl">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">Face Shape Analyzer</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Discover eyeglasses that complement your unique facial features
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-4 sm:p-6 pt-0 sm:pt-0">
          <Alert className="mb-4 sm:mb-6 bg-primary/10 border-primary/20 text-xs sm:text-sm">
            <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <AlertDescription className="text-primary font-medium">
              Faces or facial features data/images are not stored in any way and we do not sell your privacy.
            </AlertDescription>
          </Alert>

          <p className="mb-4 sm:mb-6 text-center text-sm sm:text-base">
            Our AI will analyze your face shape and recommend the most suitable eyeglasses styles that enhance your
            appearance and boost your confidence.
          </p>
          <Link href="/analyzer" passHref>
            <Button size="lg" className="px-6 sm:px-8 w-full sm:w-auto">
              Start Analysis
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
