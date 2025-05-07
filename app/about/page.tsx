"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp, Mail, Send, Twitter, Facebook, Instagram, Linkedin, Github } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState("technology")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success")
      setFormData({ name: "", email: "", message: "" })

      // Reset status after 3 seconds
      setTimeout(() => setFormStatus("idle"), 3000)
    }, 1500)
  }

  const faqCategories = [
    {
      id: "technology",
      name: "Technology & Analysis",
      icon: "🔍",
      questions: [
        {
          question: "How accurate is the face shape analysis?",
          answer:
            "Our face shape analysis uses advanced facial recognition technology to identify key facial landmarks and calculate proportions. While it's highly accurate for most users, factors like lighting, camera angle, and facial obstructions (glasses, hair) can affect results. For best results, use good lighting and remove glasses.",
        },
        {
          question: "What face shapes does the app recognize?",
          answer:
            "Our app recognizes the five main face shapes: oval, round, square, heart, and diamond. Each shape has unique characteristics, and our algorithm analyzes facial proportions to determine which shape most closely matches your facial structure.",
        },
        {
          question: "How does the AI determine my face shape?",
          answer:
            "Our AI uses computer vision to identify 68 key facial landmarks on your face. It then measures the ratios between these points, analyzing features like face length, jawline angle, cheekbone width, and forehead shape. These measurements are compared against established face shape profiles to determine your closest match.",
        },
      ],
    },
    {
      id: "privacy",
      name: "Privacy & Security",
      icon: "🔒",
      questions: [
        {
          question: "Is my facial data stored or shared?",
          answer:
            "No. Your privacy is our priority. All facial analysis is performed directly on your device, and we do not store or transmit your facial images or biometric data. The app works offline once the models are loaded, and your data never leaves your device.",
        },
        {
          question: "Why does the app need camera access?",
          answer:
            "The app requires camera access to analyze your face shape. This is essential for providing accurate eyeglass recommendations. The camera is only used when you explicitly start the analysis process, and as mentioned in our privacy policy, no images are stored or transmitted.",
        },
        {
          question: "Do you collect any personal information?",
          answer:
            "We collect minimal information necessary for the app to function, such as your account details if you choose to create one. We do not collect or store facial biometric data. You can use most features of the app without creating an account. For more details, please refer to our Privacy Policy.",
        },
      ],
    },
    {
      id: "usage",
      name: "Using the App",
      icon: "📱",
      questions: [
        {
          question: "How do I get the most accurate results?",
          answer:
            "For best results: 1) Use good, even lighting on your face, 2) Remove glasses, hats, or hair covering your face, 3) Look directly at the camera, 4) Maintain a neutral expression, and 5) Ensure your entire face is visible in the frame.",
        },
        {
          question: "Can I use the app offline?",
          answer:
            "Yes! After the initial model download, the face analysis features work completely offline. This ensures your privacy and allows you to use the app anywhere. However, features like frame browsing and updates require an internet connection.",
        },
        {
          question: "Is the app available on all devices?",
          answer:
            "The app is designed to work on most modern browsers and devices. For the best experience, we recommend using the latest version of Chrome, Safari, or Firefox on a device with a front-facing camera. Some advanced features may have limited functionality on older devices.",
        },
      ],
    },
    {
      id: "features",
      name: "Features & Recommendations",
      icon: "👓",
      questions: [
        {
          question: "Can I try on the recommended frames virtually?",
          answer:
            "Yes! Our app includes a virtual try-on feature that lets you see how different frame styles look on your face. After receiving your recommendations, you can use the AR try-on feature in the Frames section to visualize how they'll look.",
        },
        {
          question: "How are eyeglass recommendations determined?",
          answer:
            "Our recommendations are based on optical styling principles that have been refined over decades. We match frame styles that complement your specific face shape, considering factors like proportion, contrast, and balance. The goal is to recommend frames that enhance your natural features.",
        },
        {
          question: "Can I save or share my results?",
          answer:
            "Yes! After your analysis, you can save your results to your account, download them as a PDF, or share them via email or social media. This makes it easy to reference your face shape and recommendations when shopping for glasses in-store or online.",
        },
      ],
    },
    {
      id: "troubleshooting",
      name: "Troubleshooting",
      icon: "🛠️",
      questions: [
        {
          question: "The app can't detect my face. What should I do?",
          answer:
            "If the app is having trouble detecting your face: 1) Ensure you're in a well-lit environment, 2) Remove any face coverings, glasses, or hair obscuring your face, 3) Position your face within the guide frame, 4) Try a different background for better contrast, and 5) Restart the app if the issue persists.",
        },
        {
          question: "Why is the analysis taking so long?",
          answer:
            "The first time you use the analyzer, it needs to download the AI models, which may take a moment depending on your connection. After that, analysis time depends on your device's processing power. Newer devices are typically faster. If it's consistently slow, try closing other apps to free up resources.",
        },
        {
          question: "The virtual try-on isn't working correctly. How can I fix it?",
          answer:
            "For the best virtual try-on experience: 1) Ensure you're in good lighting, 2) Keep your face centered and still, 3) Make sure your device has sufficient processing power, 4) Try using a plain background, and 5) Update your browser to the latest version. If issues persist, try using a different device.",
        },
      ],
    },
  ]

  const socialMedia = [
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      url: "https://twitter.com/wearablesai",
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      url: "https://facebook.com/wearablesai",
      color: "hover:text-[#4267B2]",
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: "https://instagram.com/wearablesai",
      color: "hover:text-[#E1306C]",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://linkedin.com/company/wearablesai",
      color: "hover:text-[#0077B5]",
    },
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      url: "https://github.com/wearablesai",
      color: "hover:text-[#6e5494]",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-white">About wearables.ai</h1>

      {/* Our Mission Section - Collapsible on mobile */}
      <div className="bg-card p-5 sm:p-7 rounded-xl border border-border w-full mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-white">Our Mission</h2>

        <p className="text-sm sm:text-base text-white mb-4 sm:mb-5">
          wearables.ai was created to help people find eyeglasses that perfectly complement their unique facial
          features. We believe that the right pair of glasses can enhance your appearance and boost your confidence.
        </p>

        <p className="text-sm sm:text-base text-white">
          Our AI-powered technology analyzes your face shape and provides personalized recommendations based on optical
          styling principles that have been refined over decades in the eyewear industry on optical styling principles
          that have been refined over decades in the eyewear industry.
        </p>
      </div>

      {/* How It Works Section - Collapsible on mobile */}
      <div className="bg-card p-5 sm:p-7 rounded-xl border border-border w-full mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-white">How It Works</h2>

        <p className="text-sm sm:text-base text-white mb-4 sm:mb-5">
          Our application uses advanced facial recognition technology to analyze your face's proportions and determine
          your face shape. The AI identifies key facial landmarks and calculates ratios between different features to
          classify your face as oval, round, square, heart, or diamond-shaped.
        </p>

        <p className="text-sm sm:text-base text-white">
          Based on this analysis, we recommend eyeglass styles that are known to complement your specific face shape,
          following established principles of balance and proportion in eyewear selection.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="bg-card p-5 sm:p-7 rounded-xl border border-border w-full mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-white">Frequently Asked Questions</h2>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-3 min-w-max pb-3">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id)
                  setOpenFaq(null) // Close any open FAQ when switching categories
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  activeCategory === category.id ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
                aria-selected={activeCategory === category.id}
              >
                <span role="img" aria-hidden="true">
                  {category.icon}
                </span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-4">
          {faqCategories
            .find((category) => category.id === activeCategory)
            ?.questions.map((faq, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 sm:p-5 text-left hover:bg-opacity-50 hover:bg-gray-700 transition-colors"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span className="font-medium text-sm sm:text-base text-white pr-8">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 flex-shrink-0 text-white transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-white transition-transform duration-200" />
                  )}
                </button>

                {openFaq === index && (
                  <div className="p-4 sm:p-5 border-t border-border bg-gray-800 bg-opacity-30 text-sm sm:text-base text-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="bg-card p-5 sm:p-7 rounded-xl border border-border w-full mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-white">Contact Us</h2>

        <p className="text-sm sm:text-base text-white mb-5">
          Have questions or feedback? We'd love to hear from you! Fill out the form below or reach out through our
          social media channels.
        </p>

        {/* Email Contact */}
        <div className="flex items-center gap-2 mb-5 text-blue-400">
          <Mail className="h-5 w-5" />
          <a href="mailto:support@wearables.ai" className="text-sm sm:text-base hover:underline">
            support@wearables.ai
          </a>
        </div>

        {/* Social Media Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-4 text-white">Connect with us:</h3>
          <div className="flex flex-wrap gap-5">
            {socialMedia.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-gray-800 transition-all ${platform.color} group`}
                aria-label={`Follow us on ${platform.name}`}
              >
                <span className="transition-transform group-hover:scale-125 duration-200">{platform.icon}</span>
                <span className="text-sm text-white">{platform.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              required
              className="w-full p-3 sm:p-4 bg-gray-800 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
              className="w-full p-3 sm:p-4 bg-gray-800 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your message here..."
              required
              rows={4}
              className="w-full p-3 sm:p-4 bg-gray-800 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={formStatus === "submitting"}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              {formStatus === "submitting" ? (
                <>Sending...</>
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {formStatus === "success" && (
            <div className="p-4 bg-green-900 bg-opacity-30 border border-green-700 rounded-lg text-green-400 text-sm text-center">
              Thank you! Your message has been sent successfully.
            </div>
          )}

          {formStatus === "error" && (
            <div className="p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg text-red-400 text-sm text-center">
              There was an error sending your message. Please try again.
            </div>
          )}
        </form>
      </div>

      {/* Footer with Privacy Policy */}
      <footer className="w-full mt-auto pt-8 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-white">
          <p>© {new Date().getFullYear()} wearables.ai. All rights reserved.</p>
          <div className="flex items-center">
            <Link
              href="/privacy-policy"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
