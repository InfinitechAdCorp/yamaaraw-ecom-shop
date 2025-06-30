"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Edit3,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ETrikeLoader from "@/components/ui/etrike-loader"
import { getCurrentUser } from "@/lib/auth"

interface OrderItem {
  id: number
  product_id: number
  quantity: number
  price: number
  color: string | null
  total: number
  product: {
    id: number
    name: string
    description: string
    price: number
    image_url: string
    images: string[]
  }
}

interface OrderDetails {
  id: number
  order_number: string
  status: string
  payment_status?: string
  total: number
  subtotal: number
  shipping_fee: number
  created_at: string
  updated_at: string
  shipped_at: string | null
  delivered_at: string | null
  paid_at: string | null
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  zip_code: string
  payment_method: string
  user: {
    id: number
    name: string
    email: string
  }
  items: OrderItem[]
}

const getImageUrl = (product: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL?.replace("/api", "") || "https://infinitech-api3.site"
  if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
    const imageUrl = product.images[0]
    if (imageUrl.startsWith("http")) {
      return imageUrl
    }
    if (imageUrl.startsWith("/storage")) {
      return `${baseUrl}${imageUrl}`
    }
    return `${baseUrl}/storage/products/${imageUrl}`
  }
  if (product?.image_url) {
    const imagePath = product.image_url
    if (imagePath.startsWith("http")) {
      return imagePath
    }
    if (imagePath.startsWith("/storage")) {
      return `${baseUrl}${imagePath}`
    }
    return `${baseUrl}/storage/products/${imagePath}`
  }
  return "/placeholder.svg?height=64&width=64"
}

export default function AdminOrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }
    if (orderId) {
      fetchOrderDetails()
    }
  }, [router, orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = getAuthToken()
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setOrder(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch order details")
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
      setError("Failed to fetch order details. Please try again.")
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
      return null
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return

    try {
      setUpdatingStatus(true)
      const token = getAuthToken()
      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchOrderDetails() // Refresh order details
        setError(null)
      } else {
        throw new Error(data.message || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      setError("Failed to update order status. Please try again.")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handlePaymentStatusUpdate = async (newPaymentStatus: string) => {
    if (!order) return

    try {
      setUpdatingPaymentStatus(true)
      const token = getAuthToken()
      const response = await fetch(`/api/orders/${order.id}/payment-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payment_status: newPaymentStatus }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchOrderDetails() // Refresh order details
        setError(null)
      } else {
        throw new Error(data.message || "Failed to update payment status")
      }
    } catch (error) {
      console.error("Error updating payment status:", error)
      setError("Failed to update payment status. Please try again.")
    } finally {
      setUpdatingPaymentStatus(false)
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
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200"
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
      case "confirmed":
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      case "processing":
        return <Package className="w-3 h-3 sm:w-4 sm:h-4" />
      case "shipped":
        return <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
      case "delivered":
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      case "cancelled":
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      default:
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
      case "paid":
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      case "failed":
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      case "refunded":
        return <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
      case "cancelled":
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      default:
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
    }
  }

  const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
  const paymentStatuses = ["pending", "paid", "failed", "refunded", "cancelled"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ETrikeLoader />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error || "Order not found"}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/admin/orders")} className="mt-4" variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Responsive */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={() => router.push("/admin/orders")}
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">Order Details</Badge>
            </div>

            <div className="mb-4">
              <h1 className="text-xl font-bold mb-1">#{order.order_number}</h1>
              <p className="text-orange-100 text-sm">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-orange-100">Order Status:</span>
                <Badge
                  className={`${getStatusColor(order.status)} flex items-center space-x-1 px-2 py-1 w-fit text-xs`}
                >
                  {getStatusIcon(order.status)}
                  <span className="font-medium capitalize">{order.status}</span>
                </Badge>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-orange-100">Payment Status:</span>
                <Badge
                  className={`${getPaymentStatusColor(order.payment_status || "pending")} flex items-center space-x-1 px-2 py-1 w-fit text-xs`}
                >
                  {getPaymentStatusIcon(order.payment_status || "pending")}
                  <span className="font-medium capitalize">{order.payment_status || "pending"}</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push("/admin/orders")}
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <Badge className="mb-2 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                  Order Details
                </Badge>
                <h1 className="text-2xl lg:text-3xl font-bold">#{order.order_number}</h1>
                <p className="text-orange-100">
                  Placed on{" "}
                  {new Date(order.created_at).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-col xl:flex-row xl:items-center xl:space-x-4 space-y-2 xl:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                <span className="text-xs sm:text-sm text-white/80">Order Status:</span>
                <Badge className={`${getStatusColor(order.status)} flex items-center space-x-2 px-3 py-2`}>
                  {getStatusIcon(order.status)}
                  <span className="font-medium capitalize">{order.status}</span>
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                <span className="text-xs sm:text-sm text-white/80">Payment Status:</span>
                <Badge
                  className={`${getPaymentStatusColor(order.payment_status || "pending")} flex items-center space-x-2 px-3 py-2`}
                >
                  {getPaymentStatusIcon(order.payment_status || "pending")}
                  <span className="font-medium capitalize">{order.payment_status || "pending"}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Order Items & Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Order Items ({order.items.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.product ? (
                          <img
                            src={getImageUrl(item.product) || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              target.nextElementSibling?.classList.remove("hidden")
                            }}
                          />
                        ) : (
                          <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        )}
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 hidden" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{item.product.description}</p>
                        {item.color && <p className="text-xs sm:text-sm text-gray-500">Color: {item.color}</p>}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 space-y-1 sm:space-y-0">
                          <span className="text-xs sm:text-sm text-gray-600">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </span>
                          <span className="font-semibold text-orange-600 text-sm sm:text-base">
                            {formatPrice(item.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Update Order Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={updatingStatus || order.status === status}
                      variant={order.status === status ? "default" : "outline"}
                      size="sm"
                      className={`${
                        order.status === status
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "border-orange-200 text-orange-600 hover:bg-orange-50"
                      } text-xs sm:text-sm`}
                    >
                      {getStatusIcon(status)}
                      <span className="ml-1 sm:ml-2 capitalize">{status}</span>
                    </Button>
                  ))}
                </div>
                {updatingStatus && <p className="text-xs sm:text-sm text-gray-600 mt-2">Updating status...</p>}
              </CardContent>
            </Card>

            {/* Payment Status Update */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Update Payment Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Current Payment Status:</p>
                  <Badge
                    className={`${getPaymentStatusColor(order.payment_status || "pending")} flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 w-fit text-xs sm:text-sm`}
                  >
                    {getPaymentStatusIcon(order.payment_status || "pending")}
                    <span className="font-medium capitalize">{order.payment_status || "pending"}</span>
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {paymentStatuses.map((status) => (
                    <Button
                      key={status}
                      onClick={() => handlePaymentStatusUpdate(status)}
                      disabled={updatingPaymentStatus || (order.payment_status || "pending") === status}
                      variant={(order.payment_status || "pending") === status ? "default" : "outline"}
                      size="sm"
                      className={`${
                        (order.payment_status || "pending") === status
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "border-orange-200 text-orange-600 hover:bg-orange-50"
                      } text-xs sm:text-sm`}
                    >
                      {getPaymentStatusIcon(status)}
                      <span className="ml-1 sm:ml-2 capitalize">{status}</span>
                    </Button>
                  ))}
                </div>
                {updatingPaymentStatus && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">Updating payment status...</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Customer & Payment Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Customer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {order.first_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {order.first_name} {order.last_name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Customer ID: {order.user.id}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-all">{order.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{order.phone}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs sm:text-sm">
                      <p>{order.address}</p>
                      <p>
                        {order.city}, {order.province} {order.zip_code}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                  <span className="text-xs sm:text-sm text-gray-600">Payment Method:</span>
                  <Badge
                    className={`${
                      order.payment_method === "cod"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-green-100 text-green-800 border-green-200"
                    } text-xs w-fit`}
                  >
                    {order.payment_method === "cod" ? "Cash on Delivery" : "Card Payment"}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                  <span className="text-xs sm:text-sm text-gray-600">Payment Status:</span>
                  <Badge
                    className={`${getPaymentStatusColor(order.payment_status || "pending")} flex items-center space-x-1 text-xs w-fit`}
                  >
                    {getPaymentStatusIcon(order.payment_status || "pending")}
                    <span className="capitalize">{order.payment_status || "pending"}</span>
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Subtotal:</span>
                    <span className="text-xs sm:text-sm">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Shipping Fee:</span>
                    <span className="text-xs sm:text-sm">{formatPrice(order.shipping_fee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold text-sm sm:text-base">Total:</span>
                    <span className="font-bold text-orange-600 text-sm sm:text-base">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Order Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="text-xs sm:text-sm min-w-0 flex-1">
                    <p className="font-medium">Order Placed</p>
                    <p className="text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {order.paid_at && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <div className="text-xs sm:text-sm min-w-0 flex-1">
                      <p className="font-medium">Payment Confirmed</p>
                      <p className="text-gray-600">
                        {new Date(order.paid_at).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {order.shipped_at && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <div className="text-xs sm:text-sm min-w-0 flex-1">
                      <p className="font-medium">Order Shipped</p>
                      <p className="text-gray-600">
                        {new Date(order.shipped_at).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {order.delivered_at && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <div className="text-xs sm:text-sm min-w-0 flex-1">
                      <p className="font-medium">Order Delivered</p>
                      <p className="text-gray-600">
                        {new Date(order.delivered_at).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
