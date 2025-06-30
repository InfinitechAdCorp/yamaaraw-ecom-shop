"use client"

import { useEffect } from "react"
import { useETrikeToast } from "@/components/ui/toast-container"

export default function ToastIntegration() {
  const toast = useETrikeToast()

  useEffect(() => {
    // Override the global toast function with the actual toast
    if (typeof window !== "undefined") {
      ;(window as any).showToast = ({ type, title, message }: { type: string; title: string; message?: string }) => {
        switch (type) {
          case "success":
            toast.success(title, message)
            break
          case "error":
            toast.error(title, message)
            break
          case "warning":
            toast.warning(title, message)
            break
          case "info":
            toast.info(title, message)
            break
          default:
            toast.info(title, message)
        }
      }
    }
  }, [toast])

  return null
}
