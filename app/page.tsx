"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Frame3DCaptureModal from "../components/frame-3d-capture-modal"
import AnimationStyleButton from "../components/animation-style-button"
import ThemeToggle from "../components/theme-toggle"
import SubscribeButton from "../components/subscribe-button"
import { Shield, Glasses, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modelUrl, setModelUrl] = useState<string | null>(null)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleModelCreated = (url: string) => {
    setModelUrl(url)
    setIsModalOpen(false)
  }

  return (
    <>
      {/* Theme toggle in top left */}
      <div className="fixed top-4 left-4 z-50">
        <ThemeToggle />
      </div>

      {/* Subscribe button in top right */}
      <div className="fixed top-4 right-4 z-50">
        <SubscribeButton />
      </div>

      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 pb-24">
        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo and Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              wearables.ai
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">Find your perfect eyewear match</p>
          </div>

          {/* Main Card */}
          <motion.div
            className="card-gradient p-6 sm:p-8 rounded-2xl w-full shadow-xl border border-primary/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Face Shape Analyzer</h2>

            <div className="space-y-6 mb-8">
              {/* Feature points */}
              <div className="space-y-3">
                {[
                  "Discover your unique face shape",
                  "Get personalized eyewear recommendations",
                  "Try frames virtually with AR technology",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 bg-primary/5 p-3 rounded-lg">
                    <div className="bg-primary/10 rounded-full p-1">
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm sm:text-base">{feature}</p>
                  </div>
                ))}
              </div>

              {/* Privacy badge */}
              <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <div className="bg-blue-500 rounded-full p-1 mt-0.5 flex-shrink-0">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                  <strong>Privacy Guaranteed:</strong> Your facial data is processed locally on your device and is never
                  stored or transmitted to any server.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/analyzer"
              className="group relative w-full flex items-center justify-center gap-2 button-primary py-4 text-lg font-medium overflow-hidden"
            >
              <Glasses className="h-5 w-5" />
              <span>Start Analysis</span>
              <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            className="mt-6 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p>Advanced AI-powered face analysis technology</p>
            <p className="mt-1">
              <Link href="/guide" className="text-primary hover:underline">
                Learn how it works
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Animation style button at the bottom center */}
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-40">
          <AnimationStyleButton />
        </div>

        <Frame3DCaptureModal isOpen={isModalOpen} onClose={handleCloseModal} onModelCreated={handleModelCreated} />
      </main>
    </>
  )
}
