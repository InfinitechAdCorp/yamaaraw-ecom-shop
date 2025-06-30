import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ChatbotWrapper from "@/components/chatbot-wrapper"
import SocialMediaFloat from "@/components/social-media-float"
import { CartProvider } from "@/contexts/cart-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { ToastProvider } from "@/components/ui/toast-container"
import NotificationToastBridge from "@/components/notification-toast-bridge"
import PWAInstallPrompt from "@/components/pwa-install-prompt"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YAMAARAW",
  description: "YAMAARAW PWA",
  manifest: "/manifest.json",
  generator: "PWA",
  themeColor: "#FFFFFF",
  icons: [{ rel: "apple-touch-icon", url: "/icon512_rounded.png" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YAMAARAW" />
        <link rel="apple-touch-icon" href="/icon512_rounded.png" />
        <link rel="icon" href="/icon512_rounded.png" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <CartProvider>
            <NotificationProvider>
              <NotificationToastBridge />
              {children}
              <PWAInstallPrompt />
              <SocialMediaFloat />
              <ChatbotWrapper />
            </NotificationProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
