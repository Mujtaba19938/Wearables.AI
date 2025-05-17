"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, Cookie, Info, Settings, Globe, Shield, CheckCircle, XCircle } from "lucide-react"

export default function CookiePolicyPage() {
  const [mounted, setMounted] = useState(false)
  // const { theme, setTheme } = useTheme() // Removed

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Toggle theme function
  // const toggleTheme = () => { // Removed
  //   setTheme(theme === "dark" ? "light" : "dark")
  // }

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
            <Cookie className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Cookie Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Last updated: May 17, 2025</p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="prose prose-lg dark:prose-invert max-w-none mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 card-gradient"
        >
          <div className="space-y-8">
            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Info className="mr-3 h-6 w-6 text-blue-500" />
                What Are Cookies?
              </h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely
                used to make websites work more efficiently and provide information to the website owners. Cookies help
                enhance your browsing experience by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remembering your preferences and settings</li>
                <li>Ensuring secure areas of the website work properly</li>
                <li>Collecting anonymous statistical information about how you use the website</li>
                <li>Providing personalized content and features</li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Cookie className="mr-3 h-6 w-6 text-blue-500" />
                How We Use Cookies
              </h2>
              <p>
                The Face Shape Analyzer application uses cookies and similar technologies for several purposes,
                including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
                  <p className="text-sm">
                    These cookies are necessary for the application to function properly. They enable core functionality
                    such as security, network management, and account access. You cannot opt out of these cookies.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Preference Cookies</h3>
                  <p className="text-sm">
                    These cookies remember your settings and preferences (like language or theme choice) to enhance your
                    experience and make your next visit more personalized.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Analytics Cookies</h3>
                  <p className="text-sm">
                    These cookies collect information about how you use our application, which pages you visit, and any
                    errors you might encounter. This helps us improve our application and your experience.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Functionality Cookies</h3>
                  <p className="text-sm">
                    These cookies allow the application to provide enhanced functionality and personalization, such as
                    remembering your previous face analysis results or saved preferences.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Globe className="mr-3 h-6 w-6 text-blue-500" />
                Third-Party Cookies
              </h2>
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics,
                deliver advertisements, and so on. These cookies may include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Analytics providers</strong> (such as Google Analytics) to help us understand how users
                  interact with our application
                </li>
                <li>
                  <strong>Performance monitoring services</strong> to help us identify and fix technical issues
                </li>
                <li>
                  <strong>Social media platforms</strong> if you choose to share content from our application
                </li>
              </ul>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Third-party cookies are subject to their providers' privacy policies. We
                  encourage you to review the privacy policies of these third parties when you visit their websites.
                </p>
              </div>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Shield className="mr-3 h-6 w-6 text-blue-500" />
                Local Storage and Face Analysis Data
              </h2>
              <p>
                Our Face Shape Analyzer application uses local storage technologies to enhance your experience. It's
                important to understand how these differ from traditional cookies:
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold mb-2">Face Analysis Data</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>All facial analysis is performed locally on your device.</strong> Your facial images are not
                  transmitted to our servers or stored as cookies. The analysis results may be temporarily stored in
                  your browser's local storage to improve performance and provide a better user experience.
                </p>
              </div>
              <div className="mt-4">
                <p>
                  Local storage data can be cleared by clearing your browser data or by using the controls provided
                  within our application.
                </p>
              </div>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Settings className="mr-3 h-6 w-6 text-blue-500" />
                Managing Your Cookie Preferences
              </h2>
              <p>
                Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse
                cookies, or to alert you when cookies are being sent. The methods for doing so vary from browser to
                browser, and from version to version. You can obtain up-to-date information about blocking and deleting
                cookies via these links:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Blocking All Cookies</h3>
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Please note that if you block all cookies, including essential cookies, you will not be able to
                        access all or parts of our application.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Cookie Preferences</h3>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        You can manage your cookie preferences within our application by clicking on "Cookie
                        Preferences" in the footer of our application.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to This Cookie Policy</h2>
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new
                Cookie Policy on this page and updating the "Last updated" date at the top of this policy.
              </p>
              <p>
                You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy
                are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p>If you have any questions about our Cookie Policy, please contact us at:</p>
              <p className="mt-2">
                <a href="mailto:privacy@faceanalyzer.app" className="text-blue-600 dark:text-blue-400 hover:underline">
                  privacy@faceanalyzer.app
                </a>
              </p>
            </section>
          </div>
        </motion.div>

        <div className="text-center mt-8 mb-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
            View our Privacy Policy
          </Link>
          <span className="hidden sm:inline text-gray-400">•</span>
          <Link href="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline">
            View our Terms of Service
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
