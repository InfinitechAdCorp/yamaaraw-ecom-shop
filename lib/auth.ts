import type { User, AuthResponse } from "./types"
import { setClientSession, clearClientSession, getCurrentUser as getClientUser } from "./session"

// Export the User type for external use
export type { User } from "./types"

export async function register(email: string, password: string, name: string): Promise<User | null> {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data: AuthResponse = await response.json()

    if (data.success && data.data) {
      // Create session data
      const sessionData = {
        user: data.data.user,
        token: data.data.token,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }

      // Store session
      setClientSession(sessionData)

      return data.data.user
    }

    throw new Error(data.message || "Registration failed")
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export async function login(email: string, password: string): Promise<{ user: User; redirectTo: string } | null> {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data: AuthResponse = await response.json()

    if (data.success && data.data) {
      // Create session data
      const sessionData = {
        user: data.data.user,
        token: data.data.token,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }

      // Store session
      setClientSession(sessionData)

      // Determine redirect based on user role
      const redirectTo = data.data.user.role === "admin" ? "/admin" : "/"

      return {
        user: data.data.user,
        redirectTo,
      }
    }

    throw new Error(data.message || "Login failed")
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export async function logout(): Promise<void> {
  try {
    const token = getAuthToken()
    if (token) {
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    // Always clear session
    clearClientSession()
  }
}

export function getCurrentUser(): User | null {
  return getClientUser()
}

export function getAuthToken(): string | null {
  try {
    const sessionData = localStorage.getItem("session")
    if (!sessionData) return null
    const session = JSON.parse(sessionData)
    return session.token || null
  } catch (error) {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "admin"
}
