import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" showText={false} />
          <h1 className="text-4xl font-bold mt-6 mb-2">wearables.ai</h1>
          <p className="text-muted-foreground">Find your perfect eyewear match</p>
        </div>

        <div className="w-full bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-2">Face Shape Analyzer</h2>
          <p className="text-muted-foreground mb-6">Discover eyeglasses that complement your unique facial features</p>

          <div className="bg-blue-950/30 border border-blue-900/50 rounded-md p-3 mb-6 flex items-start text-left">
            <ShieldCheck className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-100">
              Faces or facial features data/images are not stored in any way and we do not sell your privacy.
            </p>
          </div>

          <p className="text-sm mb-6">
            Our AI will analyze your face shape and recommend the most suitable eyeglasses styles that enhance your
            appearance and boost your confidence.
          </p>

          <Link href="/analyzer">
            <Button className="w-full" size="lg">
              Start Analysis
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
