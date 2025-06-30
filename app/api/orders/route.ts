import { type NextRequest, NextResponse } from "next/server"

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    // Orders listing requires authentication
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/orders`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Orders GET error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const body = await request.json()

    // Orders can be created by both authenticated and guest users
    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    // Add authorization header if present (for authenticated users)
    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    console.log("Creating order:", {
      hasAuth: !!authHeader,
      isGuest: body.is_guest,
      email: body.shipping_info?.email,
    })

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()

    console.log("Order creation response:", {
      status: response.status,
      success: data.success,
      message: data.message,
    })

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Orders POST error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
