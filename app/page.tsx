export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center gap-6 max-w-3xl w-full text-center">
        <div className="mb-2">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18H14V16H10C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4H14V2H10Z"
              fill="white"
            />
            <path
              d="M30 2C34.4183 2 38 5.58172 38 10C38 14.4183 34.4183 18 30 18H26V16H30C33.3137 16 36 13.3137 36 10C36 6.68629 33.3137 4 30 4H26V2H30Z"
              fill="white"
            />
            <path
              d="M16 10C16 7.79086 17.7909 6 20 6C22.2091 6 24 7.79086 24 10C24 12.2091 22.2091 14 20 14C17.7909 14 16 12.2091 16 10Z"
              fill="white"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">wearables.ai</h1>
        <p className="text-xl text-gray-400">Find your perfect eyewear match</p>

        <div className="grid grid-cols-1 gap-6 w-full max-w-md mt-8">
          <div className="bg-[#0f1117] p-6 rounded-xl border border-[#1a1c25]">
            <h2 className="text-2xl font-semibold mb-4">Face Shape Analyzer</h2>
            <p className="text-gray-400 mb-6">Discover eyeglasses that complement your unique facial features</p>

            <div className="bg-[#0a0c14] p-4 rounded-lg mb-6 flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
                  fill="#3B82F6"
                />
              </svg>
              <p className="text-sm text-gray-400">
                Faces or facial features data/images are not stored in any way and we do not sell your privacy.
              </p>
            </div>

            <p className="text-gray-400 mb-6">
              Our AI will analyze your face shape and recommend the most suitable eyeglasses styles that enhance your
              appearance and boost your confidence.
            </p>

            <a
              href="/analyzer"
              className="inline-block w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center"
            >
              Start Analysis
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
