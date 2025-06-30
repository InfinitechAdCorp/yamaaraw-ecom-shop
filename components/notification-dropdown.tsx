"use client"

import { useState, useEffect } from "react"
import { Bell, Package, Truck, Tag, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/contexts/notification-context"
import { getCurrentUser } from "@/lib/auth"
import type { User } from "@/lib/types"

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const {
    notifications,
    unreadCount,
    loading,
    refreshNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotifications()

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
      case "order_status":
        return <Package className="w-4 h-4 text-blue-500" />
      case "shipping":
        return <Truck className="w-4 h-4 text-orange-500" />
      case "promotion":
        return <Tag className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Don't render if user is not logged in
  if (!user) {
    return null
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2 rounded-full hover:bg-gray-100"
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) {
            refreshNotifications()
          }
        }}
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 md:w-80 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 max-h-96 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshNotifications}
                disabled={loading}
                className="text-xs text-gray-600 hover:text-gray-700 p-1"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1"
                >
                  <span className="hidden sm:inline">Mark all read</span>
                  <span className="sm:hidden">Read all</span>
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="max-h-64 sm:max-h-80">
            {loading && notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-3 sm:px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 group ${
                    !notification.read_at ? "border-blue-500 bg-blue-50" : "border-transparent"
                  }`}
                  onClick={() => {
                    if (!notification.read_at) {
                      markNotificationAsRead(notification.id)
                    }
                  }}
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium leading-tight ${!notification.read_at ? "text-gray-900" : "text-gray-700"}`}
                      >
                        {notification.title}
                      </p>
                      <p
                        className={`text-xs mt-1 leading-tight ${!notification.read_at ? "text-gray-600" : "text-gray-500"}`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(notification.created_at)}</p>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read_at && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            markNotificationAsRead(notification.id)
                          }}
                          className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                          title="Mark as read"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
