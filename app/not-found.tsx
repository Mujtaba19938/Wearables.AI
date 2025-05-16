"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Home } from "lucide-react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a simple server-side compatible version
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-8 text-muted-foreground">The page you are looking for doesn't exist.</p>
        <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          Return Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-8 text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>

        <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Return Home
        </Link>
      </motion.div>
    </div>
  )
}
