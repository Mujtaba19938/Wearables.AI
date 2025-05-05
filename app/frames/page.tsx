export default function FramesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center gap-6 max-w-3xl w-full">
        <h1 className="text-3xl font-bold tracking-tight text-center">Eyeglass Frames</h1>
        <p className="text-gray-400 text-center mb-4">Browse our collection of frames by style</p>

        <div className="grid grid-cols-2 gap-4 w-full">
          {["Round", "Square", "Oval", "Rectangle", "Cat Eye", "Aviator"].map((style) => (
            <div
              key={style}
              className="bg-black/20 p-4 rounded-xl border border-white/10 hover:bg-black/30 transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-video w-full bg-black/40 rounded-lg mb-3"></div>
              <h3 className="font-medium">{style}</h3>
              <p className="text-sm text-gray-400">View frames</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
