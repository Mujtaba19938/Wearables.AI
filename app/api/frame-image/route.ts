import { NextResponse } from "next/server"
import { generateFrameImage } from "@/utils/image-generator"

export async function POST(request: Request) {
  try {
    const { frameName, frameStyle, color } = await request.json()

    if (!frameName || !frameStyle || !color) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Generate or retrieve the image using the placeholder system
    const imagePath = await generateFrameImage(frameName, frameStyle, color)

    return NextResponse.json({ imagePath })
  } catch (error) {
    console.error("Error handling frame image request:", error)
    // Return a placeholder in case of error
    return NextResponse.json(
      {
        error: "Internal server error",
        imagePath: `/placeholder.svg?height=600&width=600&query=eyeglasses frames`,
      },
      { status: 200 },
    )
  }
}
