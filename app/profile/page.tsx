export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center gap-6 max-w-md w-full">
        <div className="w-24 h-24 bg-black/40 rounded-full mb-2"></div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

        <div className="bg-black/20 p-6 rounded-xl border border-white/10 w-full">
          <div className="space-y-4 w-full">
            <div>
              <h2 className="text-sm text-gray-400 mb-1">Name</h2>
              <p className="font-medium">Guest User</p>
            </div>

            <div>
              <h2 className="text-sm text-gray-400 mb-1">Email</h2>
              <p className="font-medium">Not signed in</p>
            </div>

            <div className="pt-4">
              <button className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">
                Sign In
              </button>
            </div>

            <div>
              <button className="w-full bg-transparent hover:bg-white/5 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-white/10">
                Create Account
              </button>
            </div>
          </div>
        </div>

        <div className="w-full bg-black/20 p-6 rounded-xl border border-white/10">
          <h2 className="font-semibold mb-4">Settings</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Dark Mode</span>
              <div className="w-10 h-6 bg-white/20 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Notifications</span>
              <div className="w-10 h-6 bg-white/20 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
