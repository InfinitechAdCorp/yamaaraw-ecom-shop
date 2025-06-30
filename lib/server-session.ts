import { cookies } from "next/headers"
import type { User } from "./types"

export interface SessionData {
  user: User
  token: string
  expires: string
}

// Server-side session management
export async function getServerSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

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
    console.error("Error getting server session:", error)
    return null
  }
}

export async function setServerSession(sessionData: SessionData): Promise<void> {
  try {
    const cookieStore = await cookies()

    cookieStore.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })
  } catch (error) {
    console.error("Error setting server session:", error)
  }
}

export async function clearServerSession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("session")
  } catch (error) {
    console.error("Error clearing server session:", error)
  }
}

// Server-side getCurrentUser function
export async function getCurrentUserServer(): Promise<User | null> {
  const session = await getServerSession()
  return session?.user || null
}

// Get auth token from server session
export async function getAuthTokenServer(): Promise<string | null> {
  const session = await getServerSession()
  return session?.token || null
}
