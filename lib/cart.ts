import { getAuthToken } from "./auth"

export interface CartItem {
  id: string
  product_id: number
  quantity: number
  color?: string
  name: string
  price: number
  image_url: string
  total: number
  product: {
    name: string
    price: number
    image_url: string
    images: string[]
    model: string
    category: string
    description?: string
  }
}

interface CartResponse {
  success: boolean
  message?: string
  data?: CartItem | CartItem[]
  deleted_items?: number
  session_id?: string
}

// Session management for guest users
class GuestSession {
  private static SESSION_KEY = "guest_session_id"

  static getSessionId(): string {
    if (typeof window === "undefined") return ""

    let sessionId = localStorage.getItem(this.SESSION_KEY)
    if (!sessionId) {
      sessionId = "guest_" + Math.random().toString(36).substr(2, 16) + Date.now().toString(36)
      localStorage.setItem(this.SESSION_KEY, sessionId)
    }
    return sessionId
  }

  static clearSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.SESSION_KEY)
    }
  }

  static setSessionId(sessionId: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.SESSION_KEY, sessionId)
    }
  }
}

// Utility function to safely convert to number
const safeNumber = (value: any): number => {
  if (value === null || value === undefined) return 0
  const num = typeof value === "string" ? Number.parseFloat(value) : Number(value)
  return isNaN(num) ? 0 : num
}

// Utility function to safely format price
export const formatPrice = (price: number | string | null | undefined): string => {
  const numPrice = safeNumber(price)
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice)
}

// Get headers for API requests
function getRequestHeaders(): HeadersInit {
  const token = getAuthToken()
  const sessionId = GuestSession.getSessionId()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (sessionId) {
    headers["X-Session-ID"] = sessionId
  }

  return headers
}

export async function getCart(): Promise<CartItem[]> {
  try {
    const token = getAuthToken()
    const sessionId = GuestSession.getSessionId()

    // If no token and no session, return empty cart
    if (!token && !sessionId) {
      return []
    }

    const response = await fetch("/api/cart", {
      method: "GET",
      headers: getRequestHeaders(),
    })

    const data: CartResponse = await response.json()

    if (data.success && data.data) {
      const cartItems = data.data as CartItem[]
      // Ensure all items have required properties with safe number conversion
      return cartItems.map((item) => {
        const safePrice = safeNumber(item.price)
        const safeQuantity = Math.max(1, safeNumber(item.quantity))
        const calculatedTotal = safePrice * safeQuantity

        return {
          ...item,
          price: safePrice,
          quantity: safeQuantity,
          total: safeNumber(item.total) || calculatedTotal,
          product: {
            name: item.product?.name || item.name || "Unknown Product",
            price: safeNumber(item.product?.price || item.price),
            image_url: item.product?.image_url || item.image_url || "/placeholder.svg",
            images: item.product?.images || [item.image_url || "/placeholder.svg"],
            model: item.product?.model || "Standard Model",
            category: item.product?.category || "Electric Vehicle",
            description: item.product?.description,
          },
        }
      })
    }

    return []
  } catch (error) {
    console.error("Get cart error:", error)
    return []
  }
}

export async function addToCart(productId: number, quantity = 1, color?: string): Promise<CartItem | null> {
  try {
    const safeQuantity = Math.max(1, safeNumber(quantity))
    const sessionId = GuestSession.getSessionId()

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify({
        product_id: productId,
        quantity: safeQuantity,
        color,
        session_id: sessionId,
      }),
    })

    const data: CartResponse = await response.json()

    if (data.success && data.data) {
      // Update session ID if provided (for new guest users)
      if (data.session_id) {
        GuestSession.setSessionId(data.session_id)
      }

      // Dispatch cart updated event
      window.dispatchEvent(new CustomEvent("cartUpdated"))

      const cartItem = data.data as CartItem
      // Ensure safe number conversion for the returned item
      return {
        ...cartItem,
        price: safeNumber(cartItem.price),
        quantity: safeNumber(cartItem.quantity),
        total: safeNumber(cartItem.total) || safeNumber(cartItem.price) * safeNumber(cartItem.quantity),
      }
    }

    throw new Error(data.message || "Failed to add to cart")
  } catch (error) {
    console.error("Add to cart error:", error)
    throw error
  }
}

export async function updateCartQuantity(itemId: string, quantity: number): Promise<boolean> {
  try {
    const safeQuantity = Math.max(1, safeNumber(quantity))

    const response = await fetch(`/api/cart/${itemId}`, {
      method: "PUT",
      headers: getRequestHeaders(),
      body: JSON.stringify({
        quantity: safeQuantity,
        session_id: GuestSession.getSessionId(),
      }),
    })

    const data: CartResponse = await response.json()

    if (data.success) {
      window.dispatchEvent(new CustomEvent("cartUpdated"))
    }

    return data.success
  } catch (error) {
    console.error("Update cart quantity error:", error)
    return false
  }
}

export async function removeFromCart(itemId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: "DELETE",
      headers: getRequestHeaders(),
      body: JSON.stringify({
        session_id: GuestSession.getSessionId(),
      }),
    })

    const data: CartResponse = await response.json()

    if (data.success) {
      window.dispatchEvent(new CustomEvent("cartUpdated"))
    }

    return data.success
  } catch (error) {
    console.error("Remove from cart error:", error)
    return false
  }
}

export async function clearCart(): Promise<boolean> {
  try {
    const response = await fetch("/api/cart/clear", {
      method: "DELETE",
      headers: getRequestHeaders(),
      body: JSON.stringify({
        session_id: GuestSession.getSessionId(),
      }),
    })

    const data: CartResponse = await response.json()

    if (data.success) {
      window.dispatchEvent(new CustomEvent("cartUpdated"))
      window.dispatchEvent(new CustomEvent("cartCleared"))
      return true
    } else {
      throw new Error(data.message || "Failed to clear cart")
    }
  } catch (error) {
    console.error("Clear cart error:", error)
    return false
  }
}

// Transfer guest cart to authenticated user after login
export async function transferGuestCart(): Promise<boolean> {
  try {
    const token = getAuthToken()
    const sessionId = GuestSession.getSessionId()

    if (!token || !sessionId) {
      return false
    }

    const response = await fetch("/api/cart/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    })

    const data: CartResponse = await response.json()

    if (data.success) {
      // Clear guest session after successful transfer
      GuestSession.clearSession()
      window.dispatchEvent(new CustomEvent("cartUpdated"))
      return true
    }

    return false
  } catch (error) {
    console.error("Transfer guest cart error:", error)
    return false
  }
}

// Clear cart after successful checkout with retry logic
export async function clearCartAfterCheckout(): Promise<boolean> {
  try {
    console.log("Clearing cart after checkout...")

    let attempts = 0
    const maxAttempts = 3
    let lastError: Error | null = null

    while (attempts < maxAttempts) {
      try {
        const success = await clearCart()
        if (success) {
          console.log("Cart cleared after successful checkout")
          // Clear guest session if it exists
          GuestSession.clearSession()
          return true
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        console.log(`Cart clear attempt ${attempts + 1} failed:`, lastError.message)
      }

      attempts++
      if (attempts < maxAttempts) {
        console.log(`Waiting before retry attempt ${attempts + 1}...`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    console.error("Failed to clear cart after multiple attempts. Last error:", lastError?.message)
    throw lastError || new Error("Failed to clear cart after multiple attempts")
  } catch (error) {
    console.error("Error clearing cart after checkout:", error)
    return false
  }
}

// Get cart items count - Count unique items, not quantities
export function getCartItemsCount(cartItems: CartItem[]): number {
  if (!Array.isArray(cartItems)) return 0
  return cartItems.length
}

// Get cart total price with safe number handling
export function getCartTotal(cartItems: CartItem[]): number {
  if (!Array.isArray(cartItems)) return 0

  return cartItems.reduce((total, item) => {
    let itemTotal = safeNumber(item.total)
    if (itemTotal === 0) {
      const price = safeNumber(item.price)
      const quantity = safeNumber(item.quantity)
      itemTotal = price * quantity
    }
    return total + itemTotal
  }, 0)
}

// Get cart subtotal (before taxes/shipping) with safe number handling
export function getCartSubtotal(cartItems: CartItem[]): number {
  return getCartTotal(cartItems)
}

// Calculate cart summary with safe number handling
export function getCartSummary(cartItems: CartItem[]) {
  const subtotal = getCartSubtotal(cartItems)
  const itemCount = getCartItemsCount(cartItems)

  const taxRate = 0.08 // 8% tax rate
  const tax = subtotal * taxRate
  const shippingThreshold = 50000 // Free shipping over ₱50,000
  const shippingFee = 500
  const shipping = subtotal > shippingThreshold ? 0 : shippingFee
  const total = subtotal + tax + shipping

  return {
    itemCount,
    subtotal: Math.max(0, subtotal),
    tax: Math.max(0, tax),
    shipping: Math.max(0, shipping),
    total: Math.max(0, total),
  }
}

// Validate cart item data
export function validateCartItem(item: any): boolean {
  if (!item) return false

  const price = safeNumber(item.price)
  const quantity = safeNumber(item.quantity)

  return price >= 0 && quantity > 0 && item.id && item.product_id
}

// Calculate individual item total safely
export function calculateItemTotal(price: number | string, quantity: number | string): number {
  const safePrice = safeNumber(price)
  const safeQuantity = safeNumber(quantity)
  return safePrice * safeQuantity
}
