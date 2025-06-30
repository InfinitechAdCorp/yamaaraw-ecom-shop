import { type NextRequest, NextResponse } from "next/server"

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL 

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    // Extract the token from Bearer header
    const token = authHeader.replace("Bearer ", "")

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/admin/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Laravel API error:", errorText)
      return NextResponse.json(
        { success: false, message: `Laravel API error: ${response.status}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.error("Dashboard API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error", error: errorMessage }, { status: 500 })
  }
}
