"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Star,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAuthToken } from "@/lib/auth"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Chat Support",
    href: "/admin/chat",
    icon: MessageSquare,
    hasNotification: true,
  },
  {
    title: "Testimonial",
    href: "/admin/testimonials",
    icon: Star,
  },
  {
    title: "Inquiries",
    href: "/admin/contact",
    icon: MessageCircle,
  },
]

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openChats, setOpenChats] = useState(0)
  const pathname = usePathname()

  // Fetch open chats count (active + waiting conversations)
  useEffect(() => {
    const fetchOpenChats = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        const response = await fetch("/api/chatbot/chat?action=admin_stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (data.success) {
          // Show open conversations (active + waiting) - this will be 0 when all chats are closed
          setOpenChats(data.data.open_conversations || 0)
        }
      } catch (error) {
        console.error("Failed to fetch open chats:", error)
        setOpenChats(0) // Reset to 0 on error
      }
    }

    fetchOpenChats()
    // Poll every 15 seconds for more frequent updates
    const interval = setInterval(fetchOpenChats, 15000)
    return () => clearInterval(interval)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md"
        onClick={toggleMobileMenu}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col shadow-xl",
          // Desktop styles
          "hidden lg:flex",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          // Mobile styles
          "lg:relative fixed inset-y-0 left-0 z-50",
          isMobileOpen ? "flex w-64" : "hidden lg:flex",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">Y</span>
                </div>
                <div>
                  <span className="font-bold text-lg">Admin Panel</span>
                  <p className="text-xs text-gray-400">YAMAARAW</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors hidden lg:block"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const showNotification = item.hasNotification && openChats > 0

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white hover:transform hover:scale-105",
                    )}
                  >
                    <div className="relative">
                      <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                      {showNotification && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center p-0">
                          {openChats}
                        </Badge>
                      )}
                    </div>
                    {!isCollapsed && (
                      <span className="font-medium group-hover:translate-x-1 transition-transform">{item.title}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                    {showNotification && !isCollapsed && (
                      <Badge className="ml-auto bg-red-500 text-white text-xs">{openChats}</Badge>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 space-y-2">
         
          <button className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 group w-full">
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium group-hover:translate-x-1 transition-transform">Logout</span>}
          </button>
        </div>
      </div>
    </>
  )
}
