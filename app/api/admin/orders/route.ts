import { type NextRequest, NextResponse } from "next/server"

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    console.log("Admin Orders API - Auth header:", authHeader ? "Present" : "Missing")

    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    console.log("Making request to Laravel API:", `${NEXT_PUBLIC_LARAVEL_API_URL}/admin/orders`)

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/admin/orders`, {
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.error("Admin Orders API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error", error: errorMessage }, { status: 500 })
  }
}
