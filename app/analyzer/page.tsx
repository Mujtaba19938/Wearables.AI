export default function AnalyzerPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-center">Face Analyzer</h1>
        <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 text-center">
          Take or upload a photo to analyze your face shape
        </p>

        <div className="bg-[#0f1117] p-4 sm:p-6 rounded-xl border border-[#1a1c25] w-full mb-4 sm:mb-6">
          <div className="aspect-square w-full bg-[#0a0c14] rounded-lg flex items-center justify-center mb-4 sm:mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="#6B7280"
              />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M12 15.2C13.7674 15.2 15.2 13.7674 15.2 12C15.2 10.2326 13.7674 8.8 12 8.8C10.2326 8.8 8.8 10.2326 8.8 12C8.8 13.7674 10.2326 15.2 12 15.2Z"
                  fill="white"
                />
                <path
                  d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
                  fill="white"
                />
              </svg>
              Take Photo
            </button>

            <button className="bg-[#1a1f36] hover:bg-[#252b45] text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM19 18H6C3.79 18 2 16.21 2 14C2 11.95 3.53 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08 7.14 9.94 6 12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18ZM8 13H10.55V16H13.45V13H16L12 9L8 13Z"
                  fill="white"
                />
              </svg>
              Upload
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 bg-[#0f1117] p-3 sm:p-4 rounded-xl border border-[#1a1c25]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
              fill="#3B82F6"
            />
          </svg>
          <p className="text-xs sm:text-sm text-[#3B82F6]">
            Your privacy is important to us. All analysis is done on-device.
          </p>
        </div>
      </div>
    </main>
  )
}
