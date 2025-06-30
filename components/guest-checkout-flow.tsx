"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, UserPlus, ShoppingCart } from "lucide-react"
import { register, login } from "@/lib/auth"
import { useClientToast } from "@/hooks/use-client-toast"

interface GuestCheckoutFlowProps {
  onAuthSuccess: () => void
  onGuestCheckout: () => void
}

export default function GuestCheckoutFlow({ onAuthSuccess, onGuestCheckout }: GuestCheckoutFlowProps) {
  const [mode, setMode] = useState<"choice" | "login" | "register">("choice")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const toast = useClientToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result) {
        toast.authSuccess(`Welcome back, ${result.user.name}!`)
        onAuthSuccess()
      }
    } catch (error: any) {
      toast.error("Login Failed", error.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password Mismatch", "Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const user = await register(formData.email, formData.password, formData.name)
      if (user) {
        toast.authSuccess(`Welcome, ${user.name}!`)
        onAuthSuccess()
      }
    } catch (error: any) {
      toast.error("Registration Failed", error.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (mode === "choice") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Choose Checkout Option</CardTitle>
          <p className="text-sm text-gray-600">How would you like to proceed?</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onGuestCheckout}
            variant="outline"
            className="w-full h-16 flex flex-col items-center justify-center space-y-2 bg-transparent"
          >
            <ShoppingCart className="w-6 h-6" />
            <div>
              <div className="font-medium">Continue as Guest</div>
              <div className="text-xs text-gray-500">Quick checkout without account</div>
            </div>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setMode("login")}
              variant="default"
              className="h-16 flex flex-col items-center justify-center space-y-1"
            >
              <User className="w-5 h-5" />
              <div className="text-xs">Sign In</div>
            </Button>

            <Button
              onClick={() => setMode("register")}
              variant="default"
              className="h-16 flex flex-col items-center justify-center space-y-1"
            >
              <UserPlus className="w-5 h-5" />
              <div className="text-xs">Sign Up</div>
            </Button>
          </div>

          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              Account holders get order tracking & faster checkout
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (mode === "login") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Sign In</CardTitle>
          <p className="text-sm text-gray-600">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="h-12"
              />
            </div>
            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <Button variant="ghost" onClick={() => setMode("register")} className="text-sm">
              Don't have an account? Sign up
            </Button>
            <Button variant="ghost" onClick={() => setMode("choice")} className="text-sm">
              Back to options
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (mode === "register") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Create Account</CardTitle>
          <p className="text-sm text-gray-600">Create your account for faster checkout</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Input
                name="name"
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="h-12"
              />
            </div>
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="h-12"
              />
            </div>
            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="h-12"
              />
            </div>
            <div>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12">
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <Button variant="ghost" onClick={() => setMode("login")} className="text-sm">
              Already have an account? Sign in
            </Button>
            <Button variant="ghost" onClick={() => setMode("choice")} className="text-sm">
              Back to options
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
