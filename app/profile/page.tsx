"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, LogOut } from "lucide-react"
import { Logo } from "@/components/logo"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/context/auth-context"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const isMobile = useMobile()
  const { user, logout, updateProfile } = useAuth()
  const { toast } = useToast()

  // Initialize form values when user data is available
  useState(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  })

  const handleSave = () => {
    updateProfile({ name, email })
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-3 sm:p-4 md:p-8 pb-20">
      <div className="w-full max-w-md">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">Profile</h1>
          <Logo size={isMobile ? "sm" : "md"} />
        </div>

        {user ? (
          // Authenticated user view
          <>
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                    <AvatarImage src={user.profilePic || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-2xl sm:text-3xl bg-primary/10">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    {isEditing ? (
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    ) : (
                      <p className="text-lg font-medium">{user.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    ) : (
                      <p>{user.email}</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    <Button variant="outline" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>App Settings</CardTitle>
                <CardDescription>Configure your app preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    We do not store any of your facial data. All analysis is performed locally on your device.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Saved Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Your face shape analysis results and recommendations are saved to your account.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">About wearables.ai</h3>
                  <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // Non-authenticated view with login/signup forms
          <div className="w-full">
            {showLoginForm ? (
              <LoginForm onToggleForm={() => setShowLoginForm(false)} />
            ) : (
              <SignupForm onToggleForm={() => setShowLoginForm(true)} />
            )}
          </div>
        )}
      </div>
    </main>
  )
}
