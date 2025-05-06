import { AnimationStyleButton } from "@/components/animation-style-button"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 pt-4 pb-0">
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 max-w-3xl w-full text-center">
        <div className="mb-1 sm:mb-2">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18H14V16H10C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4H14V2H10Z"
              className="fill-current"
            />
            <path
              d="M30 2C34.4183 2 38 5.58172 38 10C38 14.4183 34.4183 18 30 18H26V16H30C33.3137 16 36 13.3137 36 10C36 6.68629 33.3137 4 30 4H26V2H30Z"
              className="fill-current"
            />
            <path
              d="M16 10C16 7.79086 17.7909 6 20 6C22.2091 6 24 7.79086 24 10C24 12.2091 22.2091 14 20 14C17.7909 14 16 12.2091 16 10Z"
              className="fill-current"
            />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">wearables.ai</h1>
        <p className="text-lg sm:text-xl dark:text-gray-400 text-gray-600">Find your perfect eyewear match</p>

        <div className="grid grid-cols-1 gap-4 w-full max-w-md mt-2 sm:mt-4">
          <div className="bg-card p-4 sm:p-5 rounded-xl border border-border">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Face Shape Analyzer</h2>
            <p className="text-sm sm:text-base dark:text-gray-400 text-gray-600 mb-3 sm:mb-4">
              Discover eyeglasses that complement your unique facial features
            </p>

            <div className="bg-muted p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 text-[#3B82F6]"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
                  className="fill-current"
                />
              </svg>
              <p className="text-xs sm:text-sm dark:text-gray-400 text-gray-600">
                Faces or facial features data/images are not stored in any way and we do not sell your privacy.
              </p>
            </div>

            <p className="text-sm sm:text-base dark:text-gray-400 text-gray-600 mb-3 sm:mb-4">
              Our AI will analyze your face shape and recommend the most suitable eyeglasses styles that enhance your
              appearance and boost your confidence.
            </p>

            <a
              href="/analyzer"
              className="inline-block w-full bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 text-center"
            >
              Start Analysis
            </a>
          </div>
        </div>

        {/* Animation style button positioned outside the card */}
        <div className="mt-4">
          <AnimationStyleButton />
        </div>
      </div>
    </main>
  )
}
