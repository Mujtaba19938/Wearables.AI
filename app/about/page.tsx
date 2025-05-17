"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronDown,
  Mail,
  Github,
  Twitter,
  ArrowRight,
  ExternalLink,
  Shield,
  Zap,
  Smartphone,
  Eye,
  Download,
} from "lucide-react"

export default function AboutPage() {
  const [openSections, setOpenSections] = useState<string[]>(["about"])
  const accordionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const isSectionOpen = (section: string) => openSections.includes(section)

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, section: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggleSection(section)
    }
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  }

  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const contentVariants = {
    initial: { opacity: 0, height: 0 },
    animate: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  // Scroll to section when opened
  useEffect(() => {
    if (openSections.length > 0) {
      const lastOpenedSection = openSections[openSections.length - 1]
      const ref = accordionRefs.current[lastOpenedSection]

      if (ref) {
        // Small delay to allow animation to start
        setTimeout(() => {
          ref.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
      }
    }
  }, [openSections])

  return (
    <motion.div
      className="min-h-screen bg-background pb-32"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header with back button and theme toggle */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40 py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="flex items-center text-primary hover:text-primary/80 transition-colors group"
            aria-label="Back to home"
          >
            <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div variants={sectionVariants} className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            About Face Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-pretty text-lg leading-relaxed">
            Our mission is to make finding the perfect eyewear easier, more accurate, and more fun than ever before.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* About the App Section */}
          <motion.div
            ref={(el) => (accordionRefs.current["about"] = el)}
            variants={sectionVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden card-gradient"
          >
            <div
              className="p-5 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection("about")}
              onKeyDown={(e) => handleKeyDown(e, "about")}
              tabIndex={0}
              role="button"
              aria-expanded={isSectionOpen("about")}
              aria-controls="about-content"
            >
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">About the App</h2>
              <motion.div
                animate={{ rotate: isSectionOpen("about") ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-700 rounded-full p-1"
              >
                <ChevronDown className="w-5 h-5 text-blue-500 dark:text-blue-300" />
              </motion.div>
            </div>

            <AnimatePresence initial={false}>
              {isSectionOpen("about") && (
                <motion.div
                  id="about-content"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="overflow-hidden"
                  role="region"
                >
                  <div className="p-6 space-y-6">
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      Face Analyzer is an advanced web application designed to help you find the perfect eyewear for
                      your unique face shape. Using cutting-edge face detection and analysis technology, our app:
                    </p>
                    <ul className="space-y-4">
                      {[
                        {
                          icon: <Eye className="w-5 h-5 text-blue-500 flex-shrink-0" />,
                          text: "<strong>Analyzes</strong> your facial features to determine your face shape",
                        },
                        {
                          icon: <Zap className="w-5 h-5 text-blue-500 flex-shrink-0" />,
                          text: "<strong>Provides</strong> personalized eyewear recommendations based on your face shape",
                        },
                        {
                          icon: <Smartphone className="w-5 h-5 text-blue-500 flex-shrink-0" />,
                          text: "<strong>Offers</strong> virtual try-on capabilities with AR technology",
                        },
                        {
                          icon: <Download className="w-5 h-5 text-blue-500 flex-shrink-0" />,
                          text: "<strong>Allows</strong> you to create 3D models of your own glasses",
                        },
                        {
                          icon: <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />,
                          text: "<strong>Works</strong> entirely in your browser with no data sent to servers",
                        },
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          className="flex items-start gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="mt-0.5">{item.icon}</div>
                          <div
                            className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item.text }}
                          />
                        </motion.li>
                      ))}
                    </ul>

                    <div className="mt-8 flex justify-center">
                      <Link
                        href="/analyzer"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        Get started with your facial scan
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Technology Section */}
          <motion.div
            ref={(el) => (accordionRefs.current["technology"] = el)}
            variants={sectionVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden card-gradient"
          >
            <div
              className="p-5 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection("technology")}
              onKeyDown={(e) => handleKeyDown(e, "technology")}
              tabIndex={0}
              role="button"
              aria-expanded={isSectionOpen("technology")}
              aria-controls="technology-content"
            >
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Technology</h2>
              <motion.div
                animate={{ rotate: isSectionOpen("technology") ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-700 rounded-full p-1"
              >
                <ChevronDown className="w-5 h-5 text-blue-500 dark:text-blue-300" />
              </motion.div>
            </div>

            <AnimatePresence initial={false}>
              {isSectionOpen("technology") && (
                <motion.div
                  id="technology-content"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="overflow-hidden"
                  role="region"
                >
                  <div className="p-6 space-y-6">
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      Face Analyzer leverages several cutting-edge technologies:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                          className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -2 }}
                        >
                          <h3 className="font-semibold text-blue-600 dark:text-blue-400 text-lg mb-2">{tech.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tech.description}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg shadow-sm mt-6">
                      <p className="text-green-800 dark:text-green-200 text-lg flex items-center gap-3">
                        <Shield className="w-5 h-5 flex-shrink-0" />
                        <span>
                          All processing happens locally on your device, ensuring your privacy and data security.
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            ref={(el) => (accordionRefs.current["faq"] = el)}
            variants={sectionVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden card-gradient"
          >
            <div
              className="p-5 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection("faq")}
              onKeyDown={(e) => handleKeyDown(e, "faq")}
              tabIndex={0}
              role="button"
              aria-expanded={isSectionOpen("faq")}
              aria-controls="faq-content"
            >
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Frequently Asked Questions</h2>
              <motion.div
                animate={{ rotate: isSectionOpen("faq") ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-700 rounded-full p-1"
              >
                <ChevronDown className="w-5 h-5 text-blue-500 dark:text-blue-300" />
              </motion.div>
            </div>

            <AnimatePresence initial={false}>
              {isSectionOpen("faq") && (
                <motion.div
                  id="faq-content"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="overflow-hidden"
                  role="region"
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
                        className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">{item.question}</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{item.answer}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Us Section */}
          <motion.div
            ref={(el) => (accordionRefs.current["contact"] = el)}
            variants={sectionVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden card-gradient"
          >
            <div
              className="p-5 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection("contact")}
              onKeyDown={(e) => handleKeyDown(e, "contact")}
              tabIndex={0}
              role="button"
              aria-expanded={isSectionOpen("contact")}
              aria-controls="contact-content"
            >
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Contact Us</h2>
              <motion.div
                animate={{ rotate: isSectionOpen("contact") ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-700 rounded-full p-1"
              >
                <ChevronDown className="w-5 h-5 text-blue-500 dark:text-blue-300" />
              </motion.div>
            </div>

            <AnimatePresence initial={false}>
              {isSectionOpen("contact") && (
                <motion.div
                  id="contact-content"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="overflow-hidden"
                  role="region"
                >
                  <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                      Have questions, feedback, or suggestions? We'd love to hear from you! Reach out to us through any
                      of the following channels:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <motion.a
                        href="mailto:contact@faceanalyzer.app"
                        className="flex items-center p-5 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group shadow-sm hover:shadow-md"
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mr-4">
                          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1 text-lg">Email Us</h3>
                          <p className="text-blue-600 dark:text-blue-400 group-hover:underline">
                            contact@faceanalyzer.app
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.a>

                      <motion.a
                        href="https://github.com/faceanalyzer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-5 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group shadow-sm hover:shadow-md"
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-full mr-4">
                          <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1 text-lg">GitHub</h3>
                          <p className="text-blue-600 dark:text-blue-400 group-hover:underline">
                            github.com/faceanalyzer
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.a>

                      <motion.a
                        href="https://twitter.com/faceanalyzer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-5 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group shadow-sm hover:shadow-md"
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mr-4">
                          <Twitter className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1 text-lg">Twitter</h3>
                          <p className="text-blue-600 dark:text-blue-400 group-hover:underline">@faceanalyzer</p>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                      <h3 className="text-xl font-medium mb-5">Send us a message</h3>
                      <form className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Subject
                          </label>
                          <input
                            type="text"
                            id="subject"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Message
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          ></textarea>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="privacy"
                            type="checkbox"
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="privacy" className="ml-3 block text-gray-700 dark:text-gray-300">
                            I agree to the{" "}
                            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                              Privacy Policy
                            </Link>
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm hover:shadow-md"
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
        </div>

        {/* Team section */}
        <motion.div
          variants={sectionVariants}
          className="mt-12 text-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-700 dark:text-gray-300 text-base">
            Made with ❤️ by the Face Analyzer Team
            <br />© 2023 Face Analyzer. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/privacy-policy" className="text-sm text-primary hover:underline flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-primary hover:underline flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="text-sm text-primary hover:underline flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="8" cy="8" r="1"></circle>
                <circle cx="16" cy="8" r="1"></circle>
                <circle cx="12" cy="16" r="1"></circle>
              </svg>
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
