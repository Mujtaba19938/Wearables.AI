"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronDown, Mail, Github, Twitter, ArrowRight, ExternalLink } from "lucide-react"
import { useTheme } from "next-themes"

export default function AboutPage() {
  const [openSection, setOpenSection] = useState<string | null>("about")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Set mounted state once component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  }

  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const contentVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  }

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header with back button and theme toggle */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back</span>
          </Link>

          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div variants={sectionVariants} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            About Face Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-pretty">
            Our mission is to make finding the perfect eyewear easier, more accurate, and more fun than ever before.
          </p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 card-gradient"
        >
          <div
            className="p-4 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection("about")}
          >
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">About the App</h2>
            <motion.div animate={{ rotate: openSection === "about" ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>

          <AnimatePresence initial={false}>
            {openSection === "about" && (
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Face Analyzer is an advanced web application designed to help you find the perfect eyewear for your
                    unique face shape. Using cutting-edge face detection and analysis technology, our app:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Analyzes your facial features to determine your face shape",
                      "Provides personalized eyewear recommendations based on your face shape",
                      "Offers virtual try-on capabilities with AR technology",
                      "Allows you to create 3D models of your own glasses",
                      "Works entirely in your browser with no data sent to servers",
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ArrowRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 card-gradient"
        >
          <div
            className="p-4 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection("technology")}
          >
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Technology</h2>
            <motion.div animate={{ rotate: openSection === "technology" ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>

          <AnimatePresence initial={false}>
            {openSection === "technology" && (
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Face Analyzer leverages several cutting-edge technologies:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Face-API.js",
                        description: "A JavaScript API for face detection and recognition in the browser",
                      },
                      {
                        title: "TensorFlow.js",
                        description: "Machine learning framework that powers our face analysis algorithms",
                      },
                      {
                        title: "WebXR",
                        description: "Enables augmented reality experiences for virtual try-on",
                      },
                      {
                        title: "Next.js",
                        description: "React framework for building fast, responsive web applications",
                      },
                      {
                        title: "Progressive Web App (PWA)",
                        description: "Allows installation on devices and offline functionality",
                      },
                      {
                        title: "Framer Motion",
                        description: "Animation library for creating smooth, interactive UI experiences",
                      },
                    ].map((tech, index) => (
                      <motion.div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">{tech.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{tech.description}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mt-4">
                    <p className="text-green-800 dark:text-green-200">
                      All processing happens locally on your device, ensuring your privacy and data security.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 card-gradient"
        >
          <div
            className="p-4 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection("faq")}
          >
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Frequently Asked Questions</h2>
            <motion.div animate={{ rotate: openSection === "faq" ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>

          <AnimatePresence initial={false}>
            {openSection === "faq" && (
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="overflow-hidden"
              >
                <div className="p-6 space-y-6">
                  {[
                    {
                      question: "Is my photo data secure?",
                      answer:
                        "Yes, absolutely. All face analysis happens directly on your device. Your photos are never uploaded to any server or stored permanently.",
                    },
                    {
                      question: "How accurate is the face shape analysis?",
                      answer:
                        "Our algorithm has been trained on thousands of face images and achieves high accuracy. However, factors like lighting, angle, and hair coverage can affect results. We provide confidence scores with each analysis.",
                    },
                    {
                      question: "Can I use this app offline?",
                      answer:
                        "Yes! Once you've loaded the app, it works as a Progressive Web App (PWA) that can function offline. The first time you use it, the necessary models will be downloaded and cached.",
                    },
                    {
                      question: "Does this work on all devices?",
                      answer:
                        "The app works on most modern browsers and devices. For the best experience, we recommend using Chrome, Edge, or Safari on devices less than 3-4 years old.",
                    },
                    {
                      question: "How does the AR try-on work?",
                      answer:
                        "We use WebXR and face tracking technology to position virtual glasses on your face in real-time. This allows you to see how different frames would look on you before making a purchase.",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{item.question}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{item.answer}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden card-gradient"
        >
          <div
            className="p-4 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection("contact")}
          >
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Contact Us</h2>
            <motion.div animate={{ rotate: openSection === "contact" ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>

          <AnimatePresence initial={false}>
            {openSection === "contact" && (
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="overflow-hidden"
              >
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Have questions, feedback, or suggestions? We'd love to hear from you! Reach out to us through any of
                    the following channels:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <motion.a
                      href="mailto:contact@faceanalyzer.app"
                      className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mr-4">
                        <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Email Us</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
                          contact@faceanalyzer.app
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>

                    <motion.a
                      href="https://github.com/faceanalyzer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-full mr-4">
                        <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">GitHub</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
                          github.com/faceanalyzer
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>

                    <motion.a
                      href="https://twitter.com/faceanalyzer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mr-4">
                        <Twitter className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Twitter</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline">@faceanalyzer</p>
                      </div>
                      <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Send us a message</h3>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        ></textarea>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="privacy"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          I agree to the{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </a>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Team section */}
        <motion.div
          variants={sectionVariants}
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Made with ❤️ by the Face Analyzer Team
            <br />© 2023 Face Analyzer. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
