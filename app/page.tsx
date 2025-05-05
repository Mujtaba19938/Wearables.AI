export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center gap-6 max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold tracking-tight">Face Shape Analyzer</h1>
        <p className="text-xl text-gray-400">Find the perfect glasses for your face shape</p>

        <div className="grid grid-cols-1 gap-6 w-full max-w-md">
          <div className="bg-black/20 p-6 rounded-xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">Analyze Your Face Shape</h2>
            <p className="text-gray-400 mb-6">
              Our AI will analyze your face shape and recommend the best glasses styles for you.
            </p>
            <a
              href="/analyzer"
              className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              Start Analysis
            </a>
          </div>
        </div>

        <p className="text-sm text-blue-400 mt-6">
          Your privacy is important to us. All analysis is done on-device and no images are stored.
        </p>
      </div>
    </main>
  )
}
