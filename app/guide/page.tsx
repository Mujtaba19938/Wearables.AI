export default function GuidePage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="w-full mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">Guide</h1>
        <p className="text-gray-400 mb-2 sm:mb-4 text-sm sm:text-base">
          Learn how to use our app to find the perfect eyeglasses for your face shape
        </p>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-8 rounded-full bg-primary"></div>
          <div className="h-2 w-8 rounded-full bg-gray-600"></div>
          <div className="h-2 w-8 rounded-full bg-gray-600"></div>
          <span className="text-xs text-gray-400 ml-2">Step 1 of 3: Learn</span>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">How to Use the App</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full mb-6 sm:mb-12">
        <div className="bg-gray-800/80 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg transition-all duration-300 hover:translate-y-[-4px] hover:shadow-primary/20 hover:border-primary/50">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-md">
            <span className="text-white font-bold text-lg">1</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Take a Photo</h3>
          <p className="text-sm sm:text-base text-gray-300">
            Use your camera or upload a photo that clearly shows your face from the front.
          </p>
        </div>

        <div className="bg-gray-800/80 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg transition-all duration-300 hover:translate-y-[-4px] hover:shadow-primary/20 hover:border-primary/50">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-md">
            <span className="text-white font-bold text-lg">2</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Analyze</h3>
          <p className="text-sm sm:text-base text-gray-300">
            Our AI will analyze your facial features to determine your face shape.
          </p>
        </div>

        <div className="bg-gray-800/80 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg transition-all duration-300 hover:translate-y-[-4px] hover:shadow-primary/20 hover:border-primary/50">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-md">
            <span className="text-white font-bold text-lg">3</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Get Recommendations</h3>
          <p className="text-sm sm:text-base text-gray-300">
            View personalized eyeglass style recommendations based on your face shape.
          </p>
        </div>
      </div>

      {/* Tips section with individual cards */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Tips for Best Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
        <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 shadow-md transition-all duration-300 hover:bg-gray-800">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Good Lighting</h3>
              <p className="text-sm text-gray-300">Ensure your face is well-lit with even lighting from the front</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 shadow-md transition-all duration-300 hover:bg-gray-800">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Remove Obstructions</h3>
              <p className="text-sm text-gray-300">
                Remove glasses, hats, or anything that might obscure your face shape
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 shadow-md transition-all duration-300 hover:bg-gray-800">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Neutral Expression</h3>
              <p className="text-sm text-gray-300">Look directly at the camera with a neutral expression</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 shadow-md transition-all duration-300 hover:bg-gray-800">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Clear Jawline</h3>
              <p className="text-sm text-gray-300">Pull your hair back to reveal your entire face shape and jawline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Good vs Bad Photo Examples */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Photo Examples</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-8">
        <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
          <h3 className="font-semibold mb-3 flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Good Example
          </h3>
          <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
            <img src="/neutral-portrait.png" alt="Good photo example" className="w-full h-full object-cover" />
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Even lighting
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Neutral expression
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Clear view of jawline
            </li>
          </ul>
        </div>

        <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
          <h3 className="font-semibold mb-3 flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Bad Example
          </h3>
          <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
            <img src="/dimly-lit-person.png" alt="Bad photo example" className="w-full h-full object-cover" />
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-red-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Poor lighting
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-red-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Wearing glasses/hat
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-red-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Jawline obscured
            </li>
          </ul>
        </div>
      </div>

      {/* Video Tutorial */}
      <div className="w-full bg-gray-800/80 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 flex items-center">
          <svg
            className="w-6 h-6 text-blue-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Video Walkthrough
        </h2>
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
          <div className="text-center p-6">
            <svg
              className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-70"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <p className="text-gray-400">Tutorial video showing how to use the face analyzer</p>
          </div>
        </div>
        <p className="text-sm text-gray-300">
          This video demonstrates how to take the perfect photo for analysis, navigate the app, and understand your
          results.
        </p>
      </div>

      {/* CTA Button */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <a
          href="/analyzer"
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Try It Now
        </a>
        <a
          href="#"
          className="w-full sm:w-auto bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-500/10 font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Learn More
        </a>
      </div>
    </main>
  )
}
