export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold mb-10 text-center">Profile</h1>

        <div className="bg-[#0f1117] p-6 rounded-xl border border-[#1a1c25] w-full mb-6">
          <h2 className="text-2xl font-bold mb-2">Login</h2>
          <p className="text-gray-400 mb-6">Enter your credentials to access your account</p>

          <form>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full bg-[#0a0c14] border border-[#1a1c25] rounded py-2 px-3 text-white"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-gray-400">Password</label>
                <a href="#" className="text-[#3B82F6] text-sm">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                className="w-full bg-[#0a0c14] border border-[#1a1c25] rounded py-2 px-3 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-lg font-medium transition-all duration-300"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-gray-400">Don't have an account? </span>
            <a href="#" className="text-[#3B82F6]">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
