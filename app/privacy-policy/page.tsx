"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, Shield, Eye, Lock, Server, FileText, Bell } from "lucide-react"
import { useTheme } from "next-themes"

export default function PrivacyPolicyPage() {
  const { theme, setTheme } = useTheme()

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
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div variants={sectionVariants} className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Last updated: May 17, 2025</p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="prose prose-lg dark:prose-invert max-w-none mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 card-gradient"
        >
          <div className="space-y-8">
            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Eye className="mr-3 h-6 w-6 text-blue-500" />
                Introduction
              </h2>
              <p>
                Welcome to Face Shape Analyzer ("we," "our," or "us"). We respect your privacy and are committed to
                protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you use our Face Shape Analyzer application.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
                please do not access the application.
              </p>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <FileText className="mr-3 h-6 w-6 text-blue-500" />
                Information We Collect
              </h2>
              <h3 className="text-xl font-semibold mb-2">Facial Images and Analysis Data</h3>
              <p>
                When you use our Face Shape Analyzer, we process facial images that you provide through your device's
                camera or by uploading images. These images are used to analyze your face shape and provide personalized
                eyewear recommendations.
              </p>
              <p>
                <strong>Important:</strong> All facial image processing is performed locally on your device. Your facial
                images are not transmitted to our servers or stored permanently.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">Device Information</h3>
              <p>
                We may collect information about your device, including device type, operating system, browser type, and
                screen resolution. This information helps us optimize your experience with our application.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">Usage Information</h3>
              <p>
                We may collect information about how you use our application, such as the features you access, the time
                spent on the application, and any errors encountered. This information helps us improve our application
                and troubleshoot issues.
              </p>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Server className="mr-3 h-6 w-6 text-blue-500" />
                How We Use Your Information
              </h2>
              <p>We use the information we collect for various purposes, including to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our application</li>
                <li>Analyze your face shape and provide personalized eyewear recommendations</li>
                <li>Improve our application and user experience</li>
                <li>Develop new features and functionality</li>
                <li>Monitor usage patterns and performance</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Lock className="mr-3 h-6 w-6 text-blue-500" />
                Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized or unlawful processing, accidental loss, destruction, or damage.
              </p>
              <p>
                However, please note that no method of transmission over the internet or method of electronic storage is
                100% secure. While we strive to use commercially acceptable means to protect your personal information,
                we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Shield className="mr-3 h-6 w-6 text-blue-500" />
                Local Processing and Data Storage
              </h2>
              <p>Our Face Shape Analyzer processes all facial images locally on your device. This means:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your facial images are not transmitted to our servers</li>
                <li>Facial analysis is performed entirely on your device</li>
                <li>Your facial data is not stored permanently</li>
                <li>Your privacy is maintained throughout the analysis process</li>
              </ul>
              <p>
                Any data that is stored locally on your device (such as preferences or settings) can be cleared by
                clearing your browser data or uninstalling the application.
              </p>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Bell className="mr-3 h-6 w-6 text-blue-500" />
                Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                Policy are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p className="mt-2">
                <a href="mailto:privacy@faceanalyzer.app" className="text-blue-600 dark:text-blue-400 hover:underline">
                  privacy@faceanalyzer.app
                </a>
              </p>
            </section>
          </div>
        </motion.div>

        <div className="text-center mt-8 mb-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline">
            View our Terms of Service
          </Link>
          <span className="hidden sm:inline text-gray-400">•</span>
          <Link href="/cookie-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
            View our Cookie Policy
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
