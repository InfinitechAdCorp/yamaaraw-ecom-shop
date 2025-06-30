import { type NextRequest, NextResponse } from "next/server"

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL 

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Authorization header required" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Forward request to Laravel API
    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/admin/customers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Laravel API error:", errorData)
      return NextResponse.json(
        { success: false, message: `Laravel API error: ${response.status}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
