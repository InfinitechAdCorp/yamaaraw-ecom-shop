"use client"

export const dynamic = "force-dynamic"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, CreditCard, Truck, Shield, MapPin, Phone, Mail, User, UserPlus, Lock } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCart, clearCartAfterCheckout } from "@/lib/cart"
import { getCurrentUser, login, register } from "@/lib/auth"
import { useCart } from "@/contexts/cart-context"
import { useNotifications } from "@/contexts/notification-context"
import { useClientToast } from "@/hooks/use-client-toast"
import type { CartItem } from "@/lib/cart"

type CheckoutMode = "login" | "register" | "authenticated"

export default function CheckoutPage() {
  const router = useRouter()
  const { refreshCart } = useCart()
  const { refreshNotifications } = useNotifications()
  const toast = useClientToast()

  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>("login")
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
  })

  const [authInfo, setAuthInfo] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("cod")

  useEffect(() => {
    const user = getCurrentUser()

    if (user) {
      // User is authenticated - proceed to shipping
      setCheckoutMode("authenticated")
      const nameParts = user.name.split(" ")
      setShippingInfo((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email,
      }))
    } else {
      // User is not authenticated - require login/signup
      setCheckoutMode("login")
    }

    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const cartItems = await getCart()
      setCart(cartItems)
      if (cartItems.length === 0) {
        router.push("/cart")
        return
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast.error("Failed to Load", "Could not load cart items")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Special handling for different field types
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "")
      const limitedDigits = digitsOnly.slice(0, 11)
      setShippingInfo({
        ...shippingInfo,
        [name]: limitedDigits,
      })
    } else if (name === "firstName" || name === "lastName") {
      const lettersOnly = value.replace(/[^a-zA-Z\s'-]/g, "")
      setShippingInfo({
        ...shippingInfo,
        [name]: lettersOnly,
      })
    } else if (name === "zipCode") {
      const numbersOnly = value.replace(/\D/g, "")
      setShippingInfo({
        ...shippingInfo,
        [name]: numbersOnly,
      })
    } else if (name === "city" || name === "province") {
      const lettersOnly = value.replace(/[^a-zA-Z\s'-]/g, "")
      setShippingInfo({
        ...shippingInfo,
        [name]: lettersOnly,
      })
    } else {
      setShippingInfo({
        ...shippingInfo,
        [name]: value,
      })
    }
  }

  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAuthInfo({
      ...authInfo,
      [name]: value,
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticating(true)

    try {
      const result = await login(authInfo.email, authInfo.password)
      if (result) {
        toast.authSuccess(`Welcome back, ${result.user.name}!`)

        // Update shipping info with user data
        const nameParts = result.user.name.split(" ")
        setShippingInfo((prev) => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: result.user.email,
        }))

        setCheckoutMode("authenticated")
        await refreshCart() // Refresh cart to get transferred items
      }
    } catch (error: any) {
      toast.error("Login Failed", error.message || "Invalid credentials")
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (authInfo.password !== authInfo.confirmPassword) {
      toast.error("Password Mismatch", "Passwords do not match")
      return
    }

    setIsAuthenticating(true)

    try {
      const user = await register(authInfo.email, authInfo.password, authInfo.name)
      if (user) {
        toast.authSuccess(`Welcome, ${user.name}!`)

        // Update shipping info with user data
        const nameParts = user.name.split(" ")
        setShippingInfo((prev) => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email,
        }))

        setCheckoutMode("authenticated")
        await refreshCart() // Refresh cart to get transferred items
      }
    } catch (error: any) {
      toast.error("Registration Failed", error.message || "Registration failed")
    } finally {
      setIsAuthenticating(false)
    }
  }

  const validateForm = () => {
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "province", "zipCode"]

    for (const field of requiredFields) {
      if (!shippingInfo[field as keyof typeof shippingInfo].trim()) {
        toast.error("Validation Error", `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`)
        return false
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error("Validation Error", "Please enter a valid email address")
      return false
    }

    const phoneRegex = /^[0-9]{11}$/
    if (!phoneRegex.test(shippingInfo.phone)) {
      toast.error("Validation Error", "Please enter a valid 11-digit Philippine phone number")
      return false
    }

    if (!shippingInfo.phone.startsWith("09")) {
      toast.error("Validation Error", "Phone number should start with 09 (e.g., 09123456789)")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
        })),
        shipping_info: shippingInfo,
        payment_method: paymentMethod,
        subtotal: subtotal,
        shipping_fee: shipping,
        total: total,
        is_guest: false, // Always false since we require authentication
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      // Add auth token (required)
      const token = getAuthToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        const cartCleared = await clearCartAfterCheckout()
        if (cartCleared) {
          await refreshCart()
          setTimeout(() => {
            refreshNotifications()
          }, 1000)
          window.dispatchEvent(new CustomEvent("orderPlaced"))
          toast.orderPlaced(result.data.order_number)
          router.push(`/order-success?orderId=${result.data.id}&orderNumber=${result.data.order_number}`)
        } else {
          toast.warning("Order Placed", "Order successful but cart may need manual refresh")
          router.push(`/order-success?orderId=${result.data.id}&orderNumber=${result.data.order_number}`)
        }
      } else {
        throw new Error(result.message || "Order failed")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error("Order Failed", errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const getAuthToken = () => {
    try {
      const sessionData = localStorage.getItem("session")
      if (!sessionData) return null
      const session = JSON.parse(sessionData)
      return session.token || null
    } catch (error) {
      return null
    }
  }

  const formatPrice = (price: number) => {
    if (!price || isNaN(price) || price === null || price === undefined) {
      return "₱0.00"
    }
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const calculateSafeTotal = (cart: CartItem[]) => {
    return cart.reduce((total, item) => {
      const price = Number.parseFloat(item.price?.toString() || "0") || 0
      const quantity = Number.parseInt(item.quantity?.toString() || "0") || 0
      const itemTotal = price * quantity
      return total + (isNaN(itemTotal) ? 0 : itemTotal)
    }, 0)
  }

  const subtotal = calculateSafeTotal(cart)
  const shipping = subtotal > 50000 ? 0 : 500
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <Button onClick={() => router.push("/products")} className="bg-orange-500 hover:bg-orange-600">
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Secure Checkout</h1>
            <p className="text-slate-300">Complete your order with confidence</p>
            <Badge className="mt-2 bg-green-500/20 text-green-200 border-green-300/30">
              <Lock className="w-3 h-3 mr-1" />
              Secure & Verified Orders Only
            </Badge>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/cart")}
            className="text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-8">
          <div className="space-y-6">
            {/* Authentication Required Section */}
            {checkoutMode !== "authenticated" && (
              <Card className="p-4 sm:p-6 border-2 border-orange-200 bg-orange-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Lock className="w-5 h-5 mr-2 text-orange-500" />
                    Account Required for Checkout
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    For security and order tracking, please sign in or create an account to continue
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant={checkoutMode === "login" ? "default" : "outline"}
                      onClick={() => setCheckoutMode("login")}
                      className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                        checkoutMode === "login"
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "border-orange-200 hover:bg-orange-50"
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-xs font-medium">Sign In</span>
                    </Button>
                    <Button
                      variant={checkoutMode === "register" ? "default" : "outline"}
                      onClick={() => setCheckoutMode("register")}
                      className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                        checkoutMode === "register"
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "border-orange-200 hover:bg-orange-50"
                      }`}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span className="text-xs font-medium">Create Account</span>
                    </Button>
                  </div>

                  {/* Benefits of Creating Account */}
                  <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
                    <h4 className="font-medium text-gray-900 mb-2">Why create an account?</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Track your orders in real-time</li>
                      <li>• Faster checkout for future purchases</li>
                      <li>• Order history and easy reordering</li>
                      <li>• Exclusive offers and updates</li>
                      <li>• Better customer support</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Login Form */}
            {checkoutMode === "login" && (
              <Card className="p-4 sm:p-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <User className="w-5 h-5 mr-2 text-orange-500" />
                    Sign In to Your Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email address"
                        value={authInfo.email}
                        onChange={handleAuthInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={authInfo.password}
                        onChange={handleAuthInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      {isAuthenticating ? "Signing in..." : "Sign In & Continue"}
                    </Button>
                  </form>

                  <div className="mt-4 text-center">
                    <Button variant="ghost" onClick={() => setCheckoutMode("register")} className="text-sm">
                      Don't have an account? Create one
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Register Form */}
            {checkoutMode === "register" && (
              <Card className="p-4 sm:p-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <UserPlus className="w-5 h-5 mr-2 text-orange-500" />
                    Create Your Account
                  </CardTitle>
                  <p className="text-sm text-gray-600">Quick signup - takes less than a minute!</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Full name"
                        value={authInfo.name}
                        onChange={handleAuthInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email address"
                        value={authInfo.email}
                        onChange={handleAuthInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Input
                        name="password"
                        type="password"
                        placeholder="Password (min. 6 characters)"
                        value={authInfo.password}
                        onChange={handleAuthInputChange}
                        required
                        minLength={6}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={authInfo.confirmPassword}
                        onChange={handleAuthInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      {isAuthenticating ? "Creating account..." : "Create Account & Continue"}
                    </Button>
                  </form>

                  <div className="mt-4 text-center">
                    <Button variant="ghost" onClick={() => setCheckoutMode("login")} className="text-sm">
                      Already have an account? Sign in
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Information Form - Only shown when authenticated */}
            {checkoutMode === "authenticated" && (
              <Card className="p-4 sm:p-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Truck className="w-5 h-5 mr-2 text-orange-500" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="firstName"
                          value={shippingInfo.firstName}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="lastName"
                          value={shippingInfo.lastName}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          name="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={handleInputChange}
                          required
                          readOnly
                          className="pl-10 h-12 bg-gray-50 cursor-not-allowed"
                          placeholder="Email address"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">From your account</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          name="phone"
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={handleInputChange}
                          required
                          maxLength={11}
                          className="pl-10 h-12"
                          placeholder="09123456789"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter 11-digit Philippine mobile number (e.g., 09123456789)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleInputChange}
                          required
                          className="pl-10 h-12"
                          placeholder="Street address, building, apartment"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Province <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="province"
                          value={shippingInfo.province}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                          placeholder="Province"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                          placeholder="ZIP"
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Method - Only shown when authenticated */}
            {checkoutMode === "authenticated" && (
              <Card className="p-4 sm:p-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <CreditCard className="w-5 h-5 mr-2 text-orange-500" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <label className="flex items-center p-3 sm:p-4 border-2 border-orange-300 bg-orange-50 rounded-xl cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <Truck className="w-5 h-5 mr-3 text-orange-600" />
                      <div>
                        <span className="font-medium text-orange-800">Cash on Delivery</span>
                        <p className="text-sm text-orange-600">Pay when you receive your order</p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-xl cursor-not-allowed opacity-50">
                      <input type="radio" name="payment" value="card" disabled className="mr-3" />
                      <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                      <div>
                        <span className="font-medium">Credit/Debit Card</span>
                        <p className="text-sm text-gray-500">Coming soon</p>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-4 sm:p-6">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 sm:space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-contain rounded-lg"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.model}</p>
                        {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-semibold text-orange-600">
                            {formatPrice(
                              Number.parseFloat(item.price?.toString() || "0") *
                                Number.parseInt(item.quantity?.toString() || "0"),
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping Fee</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-orange-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {checkoutMode === "authenticated" && (
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || cart.length === 0}
                    className="w-full mt-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 h-16 sm:h-14 text-base sm:text-lg font-semibold disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing Order...</span>
                      </div>
                    ) : (
                      `Place Order - ${formatPrice(total)}`
                    )}
                  </Button>
                )}

                {checkoutMode !== "authenticated" && (
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
                    <Lock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-orange-700 font-medium">
                      Please sign in or create an account to place your order
                    </p>
                  </div>
                )}

                <div className="mt-6 space-y-3 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span>Free shipping on orders over ₱50,000</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>Order tracking and support included</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
