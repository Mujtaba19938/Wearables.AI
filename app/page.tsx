"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Glasses, Shield, ChevronRight } from "lucide-react"
import AnimationStyleButton from "@/components/animation-style-button"
import Frame3DCaptureModal from "@/components/frame-3d-capture-modal"
import ThemeToggle from "@/components/theme-toggle"
import SubscribeButton from "@/components/subscribe-button"
import ProfileModal from "@/components/profile-modal"
import AnimatedBackground from "@/components/animated-background"

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleModelCreated = (url: string) => {
    setIsModalOpen(false)
  }

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen)
  }

  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Theme toggle in top left */}
      <ThemeToggle />

      {/* Subscribe button in top right */}
      <SubscribeButton />

      <main className="flex min-h-screen flex-col items-center justify-center p-6 pb-28 bg-slate-50/70 dark:bg-[#0f172a]/80 backdrop-blur-[2px] text-slate-900 dark:text-white">
        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              wearables.ai
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300">Find your perfect eyewear match</p>
          </div>

          {/* Main Card */}
          <motion.div
            className="bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-[2px] p-6 rounded-2xl w-full shadow-xl border border-slate-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Face Shape Analyzer</h2>

            <div className="flex flex-col gap-6">
              {/* Feature points */}
              <div className="space-y-4">
                {[
                  "Discover your unique face shape",
                  "Get personalized eyewear recommendations",
                  "Try frames virtually with AR technology",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-slate-100/80 dark:bg-[#2d3748]/80 backdrop-blur-[2px] p-3 rounded-lg"
                  >
                    <div className="bg-blue-100 dark:bg-blue-500/20 rounded-full p-1.5 flex-shrink-0">
                      <ChevronRight className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 dark:text-gray-200">{feature}</p>
                  </div>
                ))}
              </div>

              {/* Privacy badge */}
              <div className="flex items-start gap-3 bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-[2px] p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 my-2">
                <div className="bg-blue-500 rounded-full p-1.5 mt-0.5 flex-shrink-0">
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
              className="group relative w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg mt-6 font-medium transition-colors"
            >
              <Glasses className="h-5 w-5" />
              <span>Start Analysis</span>
            </Link>
          </motion.div>

          {/* Additional Info with Animation Button */}
          <motion.div
            className="mt-8 text-center text-sm text-slate-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span>Advanced AI-powered</span>
              <AnimationStyleButton />
              <span>face analysis technology</span>
            </div>
            <p>
              <Link href="/guide" className="text-blue-500 dark:text-blue-400 hover:underline">
                Learn how it works
              </Link>
            </p>
          </motion.div>
        </motion.div>

        <Frame3DCaptureModal isOpen={isModalOpen} onClose={handleCloseModal} onModelCreated={handleModelCreated} />
        <ProfileModal isOpen={isProfileModalOpen} onClose={toggleProfileModal} />
      </main>
    </>
  )
}
