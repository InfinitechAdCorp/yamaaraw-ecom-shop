export interface Notification {
  id: number
  user_id: number
  type: "order" | "order_status" | "shipping" | "promotion" | "system"
  title: string
  message: string
  data?: {
    order_id?: number
    order_number?: string
    status?: string
    [key: string]: any
  }
  read_at: string | null
  created_at: string
  updated_at: string
}

interface NotificationResponse {
  success: boolean
  data: Notification[] | { count: number }
  message?: string
}

function getAuthToken(): string | null {
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

export async function getNotifications(): Promise<Notification[]> {
  try {
    const token = getAuthToken()
    if (!token) return []

    const response = await fetch("/api/notifications", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const data: NotificationResponse = await response.json()
    return data.success && Array.isArray(data.data) ? data.data : []
  } catch (error) {
    console.error("Get notifications error:", error)
    return []
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const token = getAuthToken()
    if (!token) return 0

    const response = await fetch("/api/notifications/unread-count", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const data: NotificationResponse = await response.json()
    return data.success && typeof data.data === "object" && "count" in data.data ? data.data.count : 0
  } catch (error) {
    console.error("Get unread count error:", error)
    return 0
  }
}

export async function markAsRead(notificationId: number): Promise<boolean> {
  try {
    const token = getAuthToken()
    if (!token) return false

    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const data: NotificationResponse = await response.json()
    return data.success
  } catch (error) {
    console.error("Mark as read error:", error)
    return false
  }
}

export async function markAllAsRead(): Promise<boolean> {
  try {
    const token = getAuthToken()
    if (!token) return false

    const response = await fetch("/api/notifications/mark-all-read", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const data: NotificationResponse = await response.json()
    return data.success
  } catch (error) {
    console.error("Mark all as read error:", error)
    return false
  }
}

export async function deleteNotification(notificationId: number): Promise<boolean> {
  try {
    const token = getAuthToken()
    if (!token) return false

    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const data: NotificationResponse = await response.json()
    return data.success
  } catch (error) {
    console.error("Delete notification error:", error)
    return false
  }
}
