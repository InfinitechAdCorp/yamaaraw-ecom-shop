"use client"

import { useEffect, useState } from "react"
import { useETrikeToast } from "@/components/ui/toast-container"

// Alternative client-only hook for extra safety
export const useClientToast = () => {
  const [mounted, setMounted] = useState(false)
  const toast = useETrikeToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return no-op functions during SSR
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      cartAdded: () => {},
      cartUpdated: () => {},
      orderPlaced: () => {},
      authSuccess: () => {},
      powerUp: () => {},
    }
  }

  return toast
}
