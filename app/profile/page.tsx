export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-10 text-center">Profile</h1>

        <div className="bg-card p-4 sm:p-6 rounded-xl border border-border w-full mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Login</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            Enter your credentials to access your account
          </p>

          <form>
            <div className="mb-4">
              <label className="block text-muted-foreground mb-1 sm:mb-2 text-sm sm:text-base">Email</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full bg-muted border border-border rounded py-2 px-3 text-foreground text-sm sm:text-base"
              />
            </div>

            <div className="mb-5 sm:mb-6">
              <div className="flex justify-between mb-1 sm:mb-2">
                <label className="text-muted-foreground text-sm sm:text-base">Password</label>
                <a href="#" className="text-primary text-xs sm:text-sm">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                className="w-full bg-muted border border-border rounded py-2 px-3 text-foreground text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted-foreground text-sm sm:text-base">Don't have an account? </span>
            <a href="#" className="text-primary text-sm sm:text-base">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
