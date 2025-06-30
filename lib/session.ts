import type { NextRequest } from "next/server"
import type { User } from "./types"

export interface SessionData {
  user: User
  token: string
  expires: string
}

// Get session from request (for API routes)
export function getSessionFromRequest(request: NextRequest): SessionData | null {
  try {
    const sessionCookie = request.cookies.get("session")

    if (!sessionCookie?.value) {
      return null
    }

    const sessionData = JSON.parse(sessionCookie.value)

    // Check if session is expired
    if (new Date(sessionData.expires) < new Date()) {
      return null
    }

    return sessionData
  } catch (error) {
    console.error("Error getting session from request:", error)
    return null
  }
}

// Client-side session helpers
export function getClientSession(): SessionData | null {
  if (typeof window === "undefined") return null

  try {
    const sessionStr = localStorage.getItem("session")
    if (!sessionStr) return null

    const sessionData = JSON.parse(sessionStr)

    // Check if session is expired
    if (new Date(sessionData.expires) < new Date()) {
      localStorage.removeItem("session")
      return null
    }

    return sessionData
  } catch (error) {
    console.error("Error getting client session:", error)
    return null
  }
}

export function setClientSession(sessionData: SessionData): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("session", JSON.stringify(sessionData))
  } catch (error) {
    console.error("Error setting client session:", error)
  }
}

export function clearClientSession(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("session")
  } catch (error) {
    console.error("Error clearing client session:", error)
  }
}

// Client-side getCurrentUser function
export function getCurrentUser(): User | null {
  const session = getClientSession()
  return session?.user || null
}

// Client-side getAuthToken function
export function getAuthToken(): string | null {
  const session = getClientSession()
  return session?.token || null
}
