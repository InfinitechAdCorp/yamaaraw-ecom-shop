"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Package, Truck, MapPin, ArrowLeft, CheckCircle, Clock, User, Phone, Mail, CreditCard, Share2, ChevronDown, ChevronUp } from 'lucide-react'
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ETrikeLoader from "@/components/ui/etrike-loader"
import { getCurrentUser } from "@/lib/auth"

interface OrderDetail {
  id: number
  order_number: string
  status: string
  total: number
  created_at: string
  updated_at: string
  items: Array<{
    id: number
    product: {
      name: string
      images: string[]
      description: string
      model?: string
    }
    quantity: number
    price: number
    color?: string
  }>
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  payment_method: string
  tracking_number?: string
  estimated_delivery?: string
  order_notes?: string
  admin_notes?: string
}

interface TrackingEvent {
  id: number
  status: string
  description: string
  location: string
  timestamp: string
  admin_notes?: string
}

// Component for expandable description
function ExpandableDescription({ description, maxLength = 150 }: { description: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = description.length > maxLength

  if (!shouldTruncate) {
    return <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 leading-relaxed">{description}</p>
  }

  return (
    <div className="mt-1 sm:mt-2">
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        {isExpanded ? description : `${description.slice(0, maxLength)}...`}
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 p-0 h-auto text-xs text-orange-600 hover:text-orange-700 hover:bg-transparent"
      >
        {isExpanded ? (
          <>
            <span>Read less</span>
            <ChevronUp className="w-3 h-3 ml-1" />
          </>
        ) : (
          <>
            <span>Read more</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </>
        )}
      </Button>
    </div>
  )
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [tracking, setTracking] = useState<TrackingEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }

    fetchOrderDetail()
    fetchTrackingInfo()
  }, [orderId, router])

  const fetchOrderDetail = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        router.push("/login")
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL
      const response = await fetch(`${apiUrl}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setOrder(data.data)
      }
    } catch (error) {
      console.error("Error fetching order detail:", error)
    }
  }

  const fetchTrackingInfo = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL
      const response = await fetch(`${apiUrl}/orders/${orderId}/tracking`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTracking(data.data || [])
        }
      }
    } catch (error) {
      console.error("Error fetching tracking info:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAuthToken = () => {
    try {
      const sessionData = localStorage.getItem("session")
      if (!sessionData) return null
      const session = JSON.parse(sessionData)
      return session.token || null
    } catch (error) {
      console.error("Error getting auth token:", error)
      return null
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "processing":
        return "bg-red-100 text-red-800 border-red-200"
      case "shipped":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTrackingIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
      case "shipped":
        return <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
      case "processing":
        return <Package className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
    }
  }

  const handleShare = async (item: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.product.name,
          text: item.product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <ETrikeLoader />
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <Button onClick={() => router.push("/orders")} className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 truncate">Order Details</h1>
              <p className="text-slate-300 text-sm sm:text-base truncate">Order #{order.order_number}</p>
            </div>
            <div className="flex-shrink-0">
              <Badge
                className={`${getStatusColor(order.status)} text-sm sm:text-base lg:text-lg px-3 py-1 sm:px-4 sm:py-2`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/orders")}
            className="text-orange-600 hover:text-orange-700 p-2 sm:px-4 sm:py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Orders</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Order Items ({order.items.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg bg-white"
                    >
                      {/* Product Image */}
                      <div className="relative w-full h-48 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0 mx-auto sm:mx-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-contain rounded-lg"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80px, 96px"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">
                              {item.product.name}
                            </h3>
                            {item.product.model && <p className="text-sm text-gray-600 mt-1">{item.product.model}</p>}
                            
                            {/* Expandable Description */}
                            <ExpandableDescription description={item.product.description} />
                            
                            {item.color && <p className="text-xs text-gray-500 mt-1">Color: {item.color}</p>}
                          </div>

                          {/* Share Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(item)}
                            className="self-start sm:self-center p-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <span className="font-bold text-orange-600 text-lg sm:text-xl">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Information */}
            {tracking.length > 0 && (
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                    Order Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 sm:space-y-6">
                    {tracking.map((event, index) => (
                      <div key={event.id} className="relative">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="flex-shrink-0 mt-1">{getTrackingIcon(event.status)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{event.description}</h4>
                              <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                                {new Date(event.timestamp).toLocaleDateString("en-PH", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span>{event.location}</span>
                            </p>
                            {event.admin_notes && (
                              <p className="text-xs sm:text-sm text-orange-600 mt-2 bg-orange-50 p-2 sm:p-3 rounded">
                                <strong>Admin Note:</strong> {event.admin_notes}
                              </p>
                            )}
                          </div>
                        </div>
                        {index < tracking.length - 1 && (
                          <div className="absolute left-2 sm:left-2.5 mt-2 w-px h-6 sm:h-8 bg-gray-300"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.total * 0.9)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Shipping:</span>
                  <span>{formatPrice(order.total * 0.1)}</span>
                </div>
                <hr className="my-3 sm:my-4" />
                <div className="flex justify-between font-semibold text-base sm:text-lg">
                  <span>Total:</span>
                  <span className="text-orange-600">{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  Customer Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">
                    {order.first_name} {order.last_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{order.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm sm:text-base">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="break-words">{order.address}</p>
                    <p className="break-words">
                      {order.city}, {order.postal_code}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  Payment Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="capitalize font-medium">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Date:</span>
                    <span className="font-medium">
                      {new Date(order.created_at).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {order.tracking_number && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span>Tracking #:</span>
                      <span className="font-mono text-xs sm:text-sm font-medium break-all">
                        {order.tracking_number}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Notes */}
            {order.admin_notes && (
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Admin Notes</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 bg-orange-50 p-3 sm:p-4 rounded-lg leading-relaxed">
                    {order.admin_notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
