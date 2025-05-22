import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ResultCardProps {
  result: {
    id: string
    title: string
    description: string
    imageUrl?: string
    faceShape?: string
    recommendations?: string[]
  }
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <Card className="overflow-hidden">
      {result.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={result.imageUrl || "/placeholder.svg"} alt={result.title} className="object-cover w-full h-full" />
        </div>
      )}
      <CardHeader>
        <CardTitle>{result.title}</CardTitle>
        <CardDescription>{result.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {result.faceShape && (
          <div className="mb-2">
            <span className="font-semibold">Face Shape:</span> {result.faceShape}
          </div>
        )}
        {result.recommendations && result.recommendations.length > 0 && (
          <div>
            <span className="font-semibold">Recommendations:</span>
            <ul className="list-disc pl-5 mt-1">
              {result.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/frames?faceShape=${result.faceShape}`}>View Recommended Frames</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
