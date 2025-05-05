export default function AnalyzerPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center gap-6 max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold tracking-tight">Face Analyzer</h1>
        <p className="text-gray-400">Take or upload a photo to analyze your face shape</p>

        <div className="bg-black/20 p-6 rounded-xl border border-white/10 w-full max-w-md">
          <div className="aspect-square w-full bg-black/40 rounded-lg flex items-center justify-center mb-4">
            <p className="text-gray-400">Camera preview will appear here</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">
              Take Photo
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">
              Upload Photo
            </button>
          </div>
        </div>

        <p className="text-sm text-blue-400 mt-4">Your privacy is important to us. All analysis is done on-device.</p>
      </div>
    </main>
  )
}
