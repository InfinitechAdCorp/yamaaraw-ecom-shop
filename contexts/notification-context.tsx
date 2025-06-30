"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { getCurrentUser } from "@/lib/auth"
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type Notification,
} from "@/lib/notifications"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  refreshNotifications: () => Promise<void>
  markNotificationAsRead: (id: number) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
  deleteNotificationById: (id: number) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [previousNotificationCount, setPreviousNotificationCount] = useState(0)

  // Fix hydration issue
  useEffect(() => {
    setMounted(true)
  }, [])

  // Safe toast function that doesn't break if toast isn't available
  const showToast = useCallback((type: string, title: string, message?: string) => {
    try {
      // Try to get toast from window if available
      if (typeof window !== "undefined" && (window as any).showToast) {
        ;(window as any).showToast({ type, title, message })
      }
    } catch (error) {
      console.log(`${type.toUpperCase()}: ${title}${message ? ` - ${message}` : ""}`)
    }
  }, [])

  const refreshNotifications = useCallback(async () => {
    const user = getCurrentUser()
    if (!user || !mounted) return

    setLoading(true)
    try {
      const [notificationsData, unreadCountData] = await Promise.all([
        getNotifications().catch(() => []),
        getUnreadCount().catch(() => 0),
      ])

      // Check for new notifications and show toast
      if (mounted && previousNotificationCount > 0 && notificationsData.length > previousNotificationCount) {
        const newNotifications = notificationsData.slice(0, notificationsData.length - previousNotificationCount)
        if (newNotifications.length > 0) {
          const latestNotification = newNotifications[0]
          showToast("info", "🔔 New Notification", latestNotification.title)
        }
      }

      setNotifications(notificationsData)
      setUnreadCount(unreadCountData)
      setPreviousNotificationCount(notificationsData.length)
    } catch (error) {
      console.error("Error refreshing notifications:", error)
      // Set empty state on error
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }, [mounted, previousNotificationCount, showToast])

  const markNotificationAsRead = useCallback(async (id: number) => {
    try {
      const success = await markAsRead(id)
      if (success) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }, [])

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      const success = await markAllAsRead()
      if (success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })))
        setUnreadCount(0)
        showToast("success", "✅ All notifications marked as read")
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }, [showToast])

  const deleteNotificationById = useCallback(
    async (id: number) => {
      try {
        const success = await deleteNotification(id)
        if (success) {
          const notification = notifications.find((n) => n.id === id)
          setNotifications((prev) => prev.filter((n) => n.id !== id))
          if (notification && !notification.read_at) {
            setUnreadCount((prev) => Math.max(0, prev - 1))
          }
          showToast("success", "🗑️ Notification deleted")
        }
      } catch (error) {
        console.error("Error deleting notification:", error)
        showToast("error", "Failed to delete notification")
      }
    },
    [notifications, showToast],
  )

  // Initial load
  useEffect(() => {
    if (mounted) {
      refreshNotifications()
    }
  }, [mounted, refreshNotifications])

  // Real-time polling every 30 seconds
  useEffect(() => {
    if (!mounted) return

    const user = getCurrentUser()
    if (!user) return

    const interval = setInterval(() => {
      refreshNotifications()
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [mounted, refreshNotifications])

  // Listen for custom events (for immediate updates)
  useEffect(() => {
    const handleNewNotification = () => {
      refreshNotifications()
    }

    const handleOrderPlaced = () => {
      // Refresh notifications when order is placed
      setTimeout(refreshNotifications, 1000) // Small delay to ensure backend processing
    }

    window.addEventListener("newNotification", handleNewNotification)
    window.addEventListener("orderPlaced", handleOrderPlaced)

    return () => {
      window.removeEventListener("newNotification", handleNewNotification)
      window.removeEventListener("orderPlaced", handleOrderPlaced)
    }
  }, [refreshNotifications])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotificationById,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
