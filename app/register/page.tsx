"use client"

export const dynamic = "force-dynamic"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, User, Mail, Lock, Zap, CheckCircle, AlertCircle, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { register } from "@/lib/auth"
import { useETrikeToast } from "@/components/ui/toast-container"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()
  const toast = useETrikeToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreedToTerms) {
      toast.warning("Terms Required", "Please agree to the Terms of Service and Privacy Policy")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password Mismatch", "Passwords do not match. Please try again.")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Weak Password", "Password must be at least 6 characters long.")
      return
    }

    setIsLoading(true)
    try {
      const user = await register(formData.email, formData.password, formData.name)
      if (user) {
        toast.success("Account Created!", `Welcome to YAMAARAW, ${user.name}! Please sign in to continue.`)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error("Registration Failed", error.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "", bgColor: "" }

    let score = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
    }

    score = Object.values(checks).filter(Boolean).length

    if (score < 2)
      return {
        strength: 1,
        label: "Weak",
        color: "text-red-400",
        bgColor: "bg-red-500",
      }
    if (score < 4)
      return {
        strength: 2,
        label: "Medium",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500",
      }
    if (score < 5)
      return {
        strength: 3,
        label: "Good",
        color: "text-blue-400",
        bgColor: "bg-blue-500",
      }
    return {
      strength: 4,
      label: "Strong",
      color: "text-green-400",
      bgColor: "bg-green-500",
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 flex items-center justify-center p-2">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-100 to-red-100 rounded-full opacity-30 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ea580c' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Compact container */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-gray-700/30 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 rounded-3xl"></div>

          <div className="relative z-10">
            {/* Compact Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-24 h-24">
                  <Image src="/icon512_rounded.png" alt="YAMAARAW" fill className="object-contain" />
                </div>
              </div>

              <Badge className="mb-3 bg-gradient-to-r from-orange-600 to-red-600 text-white border-none shadow-lg">
                <Zap className="w-3 h-3 mr-1" />
                Electric Vehicle Store
              </Badge>

              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                Join YAMAARAW
              </h1>
              <p className="text-gray-600 text-sm">Create your account to start shopping</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-orange-500" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 focus:bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-orange-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 focus:bg-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-orange-500" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 focus:bg-white"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Compact Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Strength:</span>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.label}</span>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.strength ? passwordStrength.bgColor : "bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-orange-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 focus:bg-white"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Compact Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-1 flex items-center space-x-2">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400 font-medium">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <span className="text-xs text-red-400">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Compact Terms Agreement */}
              <div className="flex items-start space-x-3 p-3 bg-orange-900/20 rounded-xl border border-orange-700/30">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-0.5"
                />
                <div className="text-xs">
                  <label htmlFor="agree-terms" className="text-gray-200 font-medium">
                    I agree to the{" "}
                    <Link href="/terms" className="text-orange-400 hover:text-orange-300 font-medium">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-orange-400 hover:text-orange-300 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Compact Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !passwordsMatch || !agreedToTerms}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 h-12 rounded-xl shadow-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Compact Sign In Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-orange-400 hover:text-orange-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Compact Security Features */}
        <div className="mt-3 p-3 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-orange-700/30 shadow-lg">
          <div className="flex items-center space-x-3 text-xs text-gray-300">
            <Shield className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-200">Your data is secure</p>
              <p>We use industry-standard encryption to protect your information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
