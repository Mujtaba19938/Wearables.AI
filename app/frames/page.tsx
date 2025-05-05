export default function FramesPage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-6 max-w-6xl mx-auto">
      <div className="w-full mb-8">
        <h1 className="text-4xl font-bold mb-2">Eyeglass Frames</h1>
        <p className="text-gray-400">Find the perfect frames for your face shape and style preference</p>
      </div>

      <div className="w-full flex gap-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search frames..."
            className="w-full bg-[#0f1117] border border-[#1a1c25] rounded-lg py-2 px-4 pl-10 text-white"
          />
          <svg
            className="absolute left-3 top-2.5"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
              fill="#6B7280"
            />
          </svg>
        </div>
        <button className="bg-[#0f1117] border border-[#1a1c25] rounded-lg p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="white" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="bg-[#0f1117] rounded-xl border border-[#1a1c25] overflow-hidden">
          <div className="relative">
            <img src="/placeholder.svg?key=f2qcy" alt="Classic Wayfarer" className="w-full h-48 object-cover" />
            <div className="absolute top-2 right-2 bg-[#EAB308] text-black text-xs font-bold px-2 py-1 rounded">
              Bestseller
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-1">Classic Wayfarer</h3>
            <p className="text-gray-400 text-sm mb-3">Timeless design with a slightly angular frame</p>

            <div className="flex gap-2 mb-4">
              <span className="bg-[#1a1f36] text-xs px-3 py-1 rounded-full">Oval</span>
              <span className="bg-[#1a1f36] text-xs px-3 py-1 rounded-full">Round</span>
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
                Material:
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                    fill="#6B7280"
                  />
                </svg>
              </div>
              <div className="relative">
                <select className="w-full appearance-none bg-[#0a0c14] border border-[#1a1c25] rounded py-2 px-3 text-white">
                  <option>Acetate</option>
                  <option>Metal</option>
                  <option>Plastic</option>
                </select>
                <svg
                  className="absolute right-3 top-3"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 10L12 15L17 10H7Z" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1117] rounded-xl border border-[#1a1c25] overflow-hidden">
          <div className="relative">
            <img src="/round-vintage-glasses.png" alt="Round Vintage" className="w-full h-48 object-cover" />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-1">Round Vintage</h3>
            <p className="text-gray-400 text-sm mb-3">Circular frames with a vintage feel</p>

            <div className="flex gap-2 mb-4">
              <span className="bg-[#1a1f36] text-xs px-3 py-1 rounded-full">Square</span>
              <span className="bg-[#1a1f36] text-xs px-3 py-1 rounded-full">Heart</span>
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
                Material:
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                    fill="#6B7280"
                  />
                </svg>
              </div>
              <div className="relative">
                <select className="w-full appearance-none bg-[#0a0c14] border border-[#1a1c25] rounded py-2 px-3 text-white">
                  <option>Metal</option>
                  <option>Acetate</option>
                  <option>Plastic</option>
                </select>
                <svg
                  className="absolute right-3 top-3"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 10L12 15L17 10H7Z" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1117] rounded-xl border border-[#1a1c25] overflow-hidden">
          <div className="relative">
            <img src="/placeholder.svg?key=8mh7q" alt="Cat-Eye Elegance" className="w-full h-48 object-cover" />
            <div className="absolute top-2 right-2 bg-[#EAB308] text-black text-xs font-bold px-2 py-1 rounded">
              Bestseller
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-1">Cat-Eye Elegance</h3>
            <p className="text-gray-400 text-sm mb-3">Upswept frames with a retro vibe</p>

            <div className="flex gap-2 mb-4">
              <span className="bg-[#1a1f36] text-xs px-3 py-1 rounded-full">Diamond</span>
              <span className="bg-[#1a1f36] text-xs px-3 py-1 rounded-full">Oval</span>
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
                Material:
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                    fill="#6B7280"
                  />
                </svg>
              </div>
              <div className="relative">
                <select className="w-full appearance-none bg-[#0a0c14] border border-[#1a1c25] rounded py-2 px-3 text-white">
                  <option>Acetate</option>
                  <option>Metal</option>
                  <option>Plastic</option>
                </select>
                <svg
                  className="absolute right-3 top-3"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 10L12 15L17 10H7Z" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
