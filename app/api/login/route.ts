import { type NextRequest, NextResponse } from "next/server"

const NEXT_PUBLIC_LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Login request:", body)

    const response = await fetch(`${NEXT_PUBLIC_LARAVEL_API_URL}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log("Laravel login response:", data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
