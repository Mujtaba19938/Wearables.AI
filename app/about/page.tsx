"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronDown, Mail, Github, Twitter } from "lucide-react"

export default function AboutPage() {
  const [openSection, setOpenSection] = useState<string | null>("about")

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/" className="text-blue-500 hover:text-blue-700 flex items-center">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-center flex-grow">About Face Analyzer</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
        <div
          className="p-4 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection("about")}
        >
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">About the App</h2>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${openSection === "about" ? "transform rotate-180" : ""}`}
          />
        </div>

        {openSection === "about" && (
          <div className="p-6 space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Face Analyzer is an advanced web application designed to help you find the perfect eyewear for your unique
              face shape. Using cutting-edge face detection and analysis technology, our app:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Analyzes your facial features to determine your face shape</li>
              <li>Provides personalized eyewear recommendations based on your face shape</li>
              <li>Offers virtual try-on capabilities with AR technology</li>
              <li>Allows you to create 3D models of your own glasses</li>
              <li>Works entirely in your browser with no data sent to servers</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              Our mission is to make finding the perfect eyewear easier, more accurate, and more fun than ever before.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
        <div
          className="p-4 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection("technology")}
        >
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Technology</h2>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${openSection === "technology" ? "transform rotate-180" : ""}`}
          />
        </div>

        {openSection === "technology" && (
          <div className="p-6 space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Face Analyzer leverages several cutting-edge technologies:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <span className="font-semibold">Face-API.js:</span> A JavaScript API for face detection and recognition
                in the browser
              </li>
              <li>
                <span className="font-semibold">TensorFlow.js:</span> Machine learning framework that powers our face
                analysis algorithms
              </li>
              <li>
                <span className="font-semibold">WebXR:</span> Enables augmented reality experiences for virtual try-on
              </li>
              <li>
                <span className="font-semibold">Next.js:</span> React framework for building fast, responsive web
                applications
              </li>
              <li>
                <span className="font-semibold">Progressive Web App (PWA):</span> Allows installation on devices and
                offline functionality
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              All processing happens locally on your device, ensuring your privacy and data security.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
        <div
          className="p-4 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection("faq")}
        >
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Frequently Asked Questions</h2>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${openSection === "faq" ? "transform rotate-180" : ""}`}
          />
        </div>

        {openSection === "faq" && (
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
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{item.question}</h3>
                <p className="text-gray-700 dark:text-gray-300">{item.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div
          className="p-4 bg-blue-50 dark:bg-blue-900/30 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection("contact")}
        >
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Contact Us</h2>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${openSection === "contact" ? "transform rotate-180" : ""}`}
          />
        </div>

        {openSection === "contact" && (
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Have questions, feedback, or suggestions? We'd love to hear from you! Reach out to us through any of the
              following channels:
            </p>

            <div className="space-y-4">
              <a
                href="mailto:contact@faceanalyzer.app"
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Mail className="w-5 h-5 mr-3" />
                <span>contact@faceanalyzer.app</span>
              </a>

              <a
                href="https://github.com/faceanalyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Github className="w-5 h-5 mr-3" />
                <span>GitHub</span>
              </a>

              <a
                href="https://twitter.com/faceanalyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Twitter className="w-5 h-5 mr-3" />
                <span>Twitter</span>
              </a>
            </div>

            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
