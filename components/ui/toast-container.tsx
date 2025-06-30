"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import Toast, { type ToastData } from "./etrike-toast"

interface ToastContextType {
  showToast: (toast: Omit<ToastData, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const generateId = useCallback(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }, [])

  const showToast = useCallback(
    (toastData: Omit<ToastData, "id">) => {
      if (!mounted) return

      const id = generateId()
      const newToast: ToastData = {
        ...toastData,
        id,
        duration: toastData.duration ?? 5000,
      }

      setToasts((prev) => [...prev, newToast])
    },
    [mounted, generateId],
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {mounted && (
        <div className="fixed bottom-4 right-4 z-[9999] space-y-3 pointer-events-none">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto max-w-sm w-full">
              <Toast toast={toast} onRemove={removeToast} />
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

// SSR-safe toast hook with proper TypeScript handling
export const useETrikeToast = () => {
  const [mounted, setMounted] = useState(false)
  const context = useContext(ToastContext)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Create safe toast functions that only work when mounted and context is available
  const safeShowToast = useCallback(
    (toastData: Omit<ToastData, "id">) => {
      if (mounted && context) {
        context.showToast(toastData)
      }
    },
    [mounted, context],
  )

  // Return functions that are safe during SSR
  return {
    success: (title: string, message?: string, action?: ToastData["action"]) => {
      if (mounted && context) {
        safeShowToast({ type: "success", title, message, action })
      }
    },

    error: (title: string, message?: string, action?: ToastData["action"]) => {
      if (mounted && context) {
        safeShowToast({ type: "error", title, message, action })
      }
    },

    warning: (title: string, message?: string, action?: ToastData["action"]) => {
      if (mounted && context) {
        safeShowToast({ type: "warning", title, message, action })
      }
    },

    info: (title: string, message?: string, action?: ToastData["action"]) => {
      if (mounted && context) {
        safeShowToast({ type: "info", title, message, action })
      }
    },

    cartAdded: (productName: string, action?: ToastData["action"]) => {
      if (mounted && context) {
        safeShowToast({
          type: "success",
          title: "⚡ Added to Cart!",
          message: `${productName} has been added to your cart`,
          action: action ?? {
            label: "View Cart",
            onClick: () => {
              if (typeof window !== "undefined") {
                window.location.href = "/cart"
              }
            },
          },
        })
      }
    },

    cartUpdated: (message = "Cart updated successfully") => {
      if (mounted && context) {
        safeShowToast({
          type: "success",
          title: "🔄 Cart Updated",
          message,
        })
      }
    },

    orderPlaced: (orderNumber: string) => {
      if (mounted && context) {
        safeShowToast({
          type: "success",
          title: "🎉 Order Placed!",
          message: `Your order #${orderNumber} has been confirmed`,
          duration: 7000,
          action: {
            label: "Track Order",
            onClick: () => {
              if (typeof window !== "undefined") {
                window.location.href = "/orders"
              }
            },
          },
        })
      }
    },

    authSuccess: (message: string) => {
      if (mounted && context) {
        safeShowToast({
          type: "success",
          title: "🔐 Welcome!",
          message,
        })
      }
    },

    powerUp: (title: string, message?: string) => {
      if (mounted && context) {
        safeShowToast({
          type: "info",
          title: `⚡ ${title}`,
          message,
        })
      }
    },
  }
}
