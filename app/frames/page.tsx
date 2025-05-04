"use client"

import { useState, useEffect } from "react"
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

// Frame data with updated image paths
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
    image: "/placeholder.svg?key=oxenq",
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
    image: "/placeholder.svg?key=6chyu",
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
    image: "/placeholder.svg?key=7ska8",
    faceShapes: ["Diamond", "Heart"],
    colors: ["Black", "Brown", "Burgundy"],
    category: "Professional",
  },
  {
    id: 7,
    name: "Oversized Square",
    description: "Bold, large frames with a fashion-forward look",
    price: "$169",
    image: "/placeholder.svg?key=46u8z",
    faceShapes: ["Oval"],
    colors: ["Black", "Clear", "Tortoise"],
    category: "Fashion",
  },
  {
    id: 8,
    name: "Rimless Minimalist",
    description: "Subtle, frameless design for a barely-there look",
    price: "$189",
    image: "/placeholder.svg?key=3q3uq",
    faceShapes: ["Diamond", "Heart", "Oval"],
    colors: ["Clear", "Light Blue", "Light Pink"],
    category: "Professional",
  },
  {
    id: 9,
    name: "Geometric Hexagon",
    description: "Modern, angular frames with a unique shape",
    price: "$149",
    image: "/placeholder.svg?height=600&width=600&query=black geometric hexagon eyeglasses frames on white background",
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
    image: "/placeholder.svg?height=600&width=600&query=silver thin metal round eyeglasses frames on white background",
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
    image: "/placeholder.svg?height=600&width=600&query=brown clubmaster classic eyeglasses frames on white background",
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
    image: "/placeholder.svg?height=600&width=600&query=blue slim rectangle eyeglasses frames on white background",
    faceShapes: ["Round", "Oval"],
    colors: ["Blue", "Black", "Burgundy"],
    category: "Professional",
  },
  {
    id: 14,
    name: "Sporty Wrap",
    description: "Curved frames designed for active lifestyles",
    price: "$149",
    image: "/placeholder.svg?height=600&width=600&query=black sporty wrap eyeglasses frames on white background",
    faceShapes: ["Oval", "Heart"],
    colors: ["Black", "Gray", "Navy"],
    category: "Casual",
  },
  {
    id: 15,
    name: "Retro Square",
    description: "Vintage-inspired square frames with character",
    price: "$139",
    image: "/placeholder.svg?height=600&width=600&query=tortoise retro square eyeglasses frames on white background",
    faceShapes: ["Round", "Heart"],
    colors: ["Tortoise", "Black", "Green"],
    category: "Vintage",
  },
  {
    id: 16,
    name: "Oval Wire",
    description: "Classic oval shape with thin metal construction",
    price: "$129",
    image: "/placeholder.svg?height=600&width=600&query=gold oval wire eyeglasses frames on white background",
    faceShapes: ["Square", "Diamond", "Heart"],
    colors: ["Gold", "Silver", "Bronze"],
    category: "Professional",
  },
  {
    id: 17,
    name: "Designer Cat-Eye",
    description: "Luxury cat-eye frames with decorative temples",
    price: "$199",
    image: "/placeholder.svg?height=600&width=600&query=black designer cat eye eyeglasses frames on white background",
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
    image: "/placeholder.svg?height=600&width=600&query=tortoise keyhole bridge eyeglasses frames on white background",
    faceShapes: ["Oval", "Heart", "Diamond"],
    colors: ["Tortoise", "Black", "Navy"],
    category: "Vintage",
  },
  {
    id: 19,
    name: "Half-Rim Titanium",
    description: "Lightweight semi-rimless frames with titanium construction",
    price: "$179",
    image: "/placeholder.svg?height=600&width=600&query=silver half rim titanium eyeglasses frames on white background",
    faceShapes: ["Oval", "Heart", "Diamond"],
    colors: ["Silver", "Gunmetal", "Bronze"],
    category: "Professional",
  },
  {
    id: 20,
    name: "Wood Texture",
    description: "Eco-friendly frames with natural wood grain pattern",
    price: "$159",
    image: "/placeholder.svg?height=600&width=600&query=brown wood texture eyeglasses frames on white background",
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
    image: "/placeholder.svg?height=600&width=600&query=crystal clear round eyeglasses frames on white background",
    faceShapes: ["Square", "Diamond", "Heart"],
    colors: ["Crystal", "Light Blue", "Rose"],
    category: "Fashion",
  },
  {
    id: 22,
    name: "Hexagonal Wire",
    description: "Geometric frames with thin metal construction",
    price: "$149",
    image: "/placeholder.svg?height=600&width=600&query=gold hexagonal wire eyeglasses frames on white background",
    faceShapes: ["Round", "Oval", "Heart"],
    colors: ["Gold", "Silver", "Black"],
    category: "Fashion",
  },
  {
    id: 23,
    name: "Shield Sunglasses",
    description: "Bold oversized frames with gradient lenses",
    price: "$189",
    image:
      "/placeholder.svg?height=600&width=600&query=black shield sunglasses with gradient lenses on white background",
    faceShapes: ["Oval", "Heart"],
    colors: ["Black/Gray", "Brown/Gold", "Blue/Silver"],
    category: "Fashion",
  },
  {
    id: 24,
    name: "Narrow Oval",
    description: "Slim profile frames with a subtle retro influence",
    price: "$139",
    image: "/placeholder.svg?height=600&width=600&query=black narrow oval eyeglasses frames on white background",
    faceShapes: ["Square", "Diamond", "Round"],
    colors: ["Black", "Tortoise", "Navy"],
    category: "Vintage",
  },
  {
    id: 25,
    name: "Chunky Square",
    description: "Bold acetate frames with a statement look",
    price: "$169",
    image: "/placeholder.svg?height=600&width=600&query=havana chunky square eyeglasses frames on white background",
    faceShapes: ["Oval", "Heart"],
    colors: ["Havana", "Black", "Tortoise"],
    category: "Fashion",
  },
  {
    id: 26,
    name: "Butterfly Frame",
    description: "Feminine silhouette with upswept corners",
    price: "$159",
    image: "/frames/butterfly-frame-purple.png",
    faceShapes: ["Round", "Square", "Heart"],
    colors: ["Purple", "Black", "Tortoise"],
    category: "Fashion",
    bestseller: true,
  },
  {
    id: 27,
    name: "Retro Wayfarer",
    description: "Classic design with a modern twist and bold accents",
    price: "$135",
    image: "/placeholder.svg?height=600&width=600&query=black retro wayfarer eyeglasses frames on white background",
    faceShapes: ["Oval", "Round", "Square"],
    colors: ["Black", "Tortoise", "Navy"],
    category: "Casual",
  },
  {
    id: 28,
    name: "Circular Vintage",
    description: "Perfect round frames with antique metal finish",
    price: "$125",
    image: "/placeholder.svg?height=600&width=600&query=gold circular vintage eyeglasses frames on white background",
    faceShapes: ["Square", "Heart", "Diamond"],
    colors: ["Gold", "Silver", "Bronze"],
    category: "Vintage",
    bestseller: true,
  },
  {
    id: 29,
    name: "Modern Cat-Eye",
    description: "Contemporary take on the classic upswept style",
    price: "$145",
    image: "/placeholder.svg?height=600&width=600&query=black modern cat eye eyeglasses frames on white background",
    faceShapes: ["Diamond", "Oval", "Heart"],
    colors: ["Black", "Red", "Tortoise"],
    category: "Fashion",
  },
  {
    id: 30,
    name: "Slim Rectangular",
    description: "Sleek frames with refined proportions and clean edges",
    price: "$115",
    image: "/placeholder.svg?height=600&width=600&query=gray slim rectangular eyeglasses frames on white background",
    faceShapes: ["Round", "Oval", "Heart"],
    colors: ["Gray", "Black", "Navy"],
    category: "Professional",
  },
  {
    id: 31,
    name: "Pilot Aviator",
    description: "Classic pilot style with double bridge detail",
    price: "$155",
    image: "/placeholder.svg?height=600&width=600&query=silver pilot aviator eyeglasses frames on white background",
    faceShapes: ["Oval", "Square", "Heart"],
    colors: ["Silver", "Gold", "Gunmetal"],
    category: "Casual",
  },
  {
    id: 32,
    name: "Modern Browline",
    description: "Contemporary take on the classic half-rim design",
    price: "$165",
    image: "/placeholder.svg?height=600&width=600&query=black modern browline eyeglasses frames on white background",
    faceShapes: ["Diamond", "Heart", "Oval"],
    colors: ["Black", "Tortoise", "Burgundy"],
    category: "Professional",
  },
  {
    id: 33,
    name: "Oversized Round",
    description: "Statement-making large circular frames",
    price: "$139",
    image: "/placeholder.svg?height=600&width=600&query=tortoise oversized round eyeglasses frames on white background",
    faceShapes: ["Square", "Diamond"],
    colors: ["Tortoise", "Black", "Clear"],
    category: "Fashion",
  },
  {
    id: 34,
    name: "Ultra-Light Rimless",
    description: "Nearly invisible frames with premium lens mounting",
    price: "$199",
    image:
      "/placeholder.svg?height=600&width=600&query=clear ultra light rimless eyeglasses frames on white background",
    faceShapes: ["Oval", "Heart", "Diamond", "Round"],
    colors: ["Clear", "Gold Accent", "Silver Accent"],
    category: "Professional",
  },
  {
    id: 35,
    name: "Geometric Pentagon",
    description: "Unique five-sided frames for the fashion-forward",
    price: "$159",
    image: "/placeholder.svg?height=600&width=600&query=black geometric pentagon eyeglasses frames on white background",
    faceShapes: ["Round", "Oval"],
    colors: ["Black", "Gold", "Tortoise"],
    category: "Fashion",
  },
  {
    id: 36,
    name: "Wire Round Classic",
    description: "Timeless thin metal frames with vintage appeal",
    price: "$129",
    image: "/placeholder.svg?height=600&width=600&query=gold wire round classic eyeglasses frames on white background",
    faceShapes: ["Square", "Diamond", "Heart"],
    colors: ["Gold", "Silver", "Black"],
    category: "Vintage",
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
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<number, boolean>>({})

  // Track image loading errors
  useEffect(() => {
    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement
      console.error(`Image failed to load: ${target.src}`)
    }

    window.addEventListener("error", handleImageError, true)

    return () => {
      window.removeEventListener("error", handleImageError, true)
    }
  }, [])

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

  const handleImageError = (frameId: number) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [frameId]: true,
    }))
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
                    src={
                      imageLoadErrors[frame.id]
                        ? `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(frame.name + " eyeglasses frames")}`
                        : frame.image
                    }
                    alt={frame.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={() => handleImageError(frame.id)}
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
                                  : color.toLowerCase() === "havana"
                                    ? "#5D4037"
                                    : color.toLowerCase() === "gunmetal"
                                      ? "#484848"
                                      : color.toLowerCase() === "bronze"
                                        ? "#CD7F32"
                                        : color.toLowerCase() === "burgundy"
                                          ? "#800020"
                                          : color.toLowerCase() === "navy"
                                            ? "#000080"
                                            : color.toLowerCase() === "rose gold"
                                              ? "#B76E79"
                                              : color.toLowerCase().includes("/")
                                                ? color.toLowerCase().split("/")[0]
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
