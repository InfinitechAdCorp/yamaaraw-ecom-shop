"use client"

import { useState, useEffect } from "react"
import { Download, X, Zap, Smartphone } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (typeof window !== "undefined") {
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches
        const isInWebAppiOS = (window.navigator as any).standalone === true
        const isInstalled = isStandalone || isInWebAppiOS
        setIsInstalled(isInstalled)

        // Show floating button if not installed and not dismissed
        const dismissed = localStorage.getItem("pwa-install-dismissed")
        const lastDismissed = localStorage.getItem("pwa-install-last-dismissed")
        const now = Date.now()
        const daysSinceLastDismiss = lastDismissed ? (now - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24) : 999

        if (!isInstalled && (!dismissed || daysSinceLastDismiss > 7)) {
          // Show floating button after 5 seconds on homepage
          setTimeout(() => setShowFloatingButton(true), 5000)
        }
      }
    }

    checkIfInstalled()

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("PWA: beforeinstallprompt event fired")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Don't show if already dismissed recently or installed
      const dismissed = localStorage.getItem("pwa-install-dismissed")
      const lastDismissed = localStorage.getItem("pwa-install-last-dismissed")
      const now = Date.now()
      const daysSinceLastDismiss = lastDismissed ? (now - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24) : 999

      if ((!dismissed || daysSinceLastDismiss > 7) && !isInstalled) {
        setTimeout(() => setShowInstallPrompt(true), 3000)
      }
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log("PWA: App installed successfully")
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setShowFloatingButton(false)
      setDeferredPrompt(null)
      localStorage.removeItem("pwa-install-dismissed")
      localStorage.removeItem("pwa-install-last-dismissed")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Debug info
    if (process.env.NODE_ENV === "development") {
      console.log("PWA: Install prompt component loaded")
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          console.log("PWA: Service Worker registrations:", registrations.length)
        })
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("PWA: No deferred prompt available")
      return
    }

    try {
      console.log("PWA: Showing install prompt")
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      console.log("PWA: User choice:", outcome)

      if (outcome === "accepted") {
        console.log("PWA: User accepted the install prompt")
      } else {
        console.log("PWA: User dismissed the install prompt")
        handleDismiss()
      }

      setDeferredPrompt(null)
      setShowInstallPrompt(false)
      setShowFloatingButton(false)
    } catch (error) {
      console.error("PWA: Error during installation:", error)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    setShowFloatingButton(false)
    localStorage.setItem("pwa-install-dismissed", "true")
    localStorage.setItem("pwa-install-last-dismissed", Date.now().toString())

    // Clear dismissal after 7 days
    setTimeout(
      () => {
        localStorage.removeItem("pwa-install-dismissed")
      },
      7 * 24 * 60 * 60 * 1000,
    )
  }

  const handleFloatingButtonClick = () => {
    setShowFloatingButton(false)
    setShowInstallPrompt(true)
  }

  // Floating install button (bottom-right corner)
  if (!isInstalled && showFloatingButton && !showInstallPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleFloatingButtonClick}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm animate-pulse h-16 w-16 p-0 group"
          title="Install YAMAARAW App"
        >
          <Download className="w-7 h-7 group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    )
  }

  // Full install prompt (bottom banner)
  if (!isInstalled && showInstallPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-md mx-auto bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl shadow-2xl p-4 border border-white/20 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Install YAMAARAW App</h3>
                <p className="text-white/80 text-xs">Get the full experience!</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 h-6 w-6 p-0 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          <p className="text-white/90 text-xs mb-4 leading-relaxed">
            🚀 Faster loading • 📱 Works offline • 🔔 Push notifications • 🎯 Quick access to cart & favorites
          </p>

          <div className="flex space-x-2">
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="bg-white text-purple-600 hover:bg-white/90 font-bold flex-1 h-9 text-xs"
              disabled={!deferredPrompt}
            >
              <Download className="w-3 h-3 mr-1" />
              {deferredPrompt ? "Install Now" : "Not Available"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 h-9 px-3 text-xs font-medium"
            >
              Maybe Later
            </Button>
          </div>

          {/* Debug info in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-2 text-xs text-white/70 bg-black/20 rounded p-1">
              Debug: {deferredPrompt ? "✅ Prompt ready" : "❌ No prompt"} | Installed: {isInstalled ? "Yes" : "No"}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
