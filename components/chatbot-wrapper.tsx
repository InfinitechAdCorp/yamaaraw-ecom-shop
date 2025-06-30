"use client"

import { usePathname } from "next/navigation"
import GlobalChatbot from "@/components/chatbot"

export default function ChatbotWrapper() {
  const pathname = usePathname()

  // Hide chatbot on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return <GlobalChatbot />
}
