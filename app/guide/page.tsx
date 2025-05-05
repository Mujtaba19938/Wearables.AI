export default function GuidePage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Guide</h1>
      <p className="text-gray-400 mb-10">Learn how to use our app to find the perfect eyeglasses for your face shape</p>

      <h2 className="text-3xl font-bold mb-8">How to Use the App</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
        <div className="bg-[#0f1117] p-6 rounded-xl border border-[#1a1c25]">
          <div className="w-10 h-10 bg-[#1a1f36] rounded-full flex items-center justify-center mb-4">
            <span className="text-[#3B82F6] font-bold">1</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Take a Photo</h3>
          <p className="text-gray-400">
            Use your camera or upload a photo that clearly shows your face from the front.
          </p>
        </div>

        <div className="bg-[#0f1117] p-6 rounded-xl border border-[#1a1c25]">
          <div className="w-10 h-10 bg-[#1a1f36] rounded-full flex items-center justify-center mb-4">
            <span className="text-[#3B82F6] font-bold">2</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Analyze</h3>
          <p className="text-gray-400">Our AI will analyze your facial features to determine your face shape.</p>
        </div>

        <div className="bg-[#0f1117] p-6 rounded-xl border border-[#1a1c25]">
          <div className="w-10 h-10 bg-[#1a1f36] rounded-full flex items-center justify-center mb-4">
            <span className="text-[#3B82F6] font-bold">3</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Get Recommendations</h3>
          <p className="text-gray-400">View personalized eyeglass style recommendations based on your face shape.</p>
        </div>
      </div>

      <div className="bg-[#0f1117] p-6 rounded-xl border border-[#1a1c25] w-full">
        <div className="flex items-center gap-3 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 17H13V11H11V17ZM11 9H13V7H11V9Z"
              fill="#3B82F6"
            />
          </svg>
          <h3 className="text-xl font-bold">Tips for Best Results</h3>
        </div>

        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#10B981" />
            </svg>
            <span>Ensure your face is well-lit with even lighting from the front</span>
          </li>
          <li className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#10B981" />
            </svg>
            <span>Remove glasses, hats, or anything that might obscure your face shape</span>
          </li>
          <li className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#10B981" />
            </svg>
            <span>Look directly at the camera with a neutral expression</span>
          </li>
          <li className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#10B981" />
            </svg>
            <span>Pull your hair back to reveal your entire face shape and jawline</span>
          </li>
        </ul>
      </div>
    </main>
  )
}
