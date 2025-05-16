"use client"

import { useState } from "react"
import Frame3DCaptureModal from "../components/frame-3d-capture-modal"
import AnimationStyleButton from "../components/animation-style-button"
import ThemeToggle from "../components/theme-toggle"
import SubscribeButton from "../components/subscribe-button"

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
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 max-w-md w-full text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-8 mb-6">wearables.ai</h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-16">Find your perfect eyewear match</p>

          <div className="card-gradient p-8 sm:p-10 rounded-xl w-full shadow-lg border border-primary/10 mt-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Face Shape Analyzer</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-12">
              Discover eyeglasses that complement your unique facial features
            </p>

            <div className="privacy-badge mb-12">
              <div className="privacy-badge-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Faces or facial features data/images are not stored in any way and we do not sell your privacy.
              </p>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground mb-16">
              Our AI will analyze your face shape and recommend the most suitable eyeglasses styles that enhance your
              appearance and boost your confidence.
            </p>

            <a
              href="/analyzer"
              className="inline-block w-full button-primary text-center py-4 text-lg font-medium relative overflow-hidden group mt-4"
            >
              <span className="relative z-10">Start Analysis</span>
              <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </a>
          </div>
        </div>

        {/* Animation style button at the bottom center */}
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-40">
          <AnimationStyleButton />
        </div>

        <Frame3DCaptureModal isOpen={isModalOpen} onClose={handleCloseModal} onModelCreated={handleModelCreated} />
      </main>
    </>
  )
}
