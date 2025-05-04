"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Glasses, Search, SlidersHorizontal, X } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import ARTryOn from "@/components/ar-try-on"
import { Logo } from "@/components/logo"

// Frame data with static image paths
const frames = [
  {
    id: 1,
    name: "Classic Wayfarer",
    description: "Timeless design with a slightly angular frame",
    price: "$129",
    image: "/frames/classic-wayfarer-black.png",
    faceShapes: ["Oval", "Round"],
    colors: ["Black", "Tortoise", "Blue"],
    category: "Casual",
    bestseller: true,
  },
  {
    id: 2,
    name: "Round Vintage",
    description: "Circular frames with a vintage feel",
    price: "$119",
    image: "/frames/round-vintage-gold.png",
    faceShapes: ["Square", "Heart"],
    colors: ["Gold", "Silver", "Black"],
    category: "Vintage",
  },
  {
    id: 3,
    name: "Cat-Eye Elegance",
    description: "Upswept frames with a retro vibe",
    price: "$139",
    image: "/frames/cat-eye-red.jpg",
    faceShapes: ["Diamond", "Oval"],
    colors: ["Red", "Black", "Tortoise"],
    category: "Fashion",
    bestseller: true,
  },
  {
    id: 4,
    name: "Modern Rectangle",
    description: "Structured frames with clean lines",
    price: "$109",
    image: "/frames/modern-rectangle-black.jpg",
    faceShapes: ["Round", "Heart"],
    colors: ["Black", "Blue", "Gray"],
    category: "Professional",
  },
  {
    id: 5,
    name: "Classic Aviator",
    description: "Timeless teardrop shape",
    price: "$149",
    image: "/frames/classic-aviator-gold.png",
    faceShapes: ["Oval", "Square"],
    colors: ["Gold", "Silver", "Black"],
    category: "Casual",
  },
  {
    id: 6,
    name: "Browline Scholar",
    description: "Semi-rimless style with bold upper frame",
    price: "$159",
    image: "/frames/browline-black.png",
    faceShapes: ["Diamond", "Heart"],
    colors: ["Black", "Brown", "Burgundy"],
    category: "Professional",
  },
  {
    id: 7,
    name: "Oversized Square",
    description: "Bold, large frames with a fashion-forward look",
    price: "$169",
    image: "/frames/oversized-square-black.png",
    faceShapes: ["Oval"],
    colors: ["Black", "Clear", "Tortoise"],
    category: "Fashion",
  },
  {
    id: 8,
    name: "Rimless Minimalist",
    description: "Subtle, frameless design for a barely-there look",
    price: "$189",
    image: "/frames/rimless-clear.png",
    faceShapes: ["Diamond", "Heart", "Oval"],
    colors: ["Clear", "Light Blue", "Light Pink"],
    category: "Professional",
  },
  {
    id: 9,
    name: "Geometric Hexagon",
    description: "Modern, angular frames with a unique shape",
    price: "$149",
    image: "/frames/geometric-hexagon-black.png",
    faceShapes: ["Round", "Oval"],
    colors: ["Black", "Gold", "Rose Gold"],
    category: "Fashion",
    bestseller: true,
  },
  {
    id: 10,
    name: "Thin Metal Round",
    description: "Lightweight circular frames with minimalist appeal",
    price: "$139",
    image: "/frames/thin-metal-round-silver.png",
    faceShapes: ["Square", "Heart", "Diamond"],
    colors: ["Silver", "Gold", "Rose Gold", "Black"],
    category: "Vintage",
  },
  {
    id: 11,
    name: "Bold Transparent",
    description: "Statement frames with clear acetate construction",
    price: "$129",
    image: "/frames/bold-transparent-clear.png",
    faceShapes: ["Oval", "Diamond"],
    colors: ["Clear", "Blue Clear", "Pink Clear"],
    category: "Fashion",
  },
  {
    id: 12,
    name: "Clubmaster Classic",
    description: "Iconic retro design with distinctive browline",
    price: "$159",
    image: "/frames/clubmaster-brown.png",
    faceShapes: ["Round", "Oval", "Diamond"],
    colors: ["Brown/Gold", "Black/Silver", "Tortoise/Gold"],
    category: "Vintage",
    bestseller: true,
  },
  {
    id: 13,
    name: "Slim Rectangle",
    description: "Narrow rectangular frames for a subtle look",
    price: "$119",
    image: "/frames/slim-rectangle-blue.png",
    faceShapes: ["Round", "Oval"],
    colors: ["Blue", "Black", "Burgundy"],
    category: "Professional",
  },
  {
    id: 14,
    name: "Sporty Wrap",
    description: "Curved frames designed for active lifestyles",
    price: "$149",
    image: "/frames/sporty-wrap-black.png",
    faceShapes: ["Oval", "Heart"],
    colors: ["Black", "Gray", "Navy"],
    category: "Casual",
  },
  {
    id: 15,
    name: "Retro Square",
    description: "Vintage-inspired square frames with character",
    price: "$139",
    image: "/frames/retro-square-tortoise.png",
    faceShapes: ["Round", "Heart"],
    colors: ["Tortoise", "Black", "Green"],
    category: "Vintage",
  },
  {
    id: 16,
    name: "Oval Wire",
    description: "Classic oval shape with thin metal construction",
    price: "$129",
    image: "/frames/oval-wire-gold.png",
    faceShapes: ["Square", "Diamond", "Heart"],
    colors: ["Gold", "Silver", "Bronze"],
    category: "Professional",
  },
  {
    id: 17,
    name: "Designer Cat-Eye",
    description: "Luxury cat-eye frames with decorative temples",
    price: "$199",
    image: "/frames/designer-cat-eye-black.png",
    faceShapes: ["Round", "Heart", "Oval"],
    colors: ["Black", "Tortoise", "Burgundy"],
    category: "Fashion",
    bestseller: true,
  },
  {
    id: 18,
    name: "Keyhole Bridge",
    description: "Distinctive keyhole bridge for a unique profile",
    price: "$149",
    image: "/frames/keyhole-bridge-tortoise.png",
    faceShapes: ["Oval", "Heart", "Diamond"],
    colors: ["Tortoise", "Black", "Navy"],
    category: "Vintage",
  },
  {
    id: 19,
    name: "Half-Rim Titanium",
    description: "Lightweight semi-rimless frames with titanium construction",
    price: "$179",
    image: "/placeholder.svg?key=zmd4a",
    faceShapes: ["Oval", "Heart", "Diamond"],
    colors: ["Silver", "Gunmetal", "Bronze"],
    category: "Professional",
  },
  {
    id: 20,
    name: "Wood Texture",
    description: "Eco-friendly frames with natural wood grain pattern",
    price: "$159",
    image: "/placeholder.svg?key=1jeff",
    faceShapes: ["Square", "Round", "Oval"],
    colors: ["Brown", "Dark Brown", "Black"],
    category: "Casual",
    bestseller: true,
  },
  {
    id: 21,
    name: "Clear Round Crystal",
    description: "Transparent frames with a modern minimalist design",
    price: "$129",
    image: "/placeholder.svg?key=jvi2w",
    faceShapes: ["Square", "Diamond", "Heart"],
    colors: ["Crystal", "Light Blue", "Rose"],
    category: "Fashion",
  },
  {
    id: 22,
    name: "Hexagonal Wire",
    description: "Geometric frames with thin metal construction",
    price: "$149",
    image: "/placeholder.svg?key=4vs5x",
    faceShapes: ["Round", "Oval", "Heart"],
    colors: ["Gold", "Silver", "Black"],
    category: "Fashion",
  },
  {
    id: 23,
    name: "Shield Sunglasses",
    description: "Bold oversized frames with gradient lenses",
    price: "$189",
    image: "/placeholder.svg?key=cv692",
    faceShapes: ["Oval", "Heart"],
    colors: ["Black/Gray", "Brown/Gold", "Blue/Silver"],
    category: "Fashion",
  },
  {
    id: 24,
    name: "Narrow Oval",
    description: "Slim profile frames with a subtle retro influence",
    price: "$139",
    image: "/placeholder.svg?height=400&width=600&query=slim narrow oval black eyeglasses frames",
    faceShapes: ["Square", "Diamond", "Round"],
    colors: ["Black", "Tortoise", "Navy"],
    category: "Vintage",
  },
  {
    id: 25,
    name: "Chunky Square",
    description: "Bold acetate frames with a statement look",
    price: "$169",
    image: "/placeholder.svg?height=400&width=600&query=chunky thick havana tortoise square eyeglasses frames",
    faceShapes: ["Oval", "Heart"],
    colors: ["Havana", "Black", "Tortoise"],
    category: "Fashion",
  },
  {
    id: 26,
    name: "Butterfly Frame",
    description: "Feminine silhouette with upswept corners",
    price: "$159",
    image: "/placeholder.svg?height=400&width=600&query=purple butterfly shaped eyeglasses frames with upswept corners",
    faceShapes: ["Round", "Square", "Heart"],
    colors: ["Purple", "Black", "Tortoise"],
    category: "Fashion",
    bestseller: true,
  },
]

// All available face shapes
const allFaceShapes = ["Oval", "Round", "Square", "Heart", "Diamond"]

// All available categories
const allCategories = ["All", "Casual", "Professional", "Fashion", "Vintage"]

export default function FramesPage() {
  const [selectedFrame, setSelectedFrame] = useState(null)
  const [filters, setFilters] = useState({
    faceShape: "All",
    category: "All",
    search: "",
    priceRange: "All",
  })
  const [showFilters, setShowFilters] = useState(false)

  // Filter frames based on selected filters
  const filteredFrames = frames.filter((frame) => {
    // Filter by face shape
    if (filters.faceShape !== "All" && !frame.faceShapes.includes(filters.faceShape)) {
      return false
    }

    // Filter by category
    if (filters.category !== "All" && frame.category !== filters.category) {
      return false
    }

    // Filter by search term
    if (
      filters.search &&
      !frame.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !frame.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }

    // Filter by price range
    if (filters.priceRange !== "All") {
      const price = Number.parseInt(frame.price.replace("$", ""))
      if (filters.priceRange === "Under $120" && price >= 120) {
        return false
      } else if (filters.priceRange === "$120-$150" && (price < 120 || price > 150)) {
        return false
      } else if (filters.priceRange === "Over $150" && price <= 150) {
        return false
      }
    }

    return true
  })

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    setFilters({
      faceShape: "All",
      category: "All",
      search: "",
      priceRange: "All",
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 pb-20">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Eyeglass Frames</h1>
            <p className="text-muted-foreground">Find the perfect frames for your face shape and style preference</p>
          </div>

          <Logo size="sm" />
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search frames..."
              className="pl-9 w-full md:w-[200px]"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Face Shape</label>
                    <Select value={filters.faceShape} onValueChange={(value) => handleFilterChange("faceShape", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Face Shapes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Face Shapes</SelectItem>
                        {allFaceShapes.map((shape) => (
                          <SelectItem key={shape} value={shape}>
                            {shape}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Price Range</label>
                    <Select
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange("priceRange", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Prices" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Prices</SelectItem>
                        <SelectItem value="Under $120">Under $120</SelectItem>
                        <SelectItem value="$120-$150">$120-$150</SelectItem>
                        <SelectItem value="Over $150">Over $150</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button variant="ghost" onClick={clearFilters} className="h-10">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredFrames.length === 0 ? (
          <div className="text-center py-12">
            <Glasses className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No frames found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters to see more options</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrames.map((frame) => (
              <Card key={frame.id} className="overflow-hidden flex flex-col">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={frame.image || "/placeholder.svg"}
                    alt={frame.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {frame.bestseller && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">Bestseller</Badge>
                  )}
                </div>
                <CardContent className="p-4 flex-grow">
                  <h3 className="font-medium text-lg">{frame.name}</h3>
                  <p className="text-sm text-muted-foreground">{frame.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {frame.faceShapes.map((shape) => (
                      <span key={shape} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {shape}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium">Available Colors:</p>
                    <div className="flex gap-1 mt-1">
                      {frame.colors.map((color) => (
                        <div
                          key={color}
                          className="w-6 h-6 rounded-full border"
                          style={{
                            backgroundColor:
                              color.toLowerCase() === "tortoise"
                                ? "#8B4513"
                                : color.toLowerCase() === "clear"
                                  ? "#f8f9fa"
                                  : color.toLowerCase(),
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <span className="font-bold">{frame.price}</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Glasses className="h-4 w-4" />
                        Try with AR
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] p-0">
                      <ARTryOn frame={frame} />
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
