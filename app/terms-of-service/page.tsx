"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, FileText, UserCheck, AlertTriangle, Scale, Ban, ShieldAlert, XCircle } from "lucide-react"

export default function TermsOfServicePage() {
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
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w2xl mx-auto">Last updated: May 17, 2025</p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="prose prose-lg dark:prose-invert max-w-none mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 card-gradient"
        >
          <div className="space-y-8">
            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <FileText className="mr-3 h-6 w-6 text-blue-500" />
                Introduction
              </h2>
              <p>
                Welcome to Face Shape Analyzer. These Terms of Service ("Terms") govern your use of the Face Shape
                Analyzer application ("Application") operated by Face Analyzer ("we," "us," or "our").
              </p>
              <p>
                By accessing or using the Application, you agree to be bound by these Terms. If you disagree with any
                part of the Terms, you may not access the Application.
              </p>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <UserCheck className="mr-3 h-6 w-6 text-blue-500" />
                User Eligibility and Account
              </h2>
              <p>
                You must be at least 13 years of age to use this Application. By using this Application, you represent
                and warrant that you are at least 13 years of age and that your use of the Application does not violate
                any applicable laws or regulations.
              </p>
              <p>
                If you create an account with us, you are responsible for maintaining the security of your account and
                for all activities that occur under your account. You must immediately notify us of any unauthorized
                uses of your account or any other breaches of security.
              </p>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <AlertTriangle className="mr-3 h-6 w-6 text-blue-500" />
                Use of the Application
              </h2>
              <p>
                The Face Shape Analyzer Application is designed to analyze facial features and provide eyewear
                recommendations. By using this Application, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The analysis and recommendations provided are for informational purposes only and should not be
                  considered as professional advice.
                </li>
                <li>
                  The accuracy of the analysis depends on various factors, including image quality, lighting, and facial
                  positioning.
                </li>
                <li>
                  We do not guarantee that the recommendations will be suitable for all users or all circumstances.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Ban className="mr-3 h-6 w-6 text-blue-500" />
                Prohibited Activities
              </h2>
              <p>You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Using the Application for any illegal purpose or in violation of any local, state, national, or
                  international law.
                </li>
                <li>
                  Attempting to interfere with, compromise the system integrity or security, or decipher any
                  transmissions to or from the servers running the Application.
                </li>
                <li>
                  Using the Application to upload, transmit, or distribute any viruses, worms, or other malicious code.
                </li>
                <li>
                  Impersonating another person or otherwise misrepresenting your affiliation with a person or entity.
                </li>
                <li>
                  Using the Application in a manner that could disable, overburden, damage, or impair the Application or
                  interfere with any other party's use of the Application.
                </li>
                <li>
                  Attempting to reverse engineer, decompile, or otherwise attempt to extract the source code of the
                  Application.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <Scale className="mr-3 h-6 w-6 text-blue-500" />
                Intellectual Property
              </h2>
              <p>
                The Application and its original content, features, and functionality are and will remain the exclusive
                property of Face Analyzer and its licensors. The Application is protected by copyright, trademark, and
                other laws of both the United States and foreign countries.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the
                prior written consent of Face Analyzer.
              </p>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <ShieldAlert className="mr-3 h-6 w-6 text-blue-500" />
                Limitation of Liability
              </h2>
              <p>
                In no event shall Face Analyzer, nor its directors, employees, partners, agents, suppliers, or
                affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your access to or use of or inability to access or use the Application.</li>
                <li>Any conduct or content of any third party on the Application.</li>
                <li>Any content obtained from the Application.</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center text-2xl font-bold mb-4">
                <XCircle className="mr-3 h-6 w-6 text-blue-500" />
                Termination
              </h2>
              <p>
                We may terminate or suspend your access to the Application immediately, without prior notice or
                liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                All provisions of the Terms which by their nature should survive termination shall survive termination,
                including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of
                liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material, we will try to provide at least 30 days' notice prior to any new terms taking
                effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p>
                By continuing to access or use our Application after those revisions become effective, you agree to be
                bound by the revised terms. If you do not agree to the new terms, please stop using the Application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States, without
                regard to its conflict of law provisions.
              </p>
              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
                rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
                provisions of these Terms will remain in effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <p className="mt-2">
                <a href="mailto:legal@faceanalyzer.app" className="text-blue-600 dark:text-blue-400 hover:underline">
                  legal@faceanalyzer.app
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
          <Link href="/cookie-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
            View our Cookie Policy
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
