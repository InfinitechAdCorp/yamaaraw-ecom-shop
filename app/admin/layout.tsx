"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/layout/admin-sidebar"
import { getCurrentUser } from "@/lib/auth"
import type { User } from "@/lib/types"
import ETrikeLoader from "@/components/ui/etrike-loader"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Prevent multiple auth checks
    if (hasCheckedAuth) return

    const currentUser = getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setIsLoading(false)
    setHasCheckedAuth(true)
  }, [hasCheckedAuth, router])

  if (isLoading) {
    return <ETrikeLoader />
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
