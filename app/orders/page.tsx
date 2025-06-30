"use client"
export const dynamic = "force-dynamic"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Package, Truck, Calendar, MapPin, Eye, ArrowLeft, Filter } from 'lucide-react'
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import ETrikeLoader from "@/components/ui/etrike-loader"
import { getCurrentUser } from "@/lib/auth"
import { useClientToast } from "@/hooks/use-client-toast"

interface Order {
  id: number
  order_number: string
  status: string
  total: number
  created_at: string
  items: Array<{
    id: number
    product: {
      name: string
      images: string[]
    }
    quantity: number
    price: number
  }>
  first_name: string
  last_name: string
}

export default function OrdersPage() {
  const router = useRouter()
  const toast = useClientToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }

    fetchOrders()
  }, [router])

  const fetchOrders = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.error("No auth token found")
        router.push("/login")
        return
      }

      console.log("Fetching orders with token:", token.substring(0, 10) + "...")

      const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL
      const response = await fetch(`${apiUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error response:", errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()

      if (data.success) {
        const ordersData = data.data?.data || data.data || []
        setOrders(ordersData)
      } else {
        console.error("API returned error:", data.message)
        throw new Error(data.message || "Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to fetch orders. Please try again.")
      setOrders([])
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
      case "confirmed":
        return <Calendar className="w-4 h-4" />
      case "processing":
        return <Package className="w-4 h-4" />
      case "shipped":
      case "delivered":
        return <Truck className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">My Orders</h1>
              <p className="text-slate-300">Track and manage your orders</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Package className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-orange-600 hover:text-orange-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search orders by order number or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 border-2 border-orange-200 focus:border-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border-2 border-orange-200 focus:border-orange-500 rounded-lg px-3 py-2 h-12 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-16 h-16 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {orders.length === 0 ? "No orders yet" : "No orders found"}
            </h3>
            <p className="text-gray-600 mb-8">
              {orders.length === 0
                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                : "Try adjusting your search or filter criteria."}
            </p>
            <Button
              onClick={() => router.push("/products")}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-shadow border-2 border-orange-100 hover:border-orange-300"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.order_number}</h3>
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Ordered on{" "}
                            {new Date(order.created_at).toLocaleDateString("en-PH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="flex items-center gap-2 mt-1">
                            <Package className="w-4 h-4" />
                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Deliver to {order.first_name} {order.last_name}
                          </p>
                          <p className="font-semibold text-orange-600 mt-1">Total: {formatPrice(order.total)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={item.product.images[0] || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-contain rounded-lg border border-gray-200"
                              sizes="48px"
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-600 font-medium">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {(order.status === "shipped" || order.status === "delivered") && (
                        <Button
                          onClick={() => router.push(`/orders/${order.id}/track`)}
                          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Track Package
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
