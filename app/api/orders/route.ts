import { type NextRequest, NextResponse } from "next/server"

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    console.log("Orders API - Auth header:", authHeader ? "Present" : "Missing")

    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    console.log("Making request to Laravel API:", `${NEXT_PUBLIC_LARAVEL_API_URL}/orders`)

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/orders`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    console.log("Laravel response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Laravel API error:", errorText)
      return NextResponse.json(
        { success: false, message: `Laravel API error: ${response.status}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Laravel response data:", data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Orders API error:", error)

    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json({ success: false, message: "Internal server error", error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Orders POST error:", error)

    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json({ success: false, message: "Internal server error", error: errorMessage }, { status: 500 })
  }
}
