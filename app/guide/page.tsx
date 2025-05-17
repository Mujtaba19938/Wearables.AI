"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Info, Camera, Upload, Check, AlertTriangle, ArrowRight } from "lucide-react"

export default function GuidePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  const totalSteps = 5
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  }

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      className="min-h-screen bg-background pb-32"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700 flex items-center group transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">Guide to Perfect Eyewear</h1>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
          <motion.div
            className="bg-blue-500 h-2.5 rounded-full"
            initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          ></motion.div>
        </div>

        {/* Step content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 card-gradient">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial="initial" animate="animate" exit="exit" variants={contentVariants}>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">Welcome to the Eyewear Guide</h2>
                  <p className="text-gray-700 dark:text-gray-300 text-pretty leading-relaxed mb-6">
                    Finding the perfect eyewear for your face shape is both an art and a science. This guide will walk
                    you through our process and help you understand how to get the most accurate results.
                  </p>
                  <div className="flex justify-center my-8">
                    <div className="relative w-full max-w-md h-52 sm:h-64 rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder-t4mxm.png"
                        alt="Person trying different eyeglass styles"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex items-start mt-6">
                    <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0 mr-3" />
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Our face analyzer uses advanced algorithms to determine your face shape and recommend the most
                      flattering eyewear styles.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">Preparing for Analysis</h2>
                  <p className="text-gray-700 dark:text-gray-300 text-pretty leading-relaxed mb-6">
                    To get the most accurate results, please follow these preparation tips before using our face
                    analyzer:
                  </p>
                  <ul className="space-y-4 mt-6">
                    {[
                      "Remove glasses, hats, and hair from your face",
                      "Ensure good, even lighting on your face",
                      "Look directly at the camera with a neutral expression",
                      "Position your face to fill most of the frame",
                      "Remove heavy makeup that might alter face contours",
                    ].map((tip, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 mr-3" />
                        <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="flex justify-center my-8">
                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                      <div className="relative h-40 rounded-lg overflow-hidden shadow-sm">
                        <Image src="/placeholder-4rrf5.png" alt="Good example" fill className="object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-center text-sm py-1 rounded-b-lg">
                          Good
                        </div>
                      </div>
                      <div className="relative h-40 rounded-lg overflow-hidden shadow-sm">
                        <Image src="/placeholder-p0lly.png" alt="Bad example" fill className="object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-center text-sm py-1 rounded-b-lg">
                          Avoid
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">Using the Face Analyzer</h2>
                  <p className="text-gray-700 dark:text-gray-300 text-pretty leading-relaxed mb-6">
                    Our face analyzer offers two convenient ways to analyze your face shape:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <motion.div
                      className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg shadow-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-3">
                          <Camera className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium">Camera Mode</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        Use your device's camera to take a photo in real-time for immediate analysis.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0 mr-2" />
                          <span>Quick and convenient</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0 mr-2" />
                          <span>Real-time guidance</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0 mr-2" />
                          <span>Instant results</span>
                        </li>
                      </ul>
                    </motion.div>

                    <motion.div
                      className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg shadow-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full mr-3">
                          <Upload className="w-5 h-5 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-medium">Upload Mode</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        Upload an existing photo from your device for analysis.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0 mr-2" />
                          <span>Use your best photo</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0 mr-2" />
                          <span>More control over image quality</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0 mr-2" />
                          <span>Works on all devices</span>
                        </li>
                      </ul>
                    </motion.div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg flex items-start mt-6">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0 mr-3" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Your privacy is important to us. All face analysis is performed locally on your device, and your
                      photos are never stored or sent to any server.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">Understanding Face Shapes</h2>
                  <p className="text-gray-700 dark:text-gray-300 text-pretty leading-relaxed mb-6">
                    Our analyzer identifies your face shape from these common types. Each shape has ideal frame styles
                    that complement its features:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {[
                      {
                        shape: "Oval",
                        description: "Balanced proportions with a slightly narrower jawline than forehead.",
                        frames: "Most styles work well, especially rectangular and square frames.",
                      },
                      {
                        shape: "Round",
                        description: "Similar width and length with soft curves and full cheeks.",
                        frames: "Angular, rectangular frames to add definition.",
                      },
                      {
                        shape: "Square",
                        description: "Strong jawline with a broad forehead and angular features.",
                        frames: "Round or oval frames to soften angles.",
                      },
                      {
                        shape: "Heart",
                        description: "Wider forehead and cheekbones with a narrow chin.",
                        frames: "Bottom-heavy frames or rimless styles.",
                      },
                      {
                        shape: "Diamond",
                        description: "Narrow forehead and jawline with wide cheekbones.",
                        frames: "Cat-eye or oval frames to highlight cheekbones.",
                      },
                      {
                        shape: "Rectangle",
                        description: "Long face with straight cheek lines.",
                        frames: "Frames with decorative temples or bold colors.",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">{item.shape}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>
                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          <span className="text-green-600 dark:text-green-400">Best frames:</span> {item.frames}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex items-start mt-6">
                    <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0 mr-3" />
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Our analyzer provides a confidence score for each face shape match, and may suggest alternative
                      shapes that could also work well for you.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">Try On and Explore</h2>
                  <p className="text-gray-700 dark:text-gray-300 text-pretty leading-relaxed mb-6">
                    After analyzing your face shape, you can explore recommended frames and try them on virtually:
                  </p>

                  <div className="space-y-6 mt-6">
                    {[
                      {
                        title: "Browse Recommendations",
                        description:
                          "View frames specifically recommended for your face shape, with detailed explanations of why they work for you.",
                      },
                      {
                        title: "Virtual Try-On",
                        description:
                          "Use our AR technology to see how different frames look on your face in real-time.",
                      },
                      {
                        title: "Save Favorites",
                        description:
                          "Save frames you like to your profile for future reference or to share with others.",
                      },
                      {
                        title: "Create Your Own 3D Models",
                        description:
                          "Use our 3D capture tool to create models of your own glasses and see how they look from every angle.",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                      >
                        <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 mr-4 flex-shrink-0">
                          <span className="flex items-center justify-center w-6 h-6 text-blue-600 dark:text-blue-200 font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center my-8">
                    <div className="relative w-full max-w-md h-52 sm:h-64 rounded-lg overflow-hidden shadow-sm">
                      <Image
                        src="/placeholder-e3hxj.png"
                        alt="AR glasses try-on demonstration"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <motion.div
                    className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg flex items-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0 mr-3" />
                    <p className="text-sm text-green-800 dark:text-green-200">
                      You're now ready to use our face analyzer and find your perfect eyewear! Click the button below to
                      get started.
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mb-20">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg flex items-center justify-center min-h-[48px] transition-colors ${
              currentStep === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center min-h-[48px] transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <Link
              href="/analyzer"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center justify-center min-h-[48px] transition-colors"
            >
              Start Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          )}
        </div>

        {/* Step indicators for mobile */}
        <div className="flex justify-center mt-6 sm:hidden">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                currentStep === index + 1 ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
