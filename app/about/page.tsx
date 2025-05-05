export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-10">About wearables.ai</h1>

      <div className="bg-card p-4 sm:p-6 rounded-xl border border-border w-full mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Our Mission</h2>

        <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
          wearables.ai was created to help people find eyeglasses that perfectly complement their unique facial
          features. We believe that the right pair of glasses can enhance your appearance and boost your confidence.
        </p>

        <p className="text-sm sm:text-base text-gray-300">
          Our AI-powered technology analyzes your face shape and provides personalized recommendations based on optical
          styling principles that have been refined over decades in the eyewear industry on optical styling principles
          that have been refined over decades in the eyewear industry.
        </p>
      </div>

      <div className="bg-card p-4 sm:p-6 rounded-xl border border-border w-full mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">How It Works</h2>

        <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
          Our application uses advanced facial recognition technology to analyze your face's proportions and determine
          your face shape. The AI identifies key facial landmarks and calculates ratios between different features to
          classify your face as oval, round, square, heart, or diamond-shaped.
        </p>

        <p className="text-sm sm:text-base text-gray-300">
          Based on this analysis, we recommend eyeglass styles that are known to complement your specific face shape,
          following established principles of balance and proportion in eyewear selection.
        </p>
      </div>

      <div className="bg-card p-4 sm:p-6 rounded-xl border border-border w-full">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Privacy & Security</h2>

        <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
          We take your privacy seriously. All facial analysis is performed on-device, and we do not store any facial
          images or biometric data. Your personal information is encrypted and securely stored according to industry
          best practices.
        </p>

        <p className="text-sm sm:text-base text-gray-300">
          We do not sell or share your data with third parties. Our business model is based on providing value through
          our technology, not monetizing your personal information.
        </p>
      </div>
    </main>
  )
}
