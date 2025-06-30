import { type NextRequest, NextResponse } from "next/server"

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    // Cart transfer requires authentication
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()

    const headers: HeadersInit = {
      Authorization: authHeader,
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/cart/transfer`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Cart transfer error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
